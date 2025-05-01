import ThemeProvider from '@/components/ThemeProvider';
import ImageGenerator from '@/components/ImageGenerator';
import ClientHistoryPanel from '@/components/ClientHistoryPanel';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '高级AI文生图 | Nebius API图像生成',
  description: '使用AI技术，通过文字描述生成精美图像。支持高级设置、历史记录和暗黑模式。基于Next.js和Nebius API构建的AI文生图应用。',
  keywords: 'AI, 文生图, 图像生成, 人工智能, Next.js, Nebius API, 高级设置, 历史记录',
};

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI 文生图 <span className="text-blue-600 dark:text-blue-400">Pro</span>
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              使用Nebius AI生成令人惊叹的图像 | 支持高级设置和历史记录
            </p>
          </div>
        </header>
        
        <main className="flex-grow py-8 px-4">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* 左侧：生成器面板 */}
            <div className="w-full lg:w-3/5">
              <ImageGenerator />
            </div>
            
            {/* 右侧：历史记录面板 */}
            <div className="w-full lg:w-2/5">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">历史记录</h2>
                <ClientHistoryPanel />
              </div>
            </div>
          </div>
        </main>
        
        <footer className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <div className="mb-2 md:mb-0">
                © {new Date().getFullYear()} AI文生图Pro | 基于Next.js和Nebius AI构建
              </div>
              <div className="flex space-x-4">
                <a 
                  href="https://nextjs.org/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Next.js文档
                </a>
                <a 
                  href="https://vercel.com/new" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-gray-700 dark:hover:text-gray-300"
                >
                  部署到Vercel
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
