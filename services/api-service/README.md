# @ying-web/api-service 🚀

A robust, Koa.js-powered API service with MySQL integration for the @ying-web ecosystem.

## Overview 🌟

This service is the backbone of the `@ying-web` ecosystem, built with Koa.js and MySQL. It provides RESTful APIs for various applications, including:

-   🎲 Lucky Number Activity APIs
-   📖 Bible Promise APIs
-   🔐 Authentication & Authorization
-   📊 Data Management

## Tech Stack �

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

# Format code
pnpm prettier
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

-   `PORT` - Server port
-   `NODE_ENV` - Environment (development/production)
-   `MYSQL_HOST` - MySQL host
-   `MYSQL_PORT` - MySQL port
-   `MYSQL_USER` - MySQL username
-   `MYSQL_PASSWORD` - MySQL password
-   `MYSQL_DATABASE` - MySQL database name

## API Documentation 📚

API documentation is available in the `introduction` directory, covering:

-   Authentication
-   Endpoints
-   Request/Response formats
-   Error codes

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author ✨

Kris - [Website](https://www.krissarea.com) - [Email](mailto:chenjinwen77@gmail.com)

---

Made with ❤️ by the @ying-web
