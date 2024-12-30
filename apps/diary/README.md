# @ying-web/diary 📝

A modern, TypeScript-powered personal blog built with Next.js 14 and Markdown support.

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

## Prerequisites 📋

-   Node.js >= 18.16.0
-   PNPM: 8.15.8 or 9.14.2

## Local Development 💻

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment:

```bash
# Copy environment file
cp .env.example .env

# Configure your environment variables
NEXT_PUBLIC_BLOG_ID=""                    # Blog ID from wisp.blog
NEXT_PUBLIC_BLOG_DISPLAY_NAME=""          # Display name for the blog
NEXT_PUBLIC_BLOG_COPYRIGHT=""             # Copyright information
NEXT_DEFAULT_METADATA_DEFAULT_TITLE=""    # Default page title
NEXT_PUBLIC_BASE_URL=""                   # Base URL for the blog
```

3. Start development server:

```bash
# Start with hot reload (port 8081)
pnpm dev

# Run linting
pnpm lint

# Run linting for all files
pnpm lint:all

# Run style linting
pnpm stylelint

# Run style linting with auto-fix
pnpm stylelint:fix
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

3. Add environment variables in Vercel project settings:

```bash
NEXT_PUBLIC_BLOG_ID=your_blog_id
NEXT_PUBLIC_BLOG_DISPLAY_NAME=your_blog_name
NEXT_PUBLIC_BLOG_COPYRIGHT=your_copyright
NEXT_DEFAULT_METADATA_DEFAULT_TITLE=your_title
NEXT_PUBLIC_BASE_URL=your_production_url
```

4. Deploy! Vercel will automatically handle the build and deployment process.

Current deployment: [https://diary.krissarea.com](https://diary.krissarea.com)

### Manual Deployment

1. Build for production:

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## Project Structure 📁

```
apps/diary/
├── src/                # Source code
│   ├── app/           # Next.js app directory
│   │   ├── blog/      # Blog post pages
│   │   ├── api/       # API routes
│   │   └── rss/       # RSS feed generation
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

Made with ❤️ by the @ying-web (Forked from [https://www.wisp.blog/](https://www.wisp.blog/))
