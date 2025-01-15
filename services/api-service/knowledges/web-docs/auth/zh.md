# JWT 认证、访问令牌和刷新令牌详解

## 1. 什么是 JWT 认证？

JWT（JSON Web Token）是一个用于在各方之间以 JSON 对象安全传输信息的开放标准。它允许服务器通过将用户身份和其他元数据编码成字符串来验证用户身份并授权访问受保护的资源。JWT 认证的主要优势在于其无状态性，这意味着服务器不需要存储会话信息。

### JWT 的结构

JWT 通常由三部分组成：

-   **头部（Header）**：指定令牌类型（JWT）和签名算法（如 HMAC SHA256）
-   **载荷（Payload）**：包含用户信息和其他声明（如过期时间）
-   **签名（Signature）**：用于验证令牌的完整性和真实性

## 2. 访问令牌（Access Token）

访问令牌是一个短期有效的令牌，用于授权用户访问受保护的资源。它通常在用户登录后生成，并在一定时间后过期。

### 访问令牌示例代码

```javascript
const jwt = require('jsonwebtoken');

// 生成访问令牌的函数
function generateAccessToken(user) {
    // 生成一个15分钟有效期的访问令牌
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' },
    );
}

// 使用示例
const user = { id: 1, email: 'user@example.com' };
const accessToken = generateAccessToken(user);
console.log(accessToken); // 输出生成的访问令牌
```

### 关键流程

1. 用户登录后，服务器验证用户身份
2. 生成访问令牌并返回给客户端
3. 客户端在后续请求中携带访问令牌

## 3. 刷新令牌（Refresh Token）

刷新令牌是一个长期有效的令牌，用于在原访问令牌过期后获取新的访问令牌。刷新令牌通常存储在数据库中，需要更高的安全性。

### 刷新令牌示例代码

```javascript
// 生成刷新令牌的函数
function generateRefreshToken(user) {
    // 生成一个30天有效期的刷新令牌
    return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '30d',
    });
}

// 使用示例
const refreshToken = generateRefreshToken(user);
console.log(refreshToken); // 输出生成的刷新令牌
```

### 关键流程

1. 当访问令牌过期时，客户端使用刷新令牌请求新的访问令牌
2. 服务器验证刷新令牌的有效性
3. 如果有效，生成新的访问令牌并返回给客户端

## 4. 访问令牌和刷新令牌的协作

在实践中，访问令牌和刷新令牌协同工作，提供无缝的用户体验和安全性。以下是它们的协作流程：

1. 用户登录后，服务器生成并返回访问令牌和刷新令牌
2. 客户端使用访问令牌访问受保护资源
3. 当访问令牌过期时，客户端使用刷新令牌请求新的访问令牌
4. 服务器验证刷新令牌，如果有效则生成新的访问令牌并返回

### 使用 Koa.js 实现 JWT 认证的示例代码

```javascript
const Koa = require('koa');
const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

// 中间件：验证访问令牌
async function verifyToken(ctx, next) {
    const token = ctx.headers['authorization']?.split(' ')[1]; // 从请求头获取令牌
    if (!token) {
        ctx.status = 401; // 未授权
        ctx.body = { message: '未找到令牌' };
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // 验证令牌
        ctx.user = decoded; // 将用户信息存储在上下文中
        await next(); // 继续处理请求
    } catch (err) {
        ctx.status = 403; // 禁止访问
        ctx.body = { message: '无效的令牌' };
    }
}

// 登录端点
router.post('/login', async ctx => {
    const { email, password } = ctx.request.body; // 获取用户输入
    // 省略用户验证逻辑
    const user = { id: 1, email }; // 假设用户验证通过
    const accessToken = generateAccessToken(user); // 生成访问令牌
    const refreshToken = generateRefreshToken(user); // 生成刷新令牌
    ctx.body = { accessToken, refreshToken }; // 返回令牌
});

// 受保护资源端点
router.get('/protected', verifyToken, async ctx => {
    ctx.body = { message: '这是受保护的资源', user: ctx.user }; // 返回受保护资源
});

// 刷新访问令牌端点
router.post('/refresh-token', async ctx => {
    const { refreshToken } = ctx.request.body; // 获取刷新令牌
    if (!refreshToken) {
        ctx.status = 401; // 未授权
        ctx.body = { message: '未找到刷新令牌' };
        return;
    }
    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        ); // 验证刷新令牌
        const user = { id: decoded.id }; // 获取用户信息
        const newAccessToken = generateAccessToken(user); // 生成新的访问令牌
        ctx.body = { accessToken: newAccessToken }; // 返回新的访问令牌
    } catch (err) {
        ctx.status = 403; // 禁止访问
        ctx.body = { message: '无效的刷新令牌' };
    }
});

// 启动 Koa 服务器
app.use(bodyParser());
app.use(router.routes());
app.listen(3000, () => {
    console.log('服务器运行在 http://localhost:3000');
});
```

## 5. 前端如何更新访问令牌

当访问令牌过期时，前端需要主动调用 `POST /refresh-token` 端点获取新的访问令牌。以下是详细流程：

### 1. 访问令牌过期

-   当用户使用过期的访问令牌访问受保护资源时，服务器会返回 401 未授权或 403 禁止访问状态。

### 2. 调用刷新令牌端点

-   在捕获到访问令牌过期错误时，前端应从存储中获取刷新令牌，并调用 `POST /refresh-token` 端点，发送刷新令牌以请求新的访问令牌。

### 3. 服务器验证刷新令牌

-   服务器收到刷新令牌后验证其有效性。如果有效，则生成新的访问令牌并返回给前端。

