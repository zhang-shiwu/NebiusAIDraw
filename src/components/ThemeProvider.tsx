'use client';

import { useEffect } from 'react';
import { useGenerationStore } from '@/store/generationStore';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { darkMode } = useGenerationStore();

  // 应用暗黑模式设置
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [darkMode]);

  return <>{children}</>;
}