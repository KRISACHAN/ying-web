[English Documentation](/packages/tools/README.md) · [中文文档](/packages/tools/README.zh-CN.md)

# @ying-web/tools

Dedicated toolset for @ying-web.

## Overview

This package provides a collection of core utility functions and utilities, offering reliable and flexible solutions for project development within the ecosystem.

## Tech Stack

-   **TypeScript**
-   **Vitest**
-   **TypeDoc**
-   **ESLint**
-   **Prettier**

## Installation

```bash
# Using pnpm (recommended)
pnpm add @ying-web/tools

# Using npm
npm install @ying-web/tools

# Using yarn
yarn add @ying-web/tools
```

## Development Guide

```bash
# Install dependencies
pnpm install

# Build project
pnpm build

# Run tests
pnpm test

# Run test coverage
pnpm test:coverage

# Code linting
pnpm lint

# Generate documentation
pnpm docs
```

## Project Structure

```
packages/tools/
├── src/                # Source code
│   ├── packages/      # Core tool packages
│   ├── utils/         # Utility functions
│   └── types/         # Type definitions
├── dist/              # Build output
│   ├── cjs/          # CommonJS modules
│   ├── esm/          # ES modules
│   └── types/        # TypeScript declarations
└── docs/             # Generated documentation
```

## Build Outputs

-   **CommonJS**: `dist/cjs/index.js`
-   **ES Modules**: `dist/esm/index.js`
-   **TypeScript Types**: `dist/types/index.d.ts`

## License

MIT License - see the [LICENSE](LICENSE) file for details.
