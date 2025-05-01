import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { ModelType, ResponseFormatType, OutputFormatType } from '@/types/generation';

// 增强API密钥轮询逻辑
let currentKeyIndex = 0;
const keyStats: {
  [key: string]: {
    uses: number, 
    errors: number, 
    lastUsed: number
  }
} = {};

function getNextApiKey(): string {
  const apiKeys = (process.env.NEBIUS_API_KEYS || process.env.NEBIUS_API_KEY || '').split(',').filter(Boolean);
  
  if (apiKeys.length === 0) {
    throw new Error('未配置API密钥');
  }
  
  // 如果有多个密钥，尝试找到最优的密钥
  if (apiKeys.length > 1) {
    const now = Date.now();
    // 按使用次数和最后使用时间排序
    const sortedKeyIndices = apiKeys
      .map((_, index) => index)
      .sort((a, b) => {
        const keyA = apiKeys[a].trim();
        const keyB = apiKeys[b].trim();
        const statsA = keyStats[keyA] || {uses: 0, errors: 0, lastUsed: 0};
        const statsB = keyStats[keyB] || {uses: 0, errors: 0, lastUsed: 0};
        
        // 首先按错误数量排序（错误少的优先）
        if (statsA.errors !== statsB.errors) {
          return statsA.errors - statsB.errors;
        }
        
        // 然后按使用次数排序
        if (statsA.uses !== statsB.uses) {
          return statsA.uses - statsB.uses;
        }
        
        // 最后按最近使用时间排序（较早使用的优先）
        return statsA.lastUsed - statsB.lastUsed;
      });
    
    currentKeyIndex = sortedKeyIndices[0];
  }
  
  // 获取选定的API密钥
  const key = apiKeys[currentKeyIndex].trim();
  
  // 更新密钥统计信息
  if (!keyStats[key]) {
    keyStats[key] = {
      uses: 0, 
      errors: 0, 
      lastUsed: 0
    };
  }
  keyStats[key].uses++;
  keyStats[key].lastUsed = Date.now();
  
  // 更新索引以便下次调用
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  
  return key;
}

// 标记密钥发生错误
function markKeyError(key: string) {
  if (!keyStats[key]) {
    keyStats[key] = {uses: 0, errors: 0, lastUsed: 0};
  }
  keyStats[key].errors++;
}

export async function POST(req: NextRequest) {
  try {
    // 从请求中获取提示词和高级设置
    const { 
      prompt, 
      negative_prompt,
      width = 1024,
      height = 1024,
      num_inference_steps = 4,
      seed = -1,
      model = 'black-forest-labs/flux-schnell',
      response_format = 'b64_json',
      file_format = 'png'
    } = await req.json();
    
    if (!prompt || prompt.trim() === '') {
      return NextResponse.json({ error: '提示词不能为空' }, { status: 400 });
    }

    // 验证参数
    const validModel = ['black-forest-labs/flux-schnell', 'black-forest-labs/flux-dev'].includes(model);
    const validResponseFormat = ['b64_json', 'url'].includes(response_format);
    const validFileFormat = ['png', 'jpg', 'webp'].includes(file_format);

    if (!validModel) {
      return NextResponse.json({ error: '无效的模型' }, { status: 400 });
    }

    if (!validResponseFormat) {
      return NextResponse.json({ error: '无效的响应格式' }, { status: 400 });
    }

    if (!validFileFormat) {
      return NextResponse.json({ error: '无效的文件格式' }, { status: 400 });
    }

    // 从轮询系统中获取下一个API密钥
    let apiKey = getNextApiKey();
    let retryCount = 0;
    const maxRetries = 3;

    // 添加重试逻辑
    while (retryCount < maxRetries) {
      try {
        // 调用Nebius API生成图像
        const response = await axios.post(
          'https://api.studio.nebius.com/v1/images/generations',
          {
            model,
            response_format,
            prompt,
            extra_body: {
              response_extension: file_format,
              width: Number(width),
              height: Number(height),
              num_inference_steps: Number(num_inference_steps),
              negative_prompt: negative_prompt || '',
              seed: Number(seed)
            }
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            }
          }
        );

        // 从响应中提取图像数据
        const imageData = response.data?.data?.[0] || response.data;
        
        return NextResponse.json({
          b64_json: imageData.b64_json || null,
          url: imageData.url || null,
          stats: {
            usedKey: apiKey.substring(0, 8) + '...',
            keyStats: Object.entries(keyStats).reduce((acc, [k, v]) => {
              // 只显示密钥的前8位，保护密钥安全
              acc[k.substring(0, 8) + '...'] = v;
              return acc;
            }, {} as typeof keyStats)
          }
        });
      } catch (error: any) {
        console.error(`API密钥 ${apiKey.substring(0, 8)}... 请求失败:`, error.response?.data || error.message);
        
        // 记录密钥错误
        markKeyError(apiKey);
        
        // 只有在是API密钥相关错误时才重试
        const errorStatus = error.response?.status;
        if (errorStatus === 401 || errorStatus === 403 || errorStatus === 429) {
          retryCount++;
          if (retryCount < maxRetries) {
            console.log(`尝试使用下一个API密钥，重试 ${retryCount}/${maxRetries}`);
            apiKey = getNextApiKey();
            continue;
          }
        }
        
        throw error; // 其他错误或重试次数用完，重新抛出
      }
    }

    throw new Error('所有API密钥都失败了，请稍后再试');
  } catch (error: any) {
    console.error('生成图像时出错:', error.response?.data || error.message);
    let errorMessage = '生成图像时出错';
    let statusCode = 500;
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      errorMessage = 'API密钥无效或已过期';
    } else if (error.response?.status === 429) {
      errorMessage = 'API请求太频繁，请稍后再试';
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error.response?.data || error.message },
      { status: statusCode }
    );
  }
}