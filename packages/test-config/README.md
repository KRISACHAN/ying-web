# @ying-web/test-config 🧪

Shared Vitest configurations for JavaScript and TypeScript projects in the @ying-web monorepo.

## Overview 🌟

This package provides standardized test configurations for the `@ying-web` ecosystem, ensuring consistent testing setups across all JavaScript and TypeScript projects.

## Features 💫

### JavaScript Config ⚡️

-   🌍 Node environment setup
-   🎯 Test file patterns for `.js`, `.mjs`, `.cjs`
-   📊 V8 coverage reporting
-   ⚙️ Configurable aliases
-   ⏱️ Extended timeout settings

### TypeScript Config 📘

-   🌍 Node environment setup
-   🎯 Test file patterns for [.ts](cci:7://file:///Users/kris/Desktop/code/github/KRISACHAN/ying-web/packages/tools/src/index.ts:0:0-0:0), `.tsx`
-   📊 V8 coverage reporting
-   ⚙️ Source directory aliases
-   🔄 TypeScript path resolution

## Tech Stack 💻

-   🧪 **Vitest** - Next-generation testing framework
-   📘 **TypeScript** - For type-safe configurations
-   📦 **tsup** - TypeScript bundler

## Usage 💡

```typescript
// For JavaScript projects
import { jsConfig } from '@ying-web/test-config';

// vitest.config.js
export default jsConfig;

// For TypeScript projects
import { tsConfig } from '@ying-web/test-config';

// vitest.config.ts
export default tsConfig;
```
