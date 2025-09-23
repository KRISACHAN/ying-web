[English Documentation](/packages/eslint-config/README.md) · [中文文档](/packages/eslint-config/README.zh-CN.md)

# @ying-web/eslint-config

`@ying-web` 通用的 ESLint 配置

## 概述

本包为 JavaScript 和 TypeScript 项目提供统一的 ESLint 配置方案，特别针对 Next.js 项目进行了优化。

## 环境要求

-   Node.js >= 18.16.0
-   PNPM: 8.5.1 或更高版本

## 安装

```bash
pnpm add -D @ying-web/eslint-config
```

## 使用指南

### JavaScript Node.js 项目

```javascript
// .eslintrc.cjs
import { jsNodeConfig } from '@ying-web/eslint-config';

export default jsNodeConfig;
```

### TypeScript Web 项目

```javascript
// .eslintrc.cjs
import { tsWebConfig } from '@ying-web/eslint-config';

export default tsWebConfig;
```

### Next.js 项目

```javascript
// .eslintrc.cjs
import { nextConfig } from '@ying-web/eslint-config';

export default nextConfig;
```

## 项目结构

```
packages/eslint-config/
├── src/
│   ├── configs/       # 预设配置
│   ├── base.ts       # 基础配置
│   └── index.ts      # 主入口
├── @types/           # 类型声明
└── dist/            # 构建产物
```

## 开发指南

1. 安装依赖：

```bash
pnpm install
```

2. 构建项目：

```bash
pnpm build
```

## 配置详情

### 基础规则

-   强制导入排序
-   防止重复导入
-   与 Prettier 保持代码风格一致
-   应用推荐 ESLint 规则

### TypeScript 规则

-   严格类型检查
-   TypeScript 文件导入解析
-   Web 配置支持 React/JSX
-   Next.js 专属规则

### 导入排序分组

```javascript
[
    ['^node:'], // Node.js 内置模块
    ['^@?\\w'], // 第三方包
    ['^@/'], // 内部别名
    ['^\\.\\.'], // 上级目录导入
    ['^\\.'], // 同级目录导入
    ['^.+\\.?(css)$'], // 样式文件导入
];
```

## 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件。
