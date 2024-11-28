# @ying-web/tools 🛠️

A pure TypeScript utility collection designed for the @ying-web ecosystem.

## Overview 🌟

This package provides a collection of essential utilities and tools for the `@ying-web` ecosystem. Currently, it focuses on providing a robust and flexible storage solution through the `UniversalStorage` class, with plans to expand its functionality in the future.

## Tech Stack 💻

-   📘 **TypeScript** - Type-safe development
-   🧪 **Jest** - Unit testing
-   📚 **TypeDoc** - Documentation generation
-   🔍 **ESLint** - Code linting
-   🎨 **Prettier** - Code formatting

## Installation 🚀

```bash
# Using pnpm (recommended)
pnpm add @ying-web/tools

# Using npm
npm install @ying-web/tools

# Using yarn
yarn add @ying-web/tools
```

## Usage 📖 [wip]

## Development 🔧

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run linting
pnpm lint

# Format code
pnpm prettier

# Generate documentation
pnpm docs
```

## Project Structure 📂

```txt
packages/tools/
├── src/                # Source code
│   ├── packages/      # Main packages
│   │   └── storage/   # Storage implementation
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript types
├── dist/              # Compiled output
│   ├── cjs/          # CommonJS modules
│   ├── esm/          # ES modules
│   └── types/        # TypeScript declarations
└── docs/             # Generated documentation
```

## Build Outputs 📦

-   📁 **CommonJS**: `dist/cjs/index.js`
-   📁 **ES Modules**: `dist/esm/index.js`
-   📁 **TypeScript Types**: `dist/types/index.d.ts`

## License 📄

MIT

---

Made with ❤️ by Kris Chan
