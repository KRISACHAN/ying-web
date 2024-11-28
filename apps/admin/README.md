# @ying-web/admin 🚀

A modern, TypeScript-powered admin dashboard for managing various web applications.

## Overview 🌟

This dashboard is part of the `@ying-web` ecosystem, built with React 18 and TypeScript. It provides a sleek interface for managing different applications.

## Tech Stack 💻

-   ⚛️ **React 18** - Latest version of the popular UI library
-   📘 **TypeScript** - For type-safe code
-   🎨 **Ant Design** - Enterprise-grade UI components
-   � **TailwindCSS** - Utility-first CSS framework
-   🔄 **Vite** - Next-generation frontend tooling
-   📡 **Axios** - Promise-based HTTP client
-   🎯 **ESLint & Prettier** - Code quality tools
-   💅 **Less** - CSS preprocessor

## Getting Started 🎯

### Prerequisites

> **Note:** The same as the root project's `package.json`

-   Node.js >= 18.16.0
-   Pnpm: 9.14.2

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.development
```

### Development

```bash
# Start development server
pnpm dev

# Run linting
pnpm lint

# Run linting for all files
pnpm lint:all

# Run style linting
pnpm stylelint

# Run style linting for fixing issues
pnpm stylelint:fix

# Format code
pnpm prettier

# Format code for all files
pnpm prettier:all
```

### Building for Production

```bash
# Build the application
pnpm build

# Preview the build
pnpm preview
```

## Project Structure 📁

```
apps/admin/
├── src/                # Source code
│   ├── pages/         # Page components
│   ├── components/    # Reusable components
│   ├── services/      # API services
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript types
├── public/            # Static assets
└── dist/             # Build output
```

## Environment Variables 🔧

Copy `.env.example` to create your environment files:

-   `.env.development` - Development environment
-   `.env.production` - Production environment

Required variables:

-   `VITE_API_URL` - Backend API URL

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author ✨

Kris - [Website](https://www.krissarea.com) - [Email](mailto:chenjinwen77@gmail.com)

---

Made with ❤️ by the @ying-web
