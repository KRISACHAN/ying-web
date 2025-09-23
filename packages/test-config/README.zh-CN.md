[English Documentation](/packages/test-config/README.md) · [中文文档](/packages/test-config/README.zh-CN.md)

# @ying-web/test-config

`@ying-web` 通用的测试配置

## 概述

本包为 JavaScript 和 TypeScript 项目提供统一的 Vitest 测试配置，确保生态系统内所有项目的测试环境一致性。

## 环境要求

-   Node.js >= 18.16.0
-   PNPM: 8.5.1 或更高版本

## 安装

```bash
pnpm add -D @ying-web/test-config
```

## 使用指南

### JavaScript 项目

```javascript
// vitest.config.js
import { jsConfig } from '@ying-web/test-config';

export default jsConfig;
```

### TypeScript 项目

```typescript
// vitest.config.ts
import { tsConfig } from '@ying-web/test-config';

export default tsConfig;
```

## 配置详情

### JavaScript 配置

```typescript
{
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/**/*.{test,spec}.{js,mjs,cjs}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html']
        },
        testTimeout: 20000
    },
    resolve: {
        alias: {
            '@': './app'
        }
    }
}
```

### TypeScript 配置

```typescript
{
    test: {
        globals: true,
        environment: 'node',
        include: [
            'src/**/*.{test,spec}.{ts,tsx}',
            'tests/**/*.{test,spec}.{ts,tsx}'
        ],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html']
        }
    },
    resolve: {
        alias: {
            '@': './src'
        }
    }
}
```

## 项目结构

```
packages/test-config/
├── src/
│   ├── js.config.ts   # JavaScript 配置
│   ├── ts.config.ts   # TypeScript 配置
│   └── index.ts       # 主入口
├── dist/              # 构建产物
└── types/             # 类型声明
```

## 开发指南

1. 安装依赖：

```bash
pnpm install
```

2. 构建项目：

```bash
# 完整构建
pnpm build

# 仅构建类型
pnpm build:types

# 仅构建 JavaScript
pnpm build:js

# 开发模式（监听变化）
pnpm dev
```

## 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件。
