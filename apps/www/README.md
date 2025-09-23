[English Documentation](/apps/www/README.md) · [中文文档](/apps/www/README.zh-CN.md)

# @ying-web/www

A modern resume website built with Next.js 15 and React 19, supporting SSG/SSR rendering and multi-language switching.

## Overview

This resume website is part of the `@ying-web` ecosystem, built with Next.js 15 and TypeScript. It provides a clean and elegant interface for showcasing professional experience, skills, and projects.

## Tech Stack

-   **React 19**
-   **TypeScript**
-   **Next.js 15**
-   **Tailwind CSS**
-   **next-themes**
-   **SEO Optimization**

## Prerequisites

-   Node.js >= 18.16.0
-   PNPM: 8.15.8 or 9.14.2

## Local Development

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment:

```bash
# Copy environment file
cp .env.example .env

# Configure your environment variables
NEXT_PUBLIC_SITE_NAME="Ying Web"
NEXT_PUBLIC_SITE_COPYRIGHT="krissarea"
NEXT_DEFAULT_METADATA_DEFAULT_TITLE="Ying Web - Modern Web Development"
NEXT_PUBLIC_SITE_DESCRIPTION="A modern web development platform with React, Next.js, and TypeScript."
NEXT_PUBLIC_BASE_URL="https://www.krissarea.com"
```

3. Start development server:

```bash
# Start with hot reload (port 3000)
pnpm dev

# Run code linting
pnpm lint

# Run code linting for all files
pnpm lint:all

# Run style linting
pnpm stylelint

# Run style linting with auto-fix
pnpm stylelint:fix
```

## Production Deployment

### Vercel Deployment (Recommended)

This project is optimized for [Vercel](https://vercel.com) deployment.

1. Connect your GitHub repository to Vercel
2. Configure the following settings:

    - Framework Preset: `Next.js`
    - Build Command: `pnpm build`
    - Output Directory: `.next`
    - Install Command: `pnpm install`

3. Add environment variables in Vercel project settings:

```bash
NEXT_PUBLIC_SITE_NAME="Ying Web"
NEXT_PUBLIC_SITE_COPYRIGHT="krissarea"
NEXT_DEFAULT_METADATA_DEFAULT_TITLE="Ying Web - Modern Web Development"
NEXT_PUBLIC_SITE_DESCRIPTION="A modern web development platform with React, Next.js, and TypeScript."
NEXT_PUBLIC_BASE_URL="https://www.krissarea.com"
```

4. Deploy! Vercel will automatically handle the build and deployment process.

### Manual Deployment

1. Build for production:

```bash
# Build application
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
apps/www/
├── src/                # Source code
│   ├── app/           # Next.js app directory
│   │   ├── api/       # API routes
│   │   └── page.tsx   # Main page
│   ├── components/    # Reusable components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── styles/        # Global styles
│   └── types/         # TypeScript types
└── public/            # Static files
```

## Environment Variables

Required variables in `.env`:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_NAME="Ying Web"
NEXT_PUBLIC_SITE_COPYRIGHT="krissarea"
NEXT_DEFAULT_METADATA_DEFAULT_TITLE="Ying Web - Modern Web Development"
NEXT_PUBLIC_SITE_DESCRIPTION="A modern web development platform with React, Next.js, and TypeScript."
NEXT_PUBLIC_BASE_URL="https://www.krissarea.com"
```

## License

MIT License - see the [LICENSE](LICENSE) file for details.
