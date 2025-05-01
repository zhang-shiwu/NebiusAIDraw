'use client';

import { useState } from 'react';
import { FiSettings, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { ModelType, ResponseFormatType, OutputFormatType } from '@/types/generation';

interface AdvancedSettingsProps {
  settings: {
    width: number;
    height: number;
    steps: number;
    seed: number;
    model: ModelType;
    responseFormat: ResponseFormatType;
    fileFormat: OutputFormatType;
  };
  onSettingsChange: (settings: any) => void;
}

export default function AdvancedSettings({ settings, onSettingsChange }: AdvancedSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // 数值类型的特殊处理
    if (name === 'seed') {
      onSettingsChange({
        ...settings,
        [name]: value === '-1' ? -1 : parseInt(value)
      });
    } else if (name === 'steps' || name === 'width' || name === 'height') {
      onSettingsChange({
        ...settings,
        [name]: parseInt(value)
      });
    } else {
      // 字符串类型直接设置
      onSettingsChange({
        ...settings,
        [name]: value
      });
    }
  };

  const togglePanel = (e: React.MouseEvent) => {
    // 阻止事件冒泡，防止点击高级设置按钮触发表单提交
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSizeClick = (width: number, height: number, e: React.MouseEvent) => {
    // 阻止事件冒泡，防止点击尺寸按钮触发表单提交
    e.preventDefault();
    e.stopPropagation();
    onSettingsChange({
      ...settings,
      width,
      height,
    });
  };

  const presetSizes = [
    { width: 512, height: 512, label: '512×512' },
    { width: 768, height: 768, label: '768×768' },
    { width: 1024, height: 1024, label: '1024×1024' },
    { width: 1024, height: 576, label: '1024×576' },
    { width: 576, height: 1024, label: '576×1024' },
    { width: 1024, height: 768, label: '1024×768' },
    { width: 768, height: 1024, label: '768×1024' },
    { width: 1280, height: 720, label: '1280×720' },
    { width: 1920, height: 1080, label: '1920×1080' },
    { width: 2000, height: 2000, label: '2000×2000' },
  ];

  const modelOptions = [
    { value: 'black-forest-labs/flux-schnell', label: '✨ flux-schnell (快速)' },
    { value: 'black-forest-labs/flux-dev', label: '🔥 flux-dev (开发版)' },
  ];

  const responseFormatOptions = [
    { value: 'b64_json', label: '📦 Base64 JSON' },
    { value: 'url', label: '🔗 URL' },
  ];

  const fileFormatOptions = [
    { value: 'png', label: '🖼️ PNG' },
    { value: 'jpg', label: '📸 JPG' },
    { value: 'webp', label: '🚀 WebP' },
  ];

  return (
    <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        type="button" 
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/40 dark:hover:to-indigo-900/40 transition-colors"
        onClick={togglePanel}
      >
        <div className="flex items-center">
          <FiSettings className="mr-2 text-indigo-600 dark:text-indigo-400" />
          <span className="font-medium text-indigo-700 dark:text-indigo-300">⚙️ 高级设置</span>
        </div>
        {isOpen ? <FiChevronUp className="text-indigo-600 dark:text-indigo-400" /> : <FiChevronDown className="text-indigo-600 dark:text-indigo-400" />}
      </button>

      {isOpen && (
        <div className="p-4 bg-white dark:bg-gray-800 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">📏 图像尺寸</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
              {presetSizes.slice(0, 5).map((size) => (
                <button
                  key={size.label}
                  type="button"
                  className={`px-2 py-1 text-xs rounded-md border ${
                    settings.width === size.width && settings.height === size.height
                      ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-indigo-500 dark:from-blue-900/50 dark:to-indigo-900/50 dark:border-indigo-400 text-indigo-700 dark:text-indigo-300'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={(e) => handleSizeClick(size.width, size.height, e)}
                >
                  {size.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {presetSizes.slice(5).map((size) => (
                <button
                  key={size.label}
                  type="button"
                  className={`px-2 py-1 text-xs rounded-md border ${
                    settings.width === size.width && settings.height === size.height
                      ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-indigo-500 dark:from-blue-900/50 dark:to-indigo-900/50 dark:border-indigo-400 text-indigo-700 dark:text-indigo-300'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={(e) => handleSizeClick(size.width, size.height, e)}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="model" className="block text-sm font-medium mb-1">
                🤖 生成模型
              </label>
              <select
                id="model"
                name="model"
                value={settings.model}
                onChange={handleSettingChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
              >
                {modelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="steps" className="block text-sm font-medium mb-1">
                🔄 生成步数
              </label>
              <select
                id="steps"
                name="steps"
                value={settings.steps}
                onChange={handleSettingChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
              >
                <option value="4">4 (最快 ⚡)</option>
                <option value="8">8 (平衡 ⚖️)</option>
                <option value="16">16 (较好 👍)</option>
                <option value="24">24 (高质量 ✨)</option>
                <option value="32">32 (最高质量 🌟)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="seed" className="block text-sm font-medium mb-1">
                🎲 随机种子 (-1 为随机)
              </label>
              <input
                id="seed"
                name="seed"
                type="number"
                value={settings.seed}
                onChange={handleSettingChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                placeholder="-1"
              />
            </div>

            <div>
              <label htmlFor="responseFormat" className="block text-sm font-medium mb-1">
                📤 响应格式
              </label>
              <select
                id="responseFormat"
                name="responseFormat"
                value={settings.responseFormat}
                onChange={handleSettingChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
              >
                {responseFormatOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="fileFormat" className="block text-sm font-medium mb-1">
                📄 文件格式
              </label>
              <select
                id="fileFormat"
                name="fileFormat"
                value={settings.fileFormat}
                onChange={handleSettingChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
              >
                {fileFormatOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}