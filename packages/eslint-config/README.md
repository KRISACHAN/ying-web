[English Documentation](/packages/eslint-config/README.md) · [中文文档](/packages/eslint-config/README.zh-CN.md)

# @ying-web/eslint-config

Shared ESLint configurations for the @ying-web.

## Overview

This package provides a unified ESLint configuration solution for JavaScript and TypeScript projects, with special optimization for Next.js projects.

## Prerequisites

-   Node.js >= 18.16.0
-   PNPM: 8.5.1 or higher

## Installation

```bash
pnpm add -D @ying-web/eslint-config
```

## Usage

### JavaScript Node.js Projects

```javascript
// .eslintrc.cjs
import { jsNodeConfig } from '@ying-web/eslint-config';

export default jsNodeConfig;
```

### TypeScript Web Projects

```javascript
// .eslintrc.cjs
import { tsWebConfig } from '@ying-web/eslint-config';

export default tsWebConfig;
```

### Next.js Projects

```javascript
// .eslintrc.cjs
import { nextConfig } from '@ying-web/eslint-config';

export default nextConfig;
```

## Project Structure

```
packages/eslint-config/
├── src/
│   ├── configs/       # Preset configurations
│   ├── base.ts       # Base configuration
│   └── index.ts      # Main entry
├── @types/           # Type declarations
└── dist/            # Build output
```

## Development

1. Install dependencies:

```bash
pnpm install
```

2. Build the project:

```bash
pnpm build
```

## Configuration Details

### Base Rules

-   Enforces import sorting
-   Prevents duplicate imports
-   Enforces consistent code style with Prettier
-   Applies recommended ESLint rules

### TypeScript Rules

-   Strict type checking
-   Import resolution for TypeScript files
-   React/JSX support for web configurations
-   Next.js specific rules

### Import Sorting Groups

```javascript
[
    ['^node:'], // Node.js built-in modules
    ['^@?\\w'], // External packages
    ['^@/'], // Internal aliases
    ['^\\.\\.'], // Parent imports
    ['^\\.'], // Local imports
    ['^.+\\.?(css)$'], // Style imports
];
```

## License

MIT License - see the [LICENSE](LICENSE) file for details.
