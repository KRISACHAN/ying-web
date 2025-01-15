# JWT Authentication, Access Token, and Refresh Token Explained

## 1. What is JWT Authentication?

JWT (JSON Web Token) is an open standard for securely transmitting information between parties as a JSON object. It allows servers to verify the identity of users and authorize access to protected resources by encoding user identity and other metadata into a string. The primary advantage of JWT authentication is its statelessness, meaning the server does not need to store session information.

### Structure of a JWT

A JWT typically consists of three parts:

-   **Header**: Specifies the type of token (JWT) and the signing algorithm (e.g., HMAC SHA256).
-   **Payload**: Contains user information and other claims (e.g., expiration time).
-   **Signature**: Used to verify the integrity and authenticity of the token.

## 2. Access Token

An Access Token is a short-lived token used to authorize user access to protected resources. It is usually generated after user login and expires after a certain period.

### Access Token Example Code

```javascript
const jwt = require('jsonwebtoken');

// Function to generate an Access Token
function generateAccessToken(user) {
    // Generate an Access Token with a 15-minute expiration
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' },
    );
}

// Usage example
const user = { id: 1, email: 'user@example.com' };
const accessToken = generateAccessToken(user);
console.log(accessToken); // Outputs the generated Access Token
```

### Key Process

1. After user login, the server verifies the user's identity.
2. An Access Token is generated and returned to the client.
3. The client includes the Access Token in subsequent requests.

## 3. Refresh Token

A Refresh Token is a long-lived token used to obtain a new Access Token after the original one expires. Refresh Tokens are typically stored in a database and require higher security.

### Refresh Token Example Code

```javascript
// Function to generate a Refresh Token
function generateRefreshToken(user) {
    // Generate a Refresh Token with a 30-day expiration
    return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '30d',
    });
}

// Usage example
const refreshToken = generateRefreshToken(user);
console.log(refreshToken); // Outputs the generated Refresh Token
```

### Key Process

1. When the Access Token expires, the client uses the Refresh Token to request a new Access Token.
2. The server verifies the validity of the Refresh Token.
3. If valid, a new Access Token is generated and returned to the client.

## 4. Collaboration between Access Token and Refresh Token

In practice, Access Tokens and Refresh Tokens work together to provide a seamless user experience and security. Here is their collaborative process:

1. After user login, the server generates and returns both Access and Refresh Tokens.
2. The client uses the Access Token to access protected resources.
3. When the Access Token expires, the client uses the Refresh Token to request a new Access Token.
4. The server verifies the Refresh Token and, if valid, generates a new Access Token and returns it.

### Example Code: Implementing JWT Authentication with Koa.js

```javascript
const Koa = require('koa');
const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

// Middleware: Verify Access Token
async function verifyToken(ctx, next) {
    const token = ctx.headers['authorization']?.split(' ')[1]; // Get Token from request header
    if (!token) {
        ctx.status = 401; // Unauthorized
        ctx.body = { message: 'Token not found' };
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify Token
        ctx.user = decoded; // Store user info in context
        await next(); // Continue processing request
    } catch (err) {
        ctx.status = 403; // Forbidden
        ctx.body = { message: 'Invalid Token' };
    }
}

// Login endpoint
router.post('/login', async ctx => {
    const { email, password } = ctx.request.body; // Get user input
    // User verification logic omitted
    const user = { id: 1, email }; // Assume user verification passed
    const accessToken = generateAccessToken(user); // Generate Access Token
    const refreshToken = generateRefreshToken(user); // Generate Refresh Token
    ctx.body = { accessToken, refreshToken }; // Return Tokens
});

// Protected resource endpoint
router.get('/protected', verifyToken, async ctx => {
    ctx.body = { message: 'This is a protected resource', user: ctx.user }; // Return protected resource
});

// Refresh Access Token endpoint
router.post('/refresh-token', async ctx => {
    const { refreshToken } = ctx.request.body; // Get Refresh Token
    if (!refreshToken) {
        ctx.status = 401; // Unauthorized
        ctx.body = { message: 'Refresh Token not found' };
        return;
    }
    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        ); // Verify Refresh Token
        const user = { id: decoded.id }; // Get user info
        const newAccessToken = generateAccessToken(user); // Generate new Access Token
        ctx.body = { accessToken: newAccessToken }; // Return new Access Token
    } catch (err) {
        ctx.status = 403; // Forbidden
        ctx.body = { message: 'Invalid Refresh Token' };
    }
});

// Start Koa server
app.use(bodyParser());
app.use(router.routes());
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
```

## 5. How the Frontend Updates the Access Token

When the Access Token expires, the frontend needs to proactively call the `POST /refresh-token` endpoint to obtain a new Access Token. Here is the detailed process:

### 1. Access Token Expiration

-   When the user accesses a protected resource with an expired Access Token, the server responds with a 401 Unauthorized or 403 Forbidden status.

### 2. Call Refresh Token Endpoint

-   Upon catching the Access Token expiration error, the frontend should retrieve the Refresh Token from storage and call the `POST /refresh-token` endpoint, sending the Refresh Token to request a new Access Token.

