[English Documentation](/services/api-service/README.md) · [中文文档](/services/api-service/README.zh-CN.md)

# @ying-web/api-service

The core API service of `@ying-web`.

## Overview

This service is the core API service of `@ying-web`, built with Koa.js + MySQL + JavaScript (Why not TypeScript? This service is an early learning project with special sentimental value, so it's kept as is). It provides RESTful API support for applications within the ecosystem.

## Tech Stack

-   **Koa.js**
-   **MySQL**
-   **Redis**
-   **Gulp**
-   **Docker**
-   **PM2**
-   **Vitest**
-   **ESLint & Prettier**
-   **Babel**

## Environment Requirements

-   Node.js >= 18.16.0
-   Pnpm: 8.5.1
-   MySQL >= 8.0
-   Redis >= 6.0
-   PM2 (recommended for production)
-   Docker (optional for containerized deployment)

## Local Development

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables:

```bash
# Copy environment file template
cp .env.example .env

# Edit configuration information
vim .env
```

3. Start development server:

```bash
# With hot reload functionality
pnpm dev
```

4. Run tests:

```bash
# Execute tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate test coverage report
pnpm test:coverage
```

## Production Deployment

### Using PM2

1. Build application:

```bash
pnpm build
```

2. PM2 configuration:

```bash
# Start via PM2
pnpm pm2
```

### Using Docker

1. Build image:

```bash
# Build Docker image
docker build -t api-service .
```

2. Run container:

```bash
# Run with environment variables
docker run -d \
  --name api-service \
  -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=3306 \
  -e DB_NAME=your_db_name \
  -e DB_USER=your_db_user \
  -e DB_PASSWORD=your_db_password \
  -e REDIS_HOST=host.docker.internal \
  -e REDIS_PORT=6379 \
  api-service

# Or use docker-compose
docker-compose up -d
```

## API Documentation

### Main Interface Routes:

-   `/api/v1/admin/*` - Admin backend interfaces
-   `/api/v1/www/*` - Public access interfaces

## Project Structure

```
services/api-service/
├── app/                # Source code
│   ├── api/           # Interface routes & controllers
│   ├── dao/           # Data access layer
│   ├── models/        # Database models
│   ├── services/      # Business logic services
│   ├── middlewares/   # Custom middlewares
│   └── utils/         # Utility functions
├── tests/             # Test cases
├── introduction/      # API documentation
└── dist/             # Build artifacts
```

## Environment Variables

For complete environment variable configuration, please refer to the `.env.example` file

## Open Source License

MIT License - see the [LICENSE](LICENSE) file for details
