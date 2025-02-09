[English Documentation](/services/api-service/README.md) · [中文文档](/services/api-service/README.zh-CN.md)

# @ying-web/api-service 🚀

A robust, Koa.js-powered API service with MySQL integration for the @ying-web.

## Overview 🌟

This service is the backbone of the `@ying-web` ecosystem, built with Koa.js, MySQL and JavaScript (**Why not TypeScript? Because it has created for a long time, it almost was my first Api service. So, for remembrance, I don't want to change it**). It provides RESTful APIs for various applications within the ecosystem.

## Tech Stack 🛠

-   🌐 **Koa.js** - Next-generation web framework for Node.js
-   🗄️ **MySQL** - Reliable relational database
-   📡 **Redis** - In-memory data structure store
-   🔄 **Gulp** - Automated build system
-   🐳 **Docker** - Containerization
-   📡 **PM2** - Production process manager
-   🧪 **Vitest** - Modern testing framework
-   🔍 **ESLint & Prettier** - Code quality tools
-   📦 **Babel** - JavaScript compiler

## Prerequisites 📋

-   Node.js >= 18.16.0
-   Pnpm: 8.5.1
-   MySQL >= 8.0
-   Redis >= 6.0
-   PM2 (optional for production)
-   Docker (optional for containerization)

## Local Development 💻

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment:

```bash
# Copy environment file
cp .env.example .env

# Edit .env file with your configurations
vim .env
```

3. Start development server:

```bash
# Start with hot reload
pnpm dev
```

4. Run tests:

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## Production Deployment 🚀

### Using PM2

1. Build the application:

```bash
pnpm build
```

2. Configure PM2:

```bash
# Start with PM2
pnpm pm2
```

### Using Docker

1. Build Docker image:

```bash
# Build image
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

## API Documentation 📚

API documentation is available in the `services/api-service/introduction` directory.

### Main API Routes:

-   🔐 `/api/v1/admin/*` - Admin management APIs
-   🌐 `/api/v1/www/*` - Public APIs

## Project Structure 📁

```
services/api-service/
├── app/                # Source code
│   ├── api/           # API routes & controllers
│   ├── dao/           # Data Access Objects
│   ├── models/        # Database models
│   ├── services/      # Business logic services
│   ├── middlewares/   # Custom middlewares
│   └── utils/         # Utility functions
├── tests/             # Test files
├── introduction/      # API documentation
└── dist/             # Build output
```

## Environment Variables 🔧

See `.env.example` for all required environment variables.

## License 📝

MIT License - see the [LICENSE](LICENSE) file for details.

## Author ✨

Kris - [Website](https://www.krissarea.com) - [Email](mailto:chenjinwen77@gmail.com)

---

Made with ❤️ by the @ying-web
