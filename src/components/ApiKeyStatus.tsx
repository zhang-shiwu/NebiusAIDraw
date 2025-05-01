'use client';

import { useState, useEffect } from 'react';
import { FiRefreshCw, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

interface KeyStat {
  key: string; // 实际使用时会被掩码显示
  useCount: number;
  errorCount: number;
  lastUsed: string;
  isActive: boolean;
}

export default function ApiKeyStatus() {
  const [keyStats, setKeyStats] = useState<KeyStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKeyStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/key-status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '获取密钥状态失败');
      }

      const data = await response.json();
      setKeyStats(data.keyStats);
    } catch (err: any) {
      console.error('获取密钥状态出错:', err);
      setError(err.message || '获取密钥状态失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeyStats();
  }, []);

  // 格式化日期时间显示
  const formatDateTime = (dateString: string) => {
    if (!dateString) return '未使用';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // 掩码显示API密钥，只显示前3位和后4位
  const maskApiKey = (key: string) => {
    if (!key) return '未设置';
    if (key.length < 8) return '***';
    return `${key.substring(0, 3)}...${key.substring(key.length - 4)}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">API 密钥状态</h3>
        <button
          onClick={fetchKeyStats}
          disabled={loading}
          className="flex items-center text-sm px-3 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
        >
          {loading ? (
            <FiRefreshCw className="animate-spin mr-1" size={14} />
          ) : (
            <FiRefreshCw className="mr-1" size={14} />
          )}
          刷新
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm flex items-center">
          <FiAlertCircle className="mr-2" />
          {error}
        </div>
      )}

      {keyStats.length === 0 && !loading && !error ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">暂无密钥信息</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-3">密钥</th>
                <th className="text-left py-2 px-3">状态</th>
                <th className="text-left py-2 px-3">使用次数</th>
                <th className="text-left py-2 px-3">出错次数</th>
                <th className="text-left py-2 px-3">最后使用</th>
              </tr>
            </thead>
            <tbody>
              {keyStats.map((stat, index) => (
                <tr 
                  key={index} 
                  className={`border-b dark:border-gray-700 ${
                    stat.isActive ? '' : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  <td className="py-2 px-3 font-mono">{maskApiKey(stat.key)}</td>
                  <td className="py-2 px-3">
                    <span className={`flex items-center ${
                      stat.isActive 
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stat.isActive 
                        ? <><FiCheckCircle className="mr-1" /> 活跃</> 
                        : <><FiAlertCircle className="mr-1" /> 已禁用</>
                      }
                    </span>
                  </td>
                  <td className="py-2 px-3">{stat.useCount}</td>
                  <td className="py-2 px-3">{stat.errorCount}</td>
                  <td className="py-2 px-3">{formatDateTime(stat.lastUsed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}