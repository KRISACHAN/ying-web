# @ying-web/events 🙏

A modern, TypeScript-powered Christian events platform for managing various spiritual activities and engagements.

## Overview 🌟

This platform is part of the `@ying-web` ecosystem, built with React 18 and TypeScript. It provides an engaging interface for various spiritual activities, including:

-   🎲 Lucky Number Drawing
-   📖 Bible Promise Drawing
-   🎯 More Activities _(coming soon)_

## Tech Stack 💻

-   ⚛️ **React 18** - Latest version of the popular UI library
-   📘 **TypeScript** - For type-safe code
-   🎨 **Material-UI** - Beautiful UI components
-   🌊 **TailwindCSS** - Utility-first CSS framework
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

# Run style linting
pnpm stylelint

# Format code
pnpm prettier
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
apps/events/
├── src/                # Source code
│   ├── pages/         # Page components
│   │   ├── LuckyNumber/  # Lucky number activity
│   │   └── Promise/      # Bible promise activity
│   ├── components/    # Reusable components
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom React hooks
│   ├── layouts/       # Layout components
│   ├── services/      # API services
│   ├── styles/        # Global styles and themes
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
