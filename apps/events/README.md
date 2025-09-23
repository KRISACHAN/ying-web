[English Documentation](/apps/events/README.md) · [中文文档](/apps/events/README.zh-CN.md)

# @ying-web/events

Modern Christian events platform based on TypeScript for managing various Christian cultural activities

## Overview

This platform is an important component of `@ying-web`, built with React 18 + TypeScript + Material-UI, providing an interactive interface for various Christian cultural activities.

## Tech Stack

-   **React 18**
-   **TypeScript**
-   **Material-UI**
-   **TailwindCSS**
-   **Vite**
-   **Axios**
-   **ESLint & Prettier**
-   **Less**

## Prerequisites

-   Node.js >= 18.16.0
-   Pnpm: 9.14.2

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
```

4. Deploy! Vercel will automatically handle the build and deployment process

Current deployment: [https://events.krissarea.com](https://events.krissarea.com)

### Manual Deployment

1. Configure production environment:

```bash
# Copy environment file template
cp .env.example .env.production

# Edit production environment variables
VITE_REQUEST_BASE_URL=https://api.production.com
```

2. Build and preview:

```bash
# Production environment build
pnpm build

# Preview production version
pnpm preview
```

## Project Structure

```
apps/events/
├── src/                # Source code
│   ├── components/    # Reusable components
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom React Hooks
│   ├── layouts/       # Layout components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── styles/        # Global styles
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
└── dist/             # Build output
```

## Main Routes

-   `/` - Home page
-   `/promise` - Bible promise page
-   `/promise-new` - New promise page
-   `/lucky-number/:activityKey` - Lucky number list
-   `/lucky-number/:activityKey/activity` - Lucky number activity

## Environment Variables

Required in `.env.development` and `.env.production`:

-   `VITE_REQUEST_BASE_URL` - Backend API URL

## License

MIT License - see the [LICENSE](LICENSE) file for details.