### 3. Server Verifies Refresh Token

-   Upon receiving the Refresh Token, the server verifies its validity. If valid, the server generates a new Access Token and returns it to the frontend.

### 4. Update Access Token

-   Upon receiving the new Access Token, the frontend should store it (e.g., in localStorage or sessionStorage) and use it in subsequent requests.

### Example Code

Here is an example of how the frontend calls the Refresh Token endpoint:

```javascript
async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken'); // Retrieve Refresh Token from storage
    if (!refreshToken) {
        console.error('No refresh token found');
        return;
    }

    try {
        const response = await fetch('/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }), // Send Refresh Token
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken); // Update Access Token
    } catch (error) {
        console.error('Error refreshing access token:', error);
    }
}
```

## 6. Security Best Practices

### Token Storage

When storing tokens in the frontend, consider the following security implications:

-   **Access Token**: Store in memory when possible, or use `sessionStorage` for short-lived sessions
-   **Refresh Token**: Store in `HttpOnly` cookies to prevent XSS attacks

```javascript
// Set HttpOnly cookie for Refresh Token
ctx.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
});
```

### Enhanced Token Security

Use additional options when generating tokens to improve security:

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

### CSRF Protection

Implement CSRF tokens for sensitive operations:

```javascript
const csrf = require('koa-csrf');

// Add CSRF middleware
app.use(
    csrf({
        invalidTokenMessage: 'Invalid CSRF token',
        invalidTokenStatusCode: 403,
        excludedMethods: ['GET', 'HEAD', 'OPTIONS'],
        disableQuery: false,
    }),
);

// Add CSRF token to protected routes
router.post('/protected', verifyToken, async ctx => {
    ctx.assertCSRF(ctx.request.body._csrf);
    // ... rest of the handler
});
```

### Token Rotation Strategy

Implement token rotation to enhance security:

```javascript
async function rotateRefreshToken(oldRefreshToken) {
    try {
        const decoded = jwt.verify(
            oldRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );
        // Invalidate old refresh token
        await invalidateRefreshToken(oldRefreshToken);
        // Generate new refresh token
        const user = { id: decoded.id };
        return generateRefreshToken(user);
    } catch (err) {
        throw new Error('Invalid refresh token');
    }
}

// Update refresh token endpoint
router.post('/refresh-token', async ctx => {
    const { refreshToken } = ctx.request.body;
    try {
        // Verify and rotate refresh token
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
        ctx.body = { message: 'Invalid refresh token' };
    }
});
```

### Rate Limiting

Implement rate limiting to prevent abuse:

```javascript
const rateLimit = require('koa-ratelimit');
const Redis = require('ioredis');

// Rate limiting configuration
app.use(
    rateLimit({
        driver: 'redis',
        db: new Redis(),
        duration: 60000, // 1 minute
        max: 100, // limit each IP to 100 requests per duration
        errorMessage: 'Too many requests, please try again later.',
        id: ctx => ctx.ip,
    }),
);
```

### Improved Error Handling

Implement detailed error handling for different token scenarios:

```javascript
async function verifyToken(ctx, next) {
    const token = ctx.headers['authorization']?.split(' ')[1];
    if (!token) {
        ctx.status = 401;
        ctx.body = { message: 'Token not found' };
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        ctx.user = decoded;
        await next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            ctx.status = 401;
            ctx.body = { message: 'Token expired', code: 'TOKEN_EXPIRED' };
        } else if (err instanceof jwt.JsonWebTokenError) {
            ctx.status = 403;
            ctx.body = { message: 'Invalid token', code: 'INVALID_TOKEN' };
        } else {
            ctx.status = 500;
            ctx.body = { message: 'Internal server error' };
        }
    }
}
```

## 7. Handling Concurrent Requests

When dealing with multiple concurrent requests and token expiration:

```javascript
// Frontend utility for handling token refresh
let refreshTokenPromise = null;

async function getValidAccessToken() {
    const accessToken = localStorage.getItem('accessToken');

    if (!isTokenExpired(accessToken)) {
        return accessToken;
    }

    // Ensure only one refresh request is made
    if (!refreshTokenPromise) {
        refreshTokenPromise = refreshAccessToken().finally(() => {
            refreshTokenPromise = null;
        });
    }

    await refreshTokenPromise;
    return localStorage.getItem('accessToken');
}

// Usage in API calls
async function apiCall() {
    const accessToken = await getValidAccessToken();
    // Make API request with valid token
}
```

## 8. Conclusion

JWT authentication, through the collaboration of Access Tokens and Refresh Tokens, provides secure and stateless user identity verification. Access Tokens are used for short-term authorization, while Refresh Tokens are used to obtain new Access Tokens, enhancing user experience. The Koa.js example demonstrates how to implement this process, ensuring security and convenience when users access protected resources.

Additionally, implementing proper security measures such as secure token storage, CSRF protection, token rotation, and rate limiting is crucial for a robust JWT authentication system. Careful consideration of these security aspects, along with proper error handling and concurrent request management, ensures a secure and reliable authentication mechanism for your application.
