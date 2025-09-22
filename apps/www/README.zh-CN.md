[English Documentation](/apps/www/README.md) · [中文文档](/apps/www/README.zh-CN.md)

# @ying-web/www

一个使用 Next.js 15 和 React 19 构建的现代简历网站，支持 SSG/SSR 渲染和多语言切换。

## 概述

本简历网站是 `@ying-web` 生态系统的一部分，采用 Next.js 15 和 TypeScript 构建。它提供了一个简洁优雅的界面，用于展示专业经验、技能和项目。

## 技术栈

-   **React 19**
-   **TypeScript**
-   **Next.js 15**
-   **Tailwind CSS**
-   **next-themes**
-   **SEO 优化**

## 环境要求

-   Node.js >= 18.16.0
-   PNPM: 8.15.8 或 9.14.2

## 本地开发

1. 安装依赖：

```bash
pnpm install
```

2. 配置环境：

```bash
# 复制环境文件
cp .env.example .env

# 配置你的环境变量
NEXT_PUBLIC_SITE_NAME="Ying Web"
NEXT_PUBLIC_SITE_COPYRIGHT="krissarea"
NEXT_DEFAULT_METADATA_DEFAULT_TITLE="Ying Web - Modern Web Development"
NEXT_PUBLIC_SITE_DESCRIPTION="A modern web development platform with React, Next.js, and TypeScript."
NEXT_PUBLIC_BASE_URL="https://www.krissarea.com"
```

3. 启动开发服务器：

```bash
# 启动热重载（端口 3000）
pnpm dev

# 运行代码检查
pnpm lint

# 运行所有文件的代码检查
pnpm lint:all

# 运行样式检查
pnpm stylelint

# 运行带自动修复的样式检查
pnpm stylelint:fix
```

## 生产部署

### Vercel 部署（推荐）

此项目针对 [Vercel](https://vercel.com) 部署进行了优化。

1. 将你的 GitHub 仓库连接到 Vercel
2. 配置以下设置：

    - 框架预设：`Next.js`
    - 构建命令：`pnpm build`
    - 输出目录：`.next`
    - 安装命令：`pnpm install`

3. 在 Vercel 项目设置中添加环境变量：

```bash
NEXT_PUBLIC_SITE_NAME="Ying Web"
NEXT_PUBLIC_SITE_COPYRIGHT="krissarea"
NEXT_DEFAULT_METADATA_DEFAULT_TITLE="Ying Web - Modern Web Development"
NEXT_PUBLIC_SITE_DESCRIPTION="A modern web development platform with React, Next.js, and TypeScript."
NEXT_PUBLIC_BASE_URL="https://www.krissarea.com"
```

4. 部署！Vercel 将自动处理构建和部署过程。

### 手动部署

1. 为生产环境构建：

```bash
# 构建应用
pnpm build

# 启动生产服务器
pnpm start
```

## 项目结构

```
apps/www/
├── src/                # 源代码
│   ├── app/           # Next.js app 目录
│   │   ├── api/       # API 路由
│   │   └── page.tsx   # 主页面
│   ├── components/    # 可复用组件
│   ├── hooks/         # 自定义 React hooks
│   ├── lib/           # 实用函数
│   ├── styles/        # 全局样式
│   └── types/         # TypeScript 类型
└── public/            # 静态文件
```

## 环境变量

`.env` 中的必需变量：

```bash
# 站点配置
NEXT_PUBLIC_SITE_NAME="Ying Web"
NEXT_PUBLIC_SITE_COPYRIGHT="krissarea"
NEXT_DEFAULT_METADATA_DEFAULT_TITLE="Ying Web - Modern Web Development"
NEXT_PUBLIC_SITE_DESCRIPTION="A modern web development platform with React, Next.js, and TypeScript."
NEXT_PUBLIC_BASE_URL="https://www.krissarea.com"
```

## 开源协议

MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。
