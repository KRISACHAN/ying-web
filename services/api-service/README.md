# @ying-web/api-service 🚀

Hey there! Welcome to our awesome API service project! This is a modern Node.js backend service built with Koa.js and MySQL.

## Tech Stack ✨

- **Node.js** - JavaScript runtime
- **Koa.js** - Lightweight web framework
- **MySQL** - Relational database
- **Sequelize** - ORM for MySQL
- **Redis** - Cache system
- **PM2** - Process manager
- **Gulp** - Build tool
- **Docker** - Containerization

## Features 🌟

- **Lucky Number System** 🎲
  - Number pool management
  - User participation tracking
  - Activity management

- **Bible Promise Generator** 📖
  - Random verse selection
  - Multiple categories

- **Admin System** 👑
  - RBAC model
  - Permission management
  - User management

- **Infrastructure** 🏗️
  - Redis caching
  - OSS file management
  - Rate limiting
  - PM2 deployment
  - Docker support

## Development 🛠️

### Prerequisites

- Node.js >= 18
- MySQL >= 8
- Redis >= 6
- pnpm >= 8

### Getting Started 🏃‍♀️

```bash
# Install dependencies
pnpm install

# Development mode
pnpm dev

# Build project
pnpm build

# Production mode
pnpm start

# PM2 deployment
pnpm pm2
```

### Code Quality 🧹

```bash
# Run tests
pnpm jest

# Lint code
pnpm lint        # Check app directory
pnpm lint:all    # Check all directories

# Format code
pnpm prettier        # Format app directory
pnpm prettier:all    # Format all directories
```

## Project Structure 📁

```txt
app/
├── api/            # API routes
│   ├── v1/         # API version 1
│   └── health.js   # Health check endpoint
├── constants/      # Constants and configurations
├── dao/           # Data Access Objects
├── middlewares/   # Koa middlewares
├── models/        # Sequelize models
├── services/      # Business logic services
├── utils/         # Utility functions
└── validators/    # Request validators
```

## Environment Variables 🌍

Copy `.env.example` to `.env` and configure:

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

> Note: Make sure to keep your `.env` file secure and never commit it to version control. The `.env.example` file serves as a template for required environment variables.

## Progress ✅

- [x] Basic framework setup
- [x] Database integration
- [x] Redis caching
- [x] RBAC implementation
- [x] API documentation
- [x] Docker support
- [x] PM2 deployment
- [x] Rate limiting
- [ ] Complete unit tests
- [ ] E2E testing

## License 📝

MIT - Feel free to use it! ❤️

---

Made with ❤️ by [@ying-web](https://github.com/KRISACHAN/ying-web)
