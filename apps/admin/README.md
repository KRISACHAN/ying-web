[English Documentation](/apps/admin/README.md) · [中文文档](/apps/admin/README.zh-CN.md)

# @ying-web/admin

Modern admin dashboard based on React@18 + TypeScript for managing various web applications

## Overview

This admin system is an important component of `@ying-web`, built with React@18 + TypeScript, providing an elegant interface for managing various applications within the ecosystem.

## Tech Stack

-   **React 18**
-   **TypeScript**
-   **Ant Design**
-   **TailwindCSS**
-   **Vite**
-   **Axios**
-   **ESLint & Prettier**
-   **Less**

## Prerequisites

-   Node.js >= 18.16.0
-   Pnpm: 8.5.1

## Local Development

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables:

```bash
# Copy environment file template
cp .env.example .env.development

# Edit environment variables
VITE_REQUEST_BASE_URL=https://api.example.com
VITE_EVENTS_BASE_URL=https://events.example.com
```

3. Start development server:

```bash
# With hot reload functionality
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

    - Framework Preset: `Vite`
    - Build Command: `pnpm build`
    - Output Directory: `dist`
    - Install Command: `pnpm install`

3. Add environment variables in Vercel project settings:

```bash
VITE_REQUEST_BASE_URL=https://api.production.com
VITE_EVENTS_BASE_URL=https://events.production.com
```

4. Deploy! Vercel will automatically handle the build and deployment process

Current deployment: [https://admin.krissarea.com](https://admin.krissarea.com)

### Manual Deployment

1. Configure production environment:

```bash
# Copy environment file template
cp .env.example .env.production

# Edit production environment variables
VITE_REQUEST_BASE_URL=https://api.production.com
VITE_EVENTS_BASE_URL=https://events.production.com
```

2. Build and preview:

```bash
# Production build
pnpm build

# Preview production version
pnpm preview
```

## Project Structure

```
apps/admin/
├── src/                # Source code
│   ├── components/    # Reusable components
│   ├── hooks/         # Custom React Hooks
│   ├── layouts/       # Layout components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── styles/        # Global styles
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── public/            # Static assets
└── dist/             # Build output
```

## Environment Variables

Required in `.env.development` and `.env.production`:

-   `VITE_REQUEST_BASE_URL` - Backend API URL
-   `VITE_EVENTS_BASE_URL` - Events system URL

## License

MIT License - see the [LICENSE](LICENSE) file for details.
