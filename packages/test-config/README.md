# @ying-web/test-config 🧪

Shared Vitest configurations for JavaScript and TypeScript projects in the @ying-web monorepo.

## Overview 🌟

This package provides standardized test configurations for the `@ying-web` ecosystem, ensuring consistent testing setups across all JavaScript and TypeScript projects.

## Prerequisites 📋

-   Node.js >= 18.16.0
-   PNPM: 8.5.1 or higher

## Installation 💻

```bash
pnpm add -D @ying-web/test-config
```

## Usage 🚀

### For JavaScript Projects

```javascript
// vitest.config.js
import { jsConfig } from '@ying-web/test-config';

export default jsConfig;
```

### For TypeScript Projects

```typescript
// vitest.config.ts
import { tsConfig } from '@ying-web/test-config';

export default tsConfig;
```

## Configuration Details 🔧

### JavaScript Config ⚡️

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

### TypeScript Config 📘

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

## Project Structure 📂

```
packages/test-config/
├── src/
│   ├── js.config.ts   # JavaScript configuration
│   ├── ts.config.ts   # TypeScript configuration
│   └── index.ts       # Main entry
├── dist/              # Build output
└── types/             # Type declarations
```

## Development 🛠

1. Install dependencies:

```bash
pnpm install
```

2. Build the package:

```bash
# Build all
pnpm build

# Build types only
pnpm build:types

# Build JavaScript only
pnpm build:js

# Development with watch mode
pnpm dev
```

## License 📄

MIT © [Kris Chan](https://github.com/KRISACHAN)

---

Made with ❤️ by the @ying-web
