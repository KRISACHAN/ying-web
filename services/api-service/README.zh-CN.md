[English Documentation](/services/api-service/README.md) · [中文文档](/services/api-service/README.zh-CN.md)

# @ying-web/api-service 🚀

为 @ying-web 提供基于 Koa.js + MySQL 的稳健 API 服务

## 概述 🌟

本服务是 `@ying-web` 的核心枢纽，采用 Koa.js + MySQL + JavaScript 构建（为何不用 TypeScript？因这是早期创建的首个 API 服务，为保留历史原貌未作改动）。为生态系统内各应用提供 RESTful API 支持。

## 技术栈 🛠

-   🌐 **Koa.js** - 下一代 Node.js Web 框架
-   🗄️ **MySQL** - 可靠的关系型数据库
-   📡 **Redis** - 内存数据结构存储
-   🔄 **Gulp** - 自动化构建系统
-   🐳 **Docker** - 容器化部署
-   📡 **PM2** - 生产环境进程管理
-   🧪 **Vitest** - 现代化测试框架
-   🔍 **ESLint & Prettier** - 代码质量工具
-   📦 **Babel** - JavaScript 编译器

## 环境要求 📋

-   Node.js >= 18.16.0
-   Pnpm: 8.5.1
-   MySQL >= 8.0
-   Redis >= 6.0
-   PM2 (生产环境推荐)
-   Docker (容器化部署可选)

## 本地开发 💻

1. 安装依赖：

```bash
pnpm install
```

2. 配置环境变量：

```bash
# 复制环境文件模板
cp .env.example .env

# 编辑配置信息
vim .env
```

3. 启动开发服务器：

```bash
# 带热重载功能
pnpm dev
```

4. 运行测试：

```bash
# 执行测试
pnpm test

# 监听模式运行测试
pnpm test:watch

# 生成测试覆盖率报告
pnpm test:coverage
```

## 生产部署 🚀

### 使用 PM2

1. 构建应用：

```bash
pnpm build
```

2. PM2 配置：

```bash
# 通过 PM2 启动
pnpm pm2
```

### 使用 Docker

1. 构建镜像：

```bash
# 构建 Docker 镜像
docker build -t api-service .
```

2. 运行容器：

```bash
# 带环境变量运行
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

# 或使用 docker-compose
docker-compose up -d
```

## API 文档 📚

完整 API 文档请查看 `services/api-service/introduction` 目录

### 主要接口路由：

-   🔐 `/api/v1/admin/*` - 管理后台接口
-   🌐 `/api/v1/www/*` - 公共访问接口

## 项目结构 📁

```
services/api-service/
├── app/                # 源代码
│   ├── api/           # 接口路由与控制器
│   ├── dao/           # 数据访问层
│   ├── models/        # 数据库模型
│   ├── services/      # 业务逻辑服务
│   ├── middlewares/   # 自定义中间件
│   └── utils/         # 工具函数
├── tests/             # 测试用例
├── introduction/      # API 文档
└── dist/             # 构建产物
```

## 环境变量 🔧

完整环境变量配置请参考 `.env.example` 文件

## 开源协议 📝

MIT 协议 - 详见 [LICENSE](LICENSE) 文件

## 作者 ✨

Kris（鱼头） - [个人网站](https://www.krissarea.com) - [联系邮箱](mailto:chenjinwen77@gmail.com)

---

来自 @ying-web ❤️
