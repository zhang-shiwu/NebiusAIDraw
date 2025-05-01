'use client';

import { useState } from 'react';
import { FiTrash2, FiDownload, FiRepeat, FiExternalLink, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useGenerationStore, GeneratedImage } from '@/store/generationStore';

interface HistoryPanelProps {
  onSelectPrompt: (item: Pick<GeneratedImage, 'prompt' | 'negativePrompt' | 'parameters'>) => void;
}

export default function HistoryPanel({ onSelectPrompt }: HistoryPanelProps) {
  const { history, removeFromHistory, clearHistory } = useGenerationStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 每页显示6张图片
  
  // 计算总页数
  const totalPages = Math.ceil(history.length / itemsPerPage);
  
  // 获取当前页的历史记录
  const currentItems = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleClearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要清空所有历史记录吗？')) {
      clearHistory();
      setCurrentPage(1); // 重置到第一页
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleImageAction = (imageData: string) => {
    // 判断imageData是URL还是Base64
    if (imageData.startsWith('http')) {
      window.open(imageData, '_blank');
    } else {
      // 作为Base64下载
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${imageData}`;
      link.download = `ai-image-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const reapplyPrompt = (item: GeneratedImage) => {
    onSelectPrompt(item);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength = 60) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // 判断图像数据是URL还是Base64
  const isUrlImage = (imageData: string) => {
    return imageData?.startsWith?.('http') || false;
  };
  
  // 安全地获取模型名称
  const getModelName = (model?: string) => {
    if (!model) return '未知';
    const parts = model.split('/');
    return parts.length > 1 ? parts[1] : model;
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 rounded-lg border border-purple-100 dark:border-purple-900/30">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <span className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full font-semibold shadow-sm">
            📸 {history.length} 个记录
          </span>
        </div>
        {history.length > 0 && (
          <button
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm flex items-center cursor-pointer bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm hover:shadow transition-all"
            onClick={handleClearHistory}
          >
            <FiTrash2 className="mr-1" />
            清空记录
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 rounded-lg shadow-sm">
          <div className="text-6xl mb-3">📷</div>
          <div>暂无历史记录，生成图像后将会显示在这里</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="border border-purple-200 dark:border-purple-900/50 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
              >
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-900">
                  {isUrlImage(item.imageData) ? (
                    <img
                      src={item.imageData}
                      alt={item.prompt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // 图片加载失败时显示替代内容
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <img
                      src={`data:image/${item.parameters.fileFormat || 'png'};base64,${item.imageData}`}
                      alt={item.prompt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';
                      }}
                    />
                  )}
                  <div className="absolute bottom-0 right-0 p-2 flex space-x-1">
                    <div
                      className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all"
                      onClick={() => reapplyPrompt(item)}
                      title="重新使用此提示词"
                    >
                      <FiRepeat size={16} />
                    </div>
                    <div
                      className="p-1.5 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full shadow hover:from-green-600 hover:to-teal-600 cursor-pointer transition-all"
                      onClick={() => handleImageAction(item.imageData)}
                      title={isUrlImage(item.imageData) ? "在新窗口中打开" : "下载图像"}
                    >
                      {isUrlImage(item.imageData) ? (
                        <FiExternalLink size={16} />
                      ) : (
                        <FiDownload size={16} />
                      )}
                    </div>
                    <div
                      className="p-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full shadow hover:from-red-600 hover:to-orange-600 cursor-pointer transition-all"
                      onClick={() => {
                        removeFromHistory(item.id);
                        // 如果当前页已经没有项目了，且不是第一页，则回到上一页
                        if (currentItems.length === 1 && currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                        }
                      }}
                      title="从历史记录中删除"
                    >
                      <FiTrash2 size={16} />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                    <span className="mr-1">🕒</span> {formatDate(item.timestamp)}
                  </div>
                  <p className="text-sm font-medium line-clamp-2 text-purple-800 dark:text-purple-300" title={item.prompt}>
                    {truncateText(item.prompt)}
                  </p>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap">
                    <span className="mr-2">📏 {item.parameters.width}×{item.parameters.height}</span>
                    <span className="mr-2">🔄 步数: {item.parameters.steps}</span>
                    <span className="mr-2">🤖 模型: {getModelName(item.parameters.model)}</span>
                    <span>📄 格式: {isUrlImage(item.imageData) ? 'URL' : item.parameters.fileFormat?.toUpperCase() || 'PNG'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 分页控制 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <nav className="flex items-center bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-purple-600 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/30'
                  }`}
                  aria-label="上一页"
                >
                  <FiChevronLeft size={20} />
                </button>
                
                <div className="mx-4 font-medium">
                  第 {currentPage} 页 / 共 {totalPages} 页
                </div>
                
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-purple-600 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/30'
                  }`}
                  aria-label="下一页"
                >
                  <FiChevronRight size={20} />
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}