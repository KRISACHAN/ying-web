[English Documentation](/apps/diary/README.md) · [中文文档](/apps/diary/README.zh-CN.md)

# @ying-web/diary

Modern personal blog system based on Next.js 14 and Markdown

## Overview

This blog is an important component of `@ying-web`, built with Next.js 14 + TypeScript, providing a clean and elegant interface for sharing personal thoughts, technical articles, and life experiences.

## Tech Stack

-   **React 18**
-   **TypeScript**
-   **Next.js 14**
-   **Tailwind CSS**
-   **next-themes**
-   **React Markdown**
-   **RSS**
-   **SEO Optimization**

## Prerequisites

-   Node.js >= 18.16.0
-   PNPM: 8.15.8 or 9.14.2

## Local Development

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables:

```bash
# Copy environment file template
cp .env.example .env

# Configure environment variables
NEXT_PUBLIC_BLOG_ID=""                    # Blog ID from wisp.blog
NEXT_PUBLIC_BLOG_DISPLAY_NAME=""          # Blog display name
NEXT_PUBLIC_BLOG_COPYRIGHT=""             # Copyright information
NEXT_DEFAULT_METADATA_DEFAULT_TITLE=""    # Default page title
NEXT_PUBLIC_BASE_URL=""                   # Blog base URL
```

3. Start development server:

```bash
# With hot reload functionality (port 8081)
pnpm dev

# Run code linting
pnpm lint

# Check all files
pnpm lint:all

# Style linting
pnpm stylelint

# Auto-fix style issues
pnpm stylelint:fix
```

## Production Deployment

### Vercel Deployment (Recommended)

This project is optimized for [Vercel](https://vercel.com)

1. Connect GitHub repository to Vercel
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

4. Deploy! Vercel will automatically handle the build and deployment process

Current deployment: [https://diary.krissarea.com](https://diary.krissarea.com)

### Manual Deployment

1. Production environment build:

```bash
# Build application
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
apps/diary/
├── src/                # Source code
│   ├── app/           # Next.js app directory
│   │   ├── blog/      # Blog post pages
│   │   ├── api/       # API routes
│   │   └── rss/       # RSS feed generation
│   ├── components/    # Reusable components
│   ├── hooks/         # Custom React Hooks
│   ├── lib/           # Utility functions
│   ├── styles/        # Global styles
│   └── types/         # TypeScript type definitions
├── public/            # Static files
└── content/           # Blog content
```

## Environment Variables

Required in `.env`:

```bash
# Blog Configuration
NEXT_PUBLIC_BLOG_ID=""                    # Blog ID from wisp.blog
NEXT_PUBLIC_BLOG_DISPLAY_NAME=""          # Blog display name
NEXT_PUBLIC_BLOG_COPYRIGHT=""             # Copyright information
NEXT_DEFAULT_METADATA_DEFAULT_TITLE=""    # Default page title
NEXT_PUBLIC_BASE_URL=""                   # Blog base URL
```

## License

MIT License - see the [LICENSE](LICENSE) file for details.

---

Developed by @ying-web based on [https://www.wisp.blog/](https://www.wisp.blog/)
