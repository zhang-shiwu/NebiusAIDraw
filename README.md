# Nebius AI Draw

一个基于Next.js开发的AI图像生成应用，允许用户通过文本提示词生成高质量图像。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzhang-shiwu%2FNebiusAIDraw)

## 项目介绍

Nebius AI Draw是一款功能强大的AI图像生成工具，利用先进的图像生成模型，将您的文字描述转换为精美图像。无论是创意灵感、概念设计还是艺术创作，Nebius AI Draw都能帮助您将想法可视化。

## 功能特点

- **文本到图像生成**：输入描述文本，AI将为您创建相应的图像
- **历史记录功能**：自动保存生成历史，随时查看和重用之前的创作
- **高级参数设置**：调整生成参数，如图像尺寸、采样方法等，获得更精确的结果
- **响应式设计**：完美支持桌面和移动设备，随时随地进行创作
- **友好界面**：简洁直观的用户界面，易于操作

## 技术栈

- **前端框架**：Next.js 14
- **样式方案**：Tailwind CSS
- **状态管理**：Zustand
- **UI组件**：自定义组件
- **部署平台**：Vercel

## 如何使用

1. 在提示词输入框中输入您想要生成的图像描述
2. 根据需要调整高级设置参数
3. 点击"生成"按钮
4. 等待几秒钟，欣赏AI创作的图像
5. 您的所有生成历史都会自动保存，可随时查看

## 环境变量配置

本项目需要配置以下环境变量才能正常工作：

### 必需的环境变量

- `NEBIUS_API_KEY` - Nebius AI服务的API密钥

### 配置方法

#### 本地开发环境配置

1. 在项目根目录创建`.env.local`文件
2. 添加以下内容（替换为您自己的值）：

```
NEBIUS_API_KEY=您的Nebius_API密钥
```

#### Vercel部署配置

1. 在Vercel项目设置中找到"Environment Variables"选项
2. 添加上述环境变量及其值
3. 重新部署项目以使环境变量生效

#### 获取API密钥

要获取Nebius API密钥，请按照以下步骤操作：

1. 注册/登录[Nebius AI服务](https://nebius.ai)官方网站
2. 导航至用户控制台中的"API密钥"部分
3. 创建新的API密钥
4. 复制密钥并妥善保存（注意：密钥通常只显示一次）

注意：请勿在公共仓库中直接提交包含API密钥的文件。`.env.local`文件已在`.gitignore`中设置为忽略。

## 本地开发

如果您想在本地运行和开发项目：

```bash
# 克隆仓库
git clone https://github.com/zhang-shiwu/NebiusAIDraw.git
cd NebiusAIDraw

# 安装依赖
npm install
# 或者
yarn install

# 启动开发服务器
npm run dev
# 或者
yarn dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可在浏览器中查看应用。

## 部署指南

### 一键部署到Vercel

点击上方的"Deploy with Vercel"按钮，即可一键将项目部署到您的Vercel账户。

### 手动部署步骤

1. Fork本仓库到您的GitHub账户
2. 登录[Vercel平台](https://vercel.com)
3. 点击"New Project"并选择您fork的仓库
4. 按照提示完成配置
5. 点击"Deploy"开始部署

## 贡献指南

欢迎为Nebius AI Draw贡献代码或提出建议：

1. Fork本仓库
2. 创建您的特性分支：`git checkout -b feature/amazing-feature`
3. 提交您的更改：`git commit -m '添加了一些很棒的功能'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 开启一个Pull Request

## 许可证

MIT License

## 联系方式

如有任何问题或建议，请通过以下方式联系：

- GitHub Issues: [https://github.com/zhang-shiwu/NebiusAIDraw/issues](https://github.com/zhang-shiwu/NebiusAIDraw/issues)
