# @ying-web/events 🙏

A modern, TypeScript-powered Christian events platform for managing various spiritual activities and engagements.

## Overview 🌟

This platform is part of the `@ying-web` ecosystem, built with React 18, TypeScript and Material-UI. It provides an engaging interface for various spiritual activities.

## Tech Stack 💻

-   ⚛️ **React 18** - Latest version of the popular UI library
-   📘 **TypeScript** - For type-safe code
-   🎨 **Material-UI** - Beautiful UI components
-   🌊 **TailwindCSS** - Utility-first CSS framework
-   🔄 **Vite** - Next-generation frontend tooling
-   📡 **Axios** - Promise-based HTTP client
-   🎯 **ESLint & Prettier** - Code quality tools
-   💅 **Less** - CSS preprocessor

## Prerequisites 📋

-   Node.js >= 18.16.0
-   Pnpm: 9.14.2

## Local Development 💻

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment:

```bash
# Copy environment file
cp .env.example .env.development

# Edit environment variables
VITE_REQUEST_BASE_URL=https://api.example.com
```

3. Start development server:

```bash
# Start with hot reload
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

    - Framework Preset: `Vite`
    - Build Command: `pnpm build`
    - Output Directory: `dist`
    - Install Command: `pnpm install`

3. Add environment variables in Vercel project settings:

```bash
VITE_REQUEST_BASE_URL=https://api.production.com
```

4. Deploy! Vercel will automatically handle the build and deployment process.

Current deployment: [https://events.krissarea.com](https://events.krissarea.com)

### Manual Deployment

1. Configure production environment:

```bash
# Copy environment file
cp .env.example .env.production

# Edit production environment variables
VITE_REQUEST_BASE_URL=https://api.production.com
```

2. Build and preview:

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure 📁

```
apps/events/
├── src/                # Source code
│   ├── components/    # Reusable components
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom React hooks
│   ├── layouts/       # Layout components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── styles/        # Global styles
│   └── types/         # TypeScript types
├── public/            # Static assets
└── dist/             # Build output
```

## Available Routes 🛣

-   `/` - Home page
-   `/promise` - Bible promise page
-   `/promise-new` - New promise page
-   `/lucky-number/:activityKey` - Lucky number list
-   `/lucky-number/:activityKey/activity` - Lucky number activity

## Environment Variables 🔧

Required variables in `.env.development` and `.env.production`:

-   `VITE_REQUEST_BASE_URL` - Backend API URL

## License 📄

MIT License - see the [LICENSE](LICENSE) file for details.

## Author ✨

Kris - [Website](https://www.krissarea.com) - [Email](mailto:chenjinwen77@gmail.com)

---

Made with ❤️ by the @ying-web
