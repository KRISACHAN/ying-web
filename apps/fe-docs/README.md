# @ying-web/fe-docs 📚

A comprehensive front-end documentation site built with Next.js and Nextra.

## Overview 🌟

This documentation site is part of the `@ying-web` ecosystem, built with Next.js 14 and Nextra. It serves as my knowledge base for front-end development, sharing experiences, and interview preparation resources.

## Tech Stack 💻

-   ⚛️ **React 18** - Modern UI development
-   📘 **TypeScript** - Type-safe development
-   🔄 **Next.js 14** - React framework for production
-   📚 **Nextra** - Documentation framework
-   🎨 **Tailwind CSS** - Utility-first CSS
-   🌙 **Dark Mode** - Built-in theme switching
-   🔍 **Full-text Search** - Quick content access
-   📱 **Responsive Design** - Mobile-first approach

## Getting Started 🚀

### Prerequisites

-   Node.js >= 18.16.0
-   PNPM: 8.15.8 or 9.14.2

### Development

```bash
# Install dependencies
pnpm install

# Start development server (port 8080)
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
# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure 📂

```txt
apps/fe-docs/
├── pages/              # Documentation pages
│   ├── interview/     # Interview preparation
│   │   ├── general/   # General concepts
│   │   ├── html/      # HTML topics
│   │   ├── css/       # CSS topics
│   │   ├── javascript/# JavaScript topics
│   │   ├── typescript/# TypeScript topics
│   │   ├── browser/   # Browser concepts
│   │   ├── network/   # Network topics
│   │   ├── algorithm/ # Algorithm topics
│   │   ├── react/     # React topics
│   │   └── vue/       # Vue topics
│   └── _meta.json     # Navigation structure
├── components/        # Reusable components
├── public/           # Static files
└── theme.config.tsx  # Nextra theme configuration
```

## Documentation Structure 📚

-   🎯 **Interview Preparation**
    -   General Web Development
    -   HTML, CSS, JavaScript
    -   TypeScript
    -   Browser & Network
    -   React & Vue
    -   Algorithms & Patterns
-   🛠️ **Project Documentation** [wip]

## License 📄

MIT © [Kris Chan](https://github.com/KRISACHAN)

---

Made with ❤️ by Kris Chan
