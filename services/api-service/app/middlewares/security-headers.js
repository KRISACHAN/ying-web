/**
 * Security headers middleware
 * Adds various security-related HTTP response headers
 */
const securityHeadersMiddleware = async (ctx, next) => {
    // Prevent MIME type sniffing
    ctx.set('X-Content-Type-Options', 'nosniff');

    // Prevent clickjacking attacks
    ctx.set('X-Frame-Options', 'DENY');

    // Enable XSS filter
    ctx.set('X-XSS-Protection', '1; mode=block');

    // HTTPS forced transport security (only in HTTPS environment)
    if (ctx.protocol === 'https') {
        ctx.set(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains',
        );
    }

    // Content Security Policy (CSP) - basic configuration
    ctx.set(
        'Content-Security-Policy',
        "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: https:; " +
            "font-src 'self' data:; " +
            "connect-src 'self'; " +
            "frame-ancestors 'none';",
    );

    // Referrer policy
    ctx.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions policy
    ctx.set(
        'Permissions-Policy',
        'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=()',
    );

    await next();
};

export default securityHeadersMiddleware;
