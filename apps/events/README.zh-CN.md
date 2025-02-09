[English Documentation](/apps/events/README.md) · [中文文档](/apps/events/README.zh-CN.md)

# @ying-web/events 🙏

基于 TypeScript 的现代化基督教活动平台，用于管理各类基督教文化活动

## 概述 🌟

本平台是 `@ying-web` 的重要组成部分，采用 React 18 + TypeScript + Material-UI 构建，为各类基督教文化活动提供互动界面。

## 技术栈 💻

-   ⚛️ **React 18** - 最新版流行 UI 库
-   📘 **TypeScript** - 类型安全的代码
-   🎨 **Material-UI** - 美观的 UI 组件
-   🌊 **TailwindCSS** - 实用优先的 CSS 框架
-   🔄 **Vite** - 新一代前端工具链
-   📡 **Axios** - 基于 Promise 的 HTTP 客户端
-   🎯 **ESLint & Prettier** - 代码质量工具
-   💅 **Less** - CSS 预处理器

## 环境要求 📋

-   Node.js >= 18.16.0
-   Pnpm: 9.14.2

## 本地开发 💻

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

## 生产部署 🚀

### Vercel 部署 (推荐) ▲

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
```

4. 部署！Vercel 将自动处理构建和部署流程

当前部署地址: [https://events.krissarea.com](https://events.krissarea.com)

### 手动部署

1. 配置生产环境：

```bash
# 复制环境文件模板
cp .env.example .env.production

# 编辑生产环境变量
VITE_REQUEST_BASE_URL=https://api.production.com
```

2. 构建与预览：

```bash
# 生产环境构建
pnpm build

# 预览生产版本
pnpm preview
```

## 项目结构 📁

```
apps/events/
├── src/                # 源代码
│   ├── components/    # 可复用组件
│   ├── contexts/      # React 上下文
│   ├── hooks/         # 自定义 React Hooks
│   ├── layouts/       # 布局组件
│   ├── pages/         # 页面组件
│   ├── services/      # API 服务
│   ├── styles/        # 全局样式
│   └── types/         # TypeScript 类型定义
├── public/            # 静态资源
└── dist/             # 构建产物
```

## 主要路由 🛣

-   `/` - 首页
-   `/promise` - 圣经应许页面
-   `/promise-new` - 新增应许页面
-   `/lucky-number/:activityKey` - 幸运号码列表
-   `/lucky-number/:activityKey/activity` - 幸运号码活动

## 环境变量 🔧

`.env.development` 和 `.env.production` 中需配置：

-   `VITE_REQUEST_BASE_URL` - 后端 API 地址

## 开源协议 📄

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件。

## 作者 ✨

Kris（鱼头） - [个人网站](https://www.krissarea.com) - [联系邮箱](mailto:chenjinwen77@gmail.com)

---

来自 @ying-web ❤️
