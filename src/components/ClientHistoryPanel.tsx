'use client';

import HistoryPanel from './HistoryPanel';

export default function ClientHistoryPanel() {
  const handleSelectPrompt = (prompt: string, negativePrompt: string, params: any) => {
    // 这里可以处理选择提示词的逻辑，如果需要的话
    console.log("选择了历史记录中的提示词");
  };

  return <HistoryPanel onSelectPrompt={handleSelectPrompt} />;
}