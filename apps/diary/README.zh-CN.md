[English Documentation](/apps/diary/README.md) · [中文文档](/apps/diary/README.zh-CN.md)

# @ying-web/diary

基于 Next.js 14 和 Markdown 的现代化个人博客系统

## 概述

本博客是 `@ying-web` 的重要组成部分，采用 Next.js 14 + TypeScript 构建，提供简洁优雅的界面用于分享个人思考、技术文章和生活体验。

## 技术栈

-   **React 18**
-   **TypeScript**
-   **Next.js 14**
-   **Tailwind CSS**
-   **next-themes**
-   **React Markdown**
-   **RSS**
-   **SEO 优化**

## 环境要求

-   Node.js >= 18.16.0
-   PNPM: 8.15.8 或 9.14.2

## 本地开发

1. 安装依赖：

```bash
pnpm install
```

2. 配置环境变量：

```bash
# 复制环境文件模板
cp .env.example .env

# 配置环境变量
NEXT_PUBLIC_BLOG_ID=""                    # 来自 wisp.blog 的博客ID
NEXT_PUBLIC_BLOG_DISPLAY_NAME=""          # 博客显示名称
NEXT_PUBLIC_BLOG_COPYRIGHT=""             # 版权信息
NEXT_DEFAULT_METADATA_DEFAULT_TITLE=""    # 默认页面标题
NEXT_PUBLIC_BASE_URL=""                   # 博客基础URL
```

3. 启动开发服务器：

```bash
# 带热重载功能 (端口 8081)
pnpm dev

# 运行代码检查
pnpm lint

# 检查所有文件
pnpm lint:all

# 样式检查
pnpm stylelint

# 自动修复样式问题
pnpm stylelint:fix
```

## 生产部署

### Vercel 部署 (推荐)

本项目已针对 [Vercel](https://vercel.com) 进行优化

1. 将 GitHub 仓库关联至 Vercel
2. 配置以下设置：

    - 框架预设: `Next.js`
    - 构建命令: `pnpm build`
    - 输出目录: `.next`
    - 安装命令: `pnpm install`

3. 在 Vercel 项目设置中添加环境变量：

```bash
NEXT_PUBLIC_BLOG_ID=your_blog_id
NEXT_PUBLIC_BLOG_DISPLAY_NAME=your_blog_name
NEXT_PUBLIC_BLOG_COPYRIGHT=your_copyright
NEXT_DEFAULT_METADATA_DEFAULT_TITLE=your_title
NEXT_PUBLIC_BASE_URL=your_production_url
```

4. 部署！Vercel 将自动处理构建和部署流程

当前部署地址: [https://diary.krissarea.com](https://diary.krissarea.com)

### 手动部署

1. 生产环境构建：

```bash
# 构建应用
pnpm build

# 启动生产服务器
pnpm start
```

## 项目结构

```
apps/diary/
├── src/                # 源代码
│   ├── app/           # Next.js 应用目录
│   │   ├── blog/      # 博客文章页面
│   │   ├── api/       # API 路由
│   │   └── rss/       # RSS 订阅生成
│   ├── components/    # 可复用组件
│   ├── hooks/         # 自定义 React Hooks
│   ├── lib/           # 工具函数
│   ├── styles/        # 全局样式
│   └── types/         # TypeScript 类型定义
├── public/            # 静态文件
└── content/           # 博客内容
```

## 环境变量

`.env` 中需配置：

```bash
# 博客配置
NEXT_PUBLIC_BLOG_ID=""                    # 来自 wisp.blog 的博客ID
NEXT_PUBLIC_BLOG_DISPLAY_NAME=""          # 博客显示名称
NEXT_PUBLIC_BLOG_COPYRIGHT=""             # 版权信息
NEXT_DEFAULT_METADATA_DEFAULT_TITLE=""    # 默认页面标题
NEXT_PUBLIC_BASE_URL=""                   # 博客基础URL
```

## 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件。

---

由 @ying-web 基于 [https://www.wisp.blog/](https://www.wisp.blog/) 二次开发
