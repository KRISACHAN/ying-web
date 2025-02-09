[English Documentation](/packages/eslint-config/README.md) · [中文文档](/packages/eslint-config/README.zh-CN.md)

# @ying-web/eslint-config 🎯

Shared ESLint configurations for the @ying-web.

## Overview 🌟

This package provides a comprehensive set of ESLint configurations for JavaScript and TypeScript projects in both Node.js and web environments, with special configurations for Next.js projects.

## Prerequisites 📋

-   Node.js >= 18.16.0
-   PNPM: 8.5.1 or higher

## Installation 💻

```bash
pnpm add -D @ying-web/eslint-config
```

## Usage 🚀

### For JavaScript Node.js Projects

```javascript
// .eslintrc.cjs
import { jsNodeConfig } from '@ying-web/eslint-config';

export default jsNodeConfig;
```

### For TypeScript Web Projects

```javascript
// .eslintrc.cjs
import { tsWebConfig } from '@ying-web/eslint-config';

export default tsWebConfig;
```

### For Next.js Projects

```javascript
// .eslintrc.cjs
import { nextConfig } from '@ying-web/eslint-config';

export default nextConfig;
```

## Project Structure 📂

```
packages/eslint-config/
├── src/
│   ├── configs/       # Configuration presets
│   ├── base.ts       # Base configuration
│   └── index.ts      # Main entry
├── @types/           # Type declarations
└── dist/            # Build output
```

## Development 🛠

1. Install dependencies:

```bash
pnpm install
```

2. Build the package:

```bash
pnpm build
```

## Configuration Details 🔧

### Base Rules

-   Enforces import sorting
-   Prevents duplicate imports
-   Enforces consistent code style with Prettier
-   Applies recommended ESLint rules

### TypeScript Rules

-   Strict type checking
-   Import resolution for TypeScript files
-   React/JSX support for web configurations
-   Next.js specific rules in next configuration

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

## License 📄

MIT License - see the [LICENSE](LICENSE) file for details.

## Author ✨

Kris - [Website](https://www.krissarea.com) - [Email](mailto:chenjinwen77@gmail.com)

---

Made with ❤️ by the @ying-web
