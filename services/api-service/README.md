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
│   ├── dao/           # Data access layer (optimized with caching)
│   ├── models/        # Database models (with associations)
│   ├── services/      # Business logic services (NEW)
│   │   ├── base.service.js      # Base service with transaction management
│   │   ├── auth.service.js      # Authentication & authorization
│   │   ├── admin/               # Admin management services
│   │   ├── lucky-number/        # Lucky number activity services
│   │   ├── option-draw/         # Option draw activity services
│   │   └── promise/             # Promise management services
│   ├── middlewares/   # Custom middlewares (enhanced)
│   │   ├── performance.js       # Performance monitoring
│   │   ├── security-headers.js  # Security headers
│   │   ├── audit-log.js         # Audit logging
│   │   └── auths/               # Authentication middlewares
│   ├── utils/         # Utility functions (enhanced)
│   │   ├── permission-helper.js # Optimized permission queries
│   │   └── init.js              # Enhanced rate limiting
│   └── index.js       # Application entry point
├── knowledges/        # Database schemas and documentation
│   └── models/        # SQL schema files
├── tests/             # Test cases
├── introduction/      # API documentation
└── dist/             # Build artifacts
```

## Environment Variables

For complete environment variable configuration, please refer to the `.env.example` file

### Key Environment Variables:

-   **Database**: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
-   **Redis**: `REDIS_HOST`, `REDIS_PORT`
-   **Authentication**: `ADMIN_ACCESS_SECRET_KEY`, `ADMIN_REFRESH_SECRET_KEY`
-   **Application**: `APP_ENV`, `PORT`, `CREATE_TABLE`, `CREATE_ADMIN`

## Performance Monitoring

The system now includes comprehensive performance monitoring:

-   **Response Time Tracking**: Automatic measurement of request response times
-   **Database Query Counting**: Real-time tracking of database query frequency
-   **Slow Query Detection**: Automatic detection and logging of queries > 100ms
-   **Cache Hit Rate**: Monitoring of cache performance metrics
-   **Performance Headers**: Response headers include `X-Response-Time` and `X-DB-Queries`

## Security Features

Enhanced security measures implemented:

-   **Security Headers**: CSP, HSTS, XSS protection, clickjacking prevention
-   **Rate Limiting**: Differentiated limits for login (5/min), queries (200/min), general (100/min)
-   **Audit Logging**: Complete trail of admin actions and sensitive operations
-   **Input Validation**: Enhanced request validation and sanitization

## Open Source License

MIT License - see the [LICENSE](LICENSE) file for details
