'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FiRefreshCw, FiInfo, FiX } from 'react-icons/fi';
import { GenerationState, ModelType, OutputFormatType } from '@/types/generation';
import { useGenerationStore } from '@/store/generationStore';
import AdvancedSettings from './AdvancedSettings';

export default function ImageGenerator() {
  const { 
    addToHistory, 
    defaultModel, 
    defaultResponseFormat, 
    defaultFileFormat 
  } = useGenerationStore();

  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showTips, setShowTips] = useState(true);
  const [advancedSettings, setAdvancedSettings] = useState({
    width: 1024,
    height: 1024,
    steps: 4,
    seed: -1,
    model: defaultModel,
    responseFormat: defaultResponseFormat,
    fileFormat: defaultFileFormat
  });
  
  const [generation, setGeneration] = useState<GenerationState>({
    isGenerating: false,
    result: null,
    error: null,
  });

  useEffect(() => {
    setAdvancedSettings(prev => ({
      ...prev,
      model: defaultModel,
      responseFormat: defaultResponseFormat,
      fileFormat: defaultFileFormat
    }));
  }, [defaultModel, defaultResponseFormat, defaultFileFormat]);

  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleNegativePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNegativePrompt(e.target.value);
  };

  const generateImage = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setGeneration({
        ...generation,
        error: '请输入提示词以生成图像',
      });
      return;
    }

    try {
      setGeneration({
        isGenerating: true,
        result: null,
        error: null,
      });

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt,
          negative_prompt: negativePrompt,
          width: advancedSettings.width,
          height: advancedSettings.height,
          num_inference_steps: advancedSettings.steps,
          seed: advancedSettings.seed,
          model: advancedSettings.model,
          response_format: advancedSettings.responseFormat,
          file_format: advancedSettings.fileFormat
        }),
      });

      const data = await response.json();
      
      console.log('API响应数据:', data);

      if (!response.ok) {
        throw new Error(data.error || '生成图像失败');
      }

      const hasImageData = data.b64_json || data.url;
      if (!hasImageData) {
        console.warn('API返回数据缺少图像数据:', data);
      }

      setGeneration({
        isGenerating: false,
        result: data,
        error: null,
      });

      if (hasImageData) {
        addToHistory({
          id: uuidv4(),
          prompt,
          negativePrompt,
          timestamp: Date.now(),
          imageData: data.b64_json || data.url,
          parameters: {
            width: advancedSettings.width,
            height: advancedSettings.height,
            steps: advancedSettings.steps,
            seed: advancedSettings.seed,
            model: advancedSettings.model as ModelType,
            fileFormat: advancedSettings.fileFormat as OutputFormatType
          }
        });
      }
    } catch (error: unknown) {
      const err = error as Error & { message?: string };
      console.error('生成图像出错:', err);
      setGeneration({
        isGenerating: false,
        result: null,
        error: err.message || '生成图像失败',
      });
    }
  };

  const promptTips = [
    "尝试描述场景、风格、光线和氛围，如 '夕阳下的海滩场景，橙红色天空，电影镜头感'",
    "添加艺术风格描述，例如 '水彩画风格'、'赛博朋克风格'、'宫崎骏动画风格'",
    "负面提示词可以帮助避免不想要的元素，如 '模糊, 低质量, 变形'",
    "为获得更好的生成效果，可以尝试不同的模型和步数"
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          AI 文生图
          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            Nebius API
          </span>
        </h2>
        
        {showTips && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100 relative">
            <button 
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowTips(false)}
            >
              <FiX size={18} />
            </button>
            <div className="flex items-start">
              <FiInfo className="mr-2 mt-0.5 text-blue-500" size={18} />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-2">提示技巧</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  {promptTips.map((tip, index) => (
                    <li key={index} className="list-disc ml-4">{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={generateImage} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="prompt" className="block text-sm font-medium">
                提示词 (描述你想要生成的图像) <span className="text-red-500 text-xs">请输入英文提示词，中文提示词无法准确出图</span>
              </label>
              <span className="text-xs text-gray-500">
                {prompt.length} 字符
              </span>
            </div>
            <textarea
              id="prompt"
              value={prompt}
              onChange={handlePromptChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="例如: 一只可爱的小猫在阳光明媚的花园里玩耍，高清照片风格"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="negativePrompt" className="block text-sm font-medium">
                负面提示词 (可选，描述你不想在图像中出现的内容)
              </label>
              <span className="text-xs text-gray-500">
                {negativePrompt.length} 字符
              </span>
            </div>
            <textarea
              id="negativePrompt"
              value={negativePrompt}
              onChange={handleNegativePromptChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="例如: 模糊, 低质量, 扭曲, 过度饱和, 噪点"
            />
          </div>

          <AdvancedSettings 
            settings={advancedSettings}
            onSettingsChange={setAdvancedSettings}
          />

          <button
            type="submit"
            disabled={generation.isGenerating}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md shadow transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {generation.isGenerating ? (
              <>
                <FiRefreshCw className="animate-spin mr-2" />
                正在生成图像...
              </>
            ) : '生成图像'}
          </button>
        </form>
      </div>

      {generation.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          <p>{generation.error}</p>
        </div>
      )}

      {generation.isGenerating && (
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-64 w-64 bg-gray-300 rounded-md loading-shimmer"></div>
            <div className="mt-4 text-lg text-gray-900">正在生成您的图像，请稍候...</div>
            <p className="text-sm text-gray-500 mt-2">
              这可能需要几秒到几十秒时间，取决于图像复杂度和服务器负载
            </p>
          </div>
        </div>
      )}

      {!generation.isGenerating && generation.result && generation.result.b64_json && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">生成结果</h3>
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-lg">
              <img
                src={`data:image/${advancedSettings.fileFormat === 'png' ? 'png' : 'jpeg'};base64,${generation.result.b64_json}`}
                alt="生成的图像"
                className="w-full h-auto rounded-md shadow-md"
              />
            </div>
            <div className="mt-4 w-full flex justify-between">
              <p className="text-sm text-gray-600 italic">{prompt}</p>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {!generation.isGenerating && generation.result && generation.result.url && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">生成结果</h3>
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-lg">
              <img
                src={generation.result.url}
                alt="生成的图像"
                className="w-full h-auto rounded-md shadow-md"
              />
            </div>
            <div className="mt-4 w-full flex justify-between">
              <p className="text-sm text-gray-600 italic">{prompt}</p>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}