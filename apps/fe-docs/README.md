# @ying-web/fe-docs 📚

A comprehensive front-end documentation site built with Next.js and Nextra.

## Overview 🌟

This documentation site is part of the `@ying-web` ecosystem, built with Next.js 14 and Nextra. It serves as a knowledge base for front-end development, sharing experiences, and interview preparation resources.

## Tech Stack 💻

-   ⚛️ **React 18** - Modern UI development
-   📘 **TypeScript** - Type-safe development
-   🔄 **Next.js 14** - React framework for production
-   📚 **Nextra** - Documentation framework
-   🎨 **Tailwind CSS** - Utility-first CSS
-   🌙 **Dark Mode** - Built-in theme switching
-   🔍 **Full-text Search** - Quick content access
-   📱 **Responsive Design** - Mobile-first approach

## Prerequisites 📋

-   Node.js >= 18.16.0
-   PNPM: 8.15.8 or 9.14.2

## Local Development 💻

1. Install dependencies:

```bash
pnpm install
```

2. Start development server:

```bash
# Start with hot reload (port 8080)
pnpm dev

# Run linting
pnpm lint

# Run style linting
pnpm stylelint
```

## Production Deployment 🚀

### Vercel Deployment (Recommended) ▲

This project is optimized for [Vercel](https://vercel.com) deployment.

1. Connect your GitHub repository to Vercel
2. Configure the following settings:

    - Framework Preset: `Next.js`
    - Build Command: `pnpm build`
    - Output Directory: `.next`
    - Install Command: `pnpm install`

3. Deploy! Vercel will automatically handle the build and deployment process.

Current deployment: [https://fe.krissarea.com](https://fe.krissarea.com)

### Manual Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure 📂

```
apps/fe-docs/
├── pages/              # Documentation pages
│   ├── interview/     # Interview preparation
│   └── _meta.json     # Navigation structure
├── components/        # Reusable components
│   ├── layout/       # Layout components
│   ├── common/       # Common UI components
│   └── mdx/          # MDX-specific components
├── public/           # Static files
└── theme.config.tsx  # Nextra theme configuration
```

## License 📄

MIT © [Kris Chan](https://github.com/KRISACHAN)

---

Made with ❤️ by the @ying-web (Created with [Nextra](https://nextra.site/docs/docs-theme/start))
