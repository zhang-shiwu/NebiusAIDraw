import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI文生图 | Nebius API图像生成",
  description: "使用AI技术，通过文字描述生成精美图像。基于Next.js和Nebius API构建的AI文生图应用。",
  keywords: "AI, 文生图, 图像生成, 人工智能, Next.js, Nebius API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
