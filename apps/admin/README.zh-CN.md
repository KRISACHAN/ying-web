[English Documentation](/apps/admin/README.md) · [中文文档](/apps/admin/README.zh-CN.md)

# @ying-web/admin

基于 React@18 + TypeScript 的现代化管理后台，用于管理各类 Web 应用

## 概述

本后台系统是 `@ying-web` 的重要组成部分，采用 React@18 + TypeScript 构建，提供优雅的界面用于管理生态系统内的各类应用。

## 技术栈

-   **React 18**
-   **TypeScript**
-   **Ant Design**
-   **TailwindCSS**
-   **Vite**
-   **Axios**
-   **ESLint & Prettier**
-   **Less**

## 环境要求

-   Node.js >= 18.16.0
-   Pnpm: 8.5.1

## 本地开发

1. 安装依赖：

```bash
pnpm install
```

2. 配置环境变量：

```bash
# 复制环境文件模板
cp .env.example .env.development

# 编辑环境变量
VITE_REQUEST_BASE_URL=https://api.example.com
VITE_EVENTS_BASE_URL=https://events.example.com
```

3. 启动开发服务器：

```bash
# 带热重载功能
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

    - 框架预设: `Vite`
    - 构建命令: `pnpm build`
    - 输出目录: `dist`
    - 安装命令: `pnpm install`

3. 在 Vercel 项目设置中添加环境变量：

```bash
VITE_REQUEST_BASE_URL=https://api.production.com
VITE_EVENTS_BASE_URL=https://events.production.com
```

4. 部署！Vercel 将自动处理构建和部署流程

当前部署地址: [https://admin.krissarea.com](https://admin.krissarea.com)

### 手动部署

1. 配置生产环境：

```bash
# 复制环境文件模板
cp .env.example .env.production

# 编辑生产环境变量
VITE_REQUEST_BASE_URL=https://api.production.com
VITE_EVENTS_BASE_URL=https://events.production.com
```

2. 构建与预览：

```bash
# 生产环境构建
pnpm build

# 预览生产版本
pnpm preview
```

## 项目结构

```
apps/admin/
├── src/                # 源代码
│   ├── components/    # 可复用组件
│   ├── hooks/         # 自定义 React Hooks
│   ├── layouts/       # 布局组件
│   ├── pages/         # 页面组件
│   ├── services/      # API 服务
│   ├── styles/        # 全局样式
│   ├── types/         # TypeScript 类型定义
│   └── utils/         # 工具函数
├── public/            # 静态资源
└── dist/             # 构建产物
```

## 环境变量

`.env.development` 和 `.env.production` 中需配置：

-   `VITE_REQUEST_BASE_URL` - 后端 API 地址
-   `VITE_EVENTS_BASE_URL` - 活动系统地址

## 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件。
