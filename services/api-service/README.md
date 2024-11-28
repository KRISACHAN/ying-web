# @ying-web/api-service 🚀

A robust, Koa.js-powered API service with MySQL integration for the @ying-web ecosystem.

## Overview 🌟

This service is the backbone of the `@ying-web` ecosystem, built with Koa.js, MySQL and JavaScript (**Why not TypeScript? Because it has created for a long time, it almost was my first Api service. So, for remembrance, I don't want to change it**). It provides RESTful APIs for various applications within the ecosystem.

## Tech Stack 🚀

-   🌐 **Koa.js** - Next-generation web framework for Node.js
-   🗄️ **MySQL** - Reliable relational database
-   🔄 **Gulp** - Automated build system
-   🐳 **Docker** - Containerization
-   📡 **PM2** - Production process manager
-   🧪 **Jest** - Testing framework
-   � **ESLint & Prettier** - Code quality tools
-   📦 **Babel** - JavaScript compiler

## Getting Started 🎯

### Prerequisites

> **Note:** The same as the root project's `package.json`

-   Node.js >= 18.16.0
-   Pnpm: 9.14.2
-   MySQL >= 8.0
-   PM2 (optional)
-   Docker (optional)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env
```

### Development

```bash
# Start development server
pnpm dev

# Run tests
pnpm jest

# Run linting
pnpm lint

# Run linting on all files
pnpm lint:all

# Format code
pnpm prettier

# Format code on all files
pnpm prettier:all
```

### Production Deployment

#### Using PM2

```bash
# Build the application
pnpm build

# Start with PM2
pnpm pm2
```

#### Using Docker

```bash
# Build Docker image
docker build -t api-service .

# Run with docker-compose
docker-compose up -d
```

## Project Structure 📁

```
services/api-service/
├── app/                # Source code
│   ├── controllers/   # API controllers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   └── validators/    # Request validators
├── tests/             # Test files
├── scripts/           # Build scripts
├── introduction/      # API documentation
└── dist/             # Build output
```

## Environment Variables 🔧

Copy `.env.example` to create your `.env` file:

Required variables:

```bash
# Server Configuration
PORT=3000                           # API server port
MAIN_HOSTNAME="http://localhost:3000"  # Main application hostname
APP_ENV="dev"                       # Application environment (dev/prod)
NODE_ENV="development"              # Node environment (development/production)

# Database Configuration
DB_HOST="localhost"                 # MySQL host
DB_PORT=3306                        # MySQL port
DB_NAME=""                          # MySQL database name
DB_USER=""                          # MySQL username
DB_PASSWORD=                        # MySQL password

# Redis Configuration
REDIS_HOST="localhost"              # Redis host
REDIS_PORT="6379"                   # Redis port

# JWT Authentication
JWT_ACCESS_SECRET_KEY=""            # Secret key for JWT access token
JWT_REFRESH_SECRET_KEY=""           # Secret key for JWT refresh token
JWT_ACCESS_EXPIRED=604800           # Access token expiration time (in seconds, default: 7 days)
JWT_REFRESH_EXPIRED=2592000         # Refresh token expiration time (in seconds, default: 30 days)

# OSS Configuration
OSS_REGION=""                       # Aliyun OSS region (e.g., oss-cn-beijing)
OSS_ACCESS_KEY_ID=""                # Aliyun OSS access key ID
OSS_ACCESS_KEY_SECRET=""            # Aliyun OSS access key secret
OSS_BUCKET=""                       # Aliyun OSS bucket name
OSS_ENDPOINT=""                     # Aliyun OSS endpoint
OSS_STORE_KEY=""                    # Aliyun OSS store key prefix

# Initial Setup Flags
CREATE_TABLE="false"                # Whether to create database tables on startup
CREATE_ADMIN="false"                # Whether to create initial admin user

# Initial Admin Account
INITED_ADMIN_USERNAME=""           # Initial admin username
INITED_ADMIN_PASSWORD=""           # Initial admin password
INITED_ADMIN_EMAIL=""             # Initial admin email
```

## Introduction Documentation 📚

Something about the backend experiences of mine is available `services/api-service/introduction`

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author ✨

Kris - [Website](https://www.krissarea.com) - [Email](mailto:chenjinwen77@gmail.com)

---

Made with ❤️ by the @ying-web
