[English Documentation](/packages/tools/README.md) · [中文文档](/packages/tools/README.zh-CN.md)

# @ying-web/tools

`@ying-web` 专用的工具集

## 概述

本包提供一系列核心工具函数和实用程序，为生态系统内的项目开发提供可靠、灵活的解决方案。

## 技术栈

-   **TypeScript**
-   **Vitest**
-   **TypeDoc**
-   **ESLint**
-   **Prettier**

## 安装

```bash
# 使用 pnpm (推荐)
pnpm add @ying-web/tools

# 使用 npm
npm install @ying-web/tools

# 使用 yarn
yarn add @ying-web/tools
```

## 开发指南

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm build

# 运行测试
pnpm test

# 运行测试覆盖率
pnpm test:coverage

# 代码检查
pnpm lint

# 生成文档
pnpm docs
```

## 项目结构

```
packages/tools/
├── src/                # 源代码
│   ├── packages/      # 核心工具包
│   ├── utils/         # 工具函数
│   └── types/         # 类型定义
├── dist/              # 编译输出
│   ├── cjs/          # CommonJS 模块
│   ├── esm/          # ES 模块
│   └── types/        # TypeScript 声明
└── docs/             # 生成文档
```

## 构建产物

-   **CommonJS**: `dist/cjs/index.js`
-   **ES 模块**: `dist/esm/index.js`
-   **类型声明**: `dist/types/index.d.ts`

## 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件。