### 4. 更新访问令牌

-   前端收到新的访问令牌后，应将其存储（如存储在 localStorage 或 sessionStorage 中）并在后续请求中使用。

### 示例代码

以下是前端调用刷新令牌端点的示例：

```javascript
async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken'); // 从存储中获取刷新令牌
    if (!refreshToken) {
        console.error('未找到刷新令牌');
        return;
    }

    try {
        const response = await fetch('/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }), // 发送刷新令牌
        });

        if (!response.ok) {
            throw new Error('刷新令牌失败');
        }

        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken); // 更新访问令牌
    } catch (error) {
        console.error('刷新访问令牌出错:', error);
    }
}
```

## 6. 安全最佳实践

### 令牌存储

在前端存储令牌时，需要考虑以下安全影响：

-   **访问令牌**：尽可能存储在内存中，或使用 `sessionStorage` 用于短期会话
-   **刷新令牌**：存储在 `HttpOnly` cookie 中以防止 XSS 攻击

```javascript
// 设置 HttpOnly cookie 存储刷新令牌
ctx.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30天
});
```

### 增强令牌安全性

使用额外选项生成令牌以提高安全性：

```javascript
const tokenOptions = {
    expiresIn: '15m',
    algorithm: 'HS256',
    audience: 'your-api',
    issuer: 'your-service',
};

function generateAccessToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        tokenOptions,
    );
}
```

### CSRF 防护

实现 CSRF 令牌以保护敏感操作：

```javascript
const csrf = require('koa-csrf');

// 添加 CSRF 中间件
app.use(
    csrf({
        invalidTokenMessage: '无效的 CSRF 令牌',
        invalidTokenStatusCode: 403,
        excludedMethods: ['GET', 'HEAD', 'OPTIONS'],
        disableQuery: false,
    }),
);

// 在受保护路由中添加 CSRF 令牌验证
router.post('/protected', verifyToken, async ctx => {
    ctx.assertCSRF(ctx.request.body._csrf);
    // ... 处理程序的其余部分
});
```

### 令牌轮换策略

实现令牌轮换以增强安全性：

```javascript
async function rotateRefreshToken(oldRefreshToken) {
    try {
        const decoded = jwt.verify(
            oldRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );
        // 使旧的刷新令牌失效
        await invalidateRefreshToken(oldRefreshToken);
        // 生成新的刷新令牌
        const user = { id: decoded.id };
        return generateRefreshToken(user);
    } catch (err) {
        throw new Error('无效的刷新令牌');
    }
}

// 更新刷新令牌端点
router.post('/refresh-token', async ctx => {
    const { refreshToken } = ctx.request.body;
    try {
        // 验证并轮换刷新令牌
        const newRefreshToken = await rotateRefreshToken(refreshToken);
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );
        const newAccessToken = generateAccessToken({ id: decoded.id });

        ctx.body = {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    } catch (err) {
        ctx.status = 403;
        ctx.body = { message: '无效的刷新令牌' };
    }
});
```

### 速率限制

实现速率限制以防止滥用：

```javascript
const rateLimit = require('koa-ratelimit');
const Redis = require('ioredis');

// 速率限制配置
app.use(
    rateLimit({
        driver: 'redis',
        db: new Redis(),
        duration: 60000, // 1分钟
        max: 100, // 限制每个 IP 在限制时间内最多 100 个请求
        errorMessage: '请求过于频繁，请稍后再试',
        id: ctx => ctx.ip,
    }),
);
```

### 改进的错误处理

实现详细的令牌错误处理：

```javascript
async function verifyToken(ctx, next) {
    const token = ctx.headers['authorization']?.split(' ')[1];
    if (!token) {
        ctx.status = 401;
        ctx.body = { message: '未找到令牌' };
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        ctx.user = decoded;
        await next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            ctx.status = 401;
            ctx.body = { message: '令牌已过期', code: 'TOKEN_EXPIRED' };
        } else if (err instanceof jwt.JsonWebTokenError) {
            ctx.status = 403;
            ctx.body = { message: '无效的令牌', code: 'INVALID_TOKEN' };
        } else {
            ctx.status = 500;
            ctx.body = { message: '服务器内部错误' };
        }
    }
}
```

## 7. 处理并发请求

在处理多个并发请求和令牌过期时：

```javascript
// 前端处理令牌刷新的工具函数
let refreshTokenPromise = null;

async function getValidAccessToken() {
    const accessToken = localStorage.getItem('accessToken');

    if (!isTokenExpired(accessToken)) {
        return accessToken;
    }

    // 确保只发起一个刷新请求
    if (!refreshTokenPromise) {
        refreshTokenPromise = refreshAccessToken().finally(() => {
            refreshTokenPromise = null;
        });
    }

    await refreshTokenPromise;
    return localStorage.getItem('accessToken');
}

// 在 API 调用中使用
async function apiCall() {
    const accessToken = await getValidAccessToken();
    // 使用有效的令牌发起 API 请求
}
```

## 8. 结论

JWT 认证通过访问令牌和刷新令牌的协作，提供了安全且无状态的用户身份验证。访问令牌用于短期授权，而刷新令牌用于获取新的访问令牌，从而增强用户体验。Koa.js 示例展示了如何实现这个过程，确保用户访问受保护资源时的安全性和便利性。

此外，实施适当的安全措施，如安全的令牌存储、CSRF 防护、令牌轮换和速率限制，对于构建健壮的 JWT 认证系统至关重要。仔细考虑这些安全方面，并结合适当的错误处理和并发请求管理，可以确保应用程序的认证机制安全可靠。
