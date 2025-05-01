'use client';

import HistoryPanel from './HistoryPanel';
import { GeneratedImage } from '@/store/generationStore';

export default function ClientHistoryPanel() {
  const handleSelectPrompt = (item: Pick<GeneratedImage, 'prompt' | 'negativePrompt' | 'parameters'>) => {
    // 这里可以处理选择提示词的逻辑，如果需要的话
    console.log("选择了历史记录中的提示词", item.prompt);
  };

  return <HistoryPanel onSelectPrompt={handleSelectPrompt} />;
}