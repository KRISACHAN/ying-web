# @ying-web/diary 📝

A modern, TypeScript-powered personal blog built with Next.js and Markdown support.

## Overview 🌟

This blog is part of the `@ying-web` ecosystem, built with Next.js 14 and TypeScript. It provides a clean and elegant interface for sharing personal thoughts, technical articles, and life experiences.

## Tech Stack 💻

-   ⚛️ **React 18** - Modern UI development
-   📘 **TypeScript** - Type-safe development
-   🔄 **Next.js 14** - React framework for production
-   🎨 **Tailwind CSS** - Utility-first CSS
-   🌙 **next-themes** - Dark mode support
-   📝 **React Markdown** - Markdown rendering
-   📡 **RSS** - Feed support
-   🔍 **SEO Optimized** - Better search visibility

## Getting Started 🚀

### Prerequisites

-   Node.js >= 18.16.0
-   PNPM: 8.15.8 or 9.14.2

### Development

```bash
# Install dependencies
pnpm install

# Start development server (port 8081)
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
# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure 📂

```txt
apps/diary/
├── src/                # Source code
│   ├── app/           # Next.js app directory
│   ├── components/    # Reusable components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── styles/        # Global styles
│   └── types/         # TypeScript types
├── public/            # Static files
└── content/           # Blog content
```

## Environment Variables 🔧

Required variables in `.env`:

```bash
# Blog Configuration
NEXT_PUBLIC_BLOG_ID=""                    # Blog ID from wisp.blog
NEXT_PUBLIC_BLOG_DISPLAY_NAME=""          # Display name for the blog
NEXT_PUBLIC_BLOG_COPYRIGHT=""             # Copyright information
NEXT_DEFAULT_METADATA_DEFAULT_TITLE=""    # Default page title
NEXT_PUBLIC_BASE_URL=""                   # Base URL for the blog
```

## License 📄

MIT © [Kris Chan](https://github.com/KRISACHAN)

---

Made with ❤️ by Kris Chan
