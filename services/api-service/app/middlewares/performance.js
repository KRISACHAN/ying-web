import log from '@utils/log';

// Performance monitoring data storage
const performanceData = {
    requestCount: 0,
    totalResponseTime: 0,
    slowRequests: [],
    dbQueryCount: 0,
    cacheHits: 0,
    cacheMisses: 0,
};

// Reset performance data
export function resetPerformanceData() {
    performanceData.requestCount = 0;
    performanceData.totalResponseTime = 0;
    performanceData.slowRequests = [];
    performanceData.dbQueryCount = 0;
    performanceData.cacheHits = 0;
    performanceData.cacheMisses = 0;
}

// Get performance statistics
export function getPerformanceStats() {
    const avgResponseTime =
        performanceData.requestCount > 0
            ? performanceData.totalResponseTime / performanceData.requestCount
            : 0;

    const cacheHitRate =
        performanceData.cacheHits + performanceData.cacheMisses > 0
            ? (performanceData.cacheHits /
                  (performanceData.cacheHits + performanceData.cacheMisses)) *
              100
            : 0;

    return {
        requestCount: performanceData.requestCount,
        avgResponseTime: Math.round(avgResponseTime * 100) / 100,
        slowRequests: performanceData.slowRequests.length,
        dbQueryCount: performanceData.dbQueryCount,
        cacheHitRate: Math.round(cacheHitRate * 100) / 100,
        cacheHits: performanceData.cacheHits,
        cacheMisses: performanceData.cacheMisses,
    };
}

// Performance monitoring middleware
const performanceMiddleware = async (ctx, next) => {
    const startTime = Date.now();
    const startDbQueries = performanceData.dbQueryCount;

    // Monitor cache operations
    // Store original methods bound to the cache instance to avoid circular references
    const originalCacheGet = ctx.cache?.get?.bind(ctx.cache);
    const originalCacheSet = ctx.cache?.set?.bind(ctx.cache);

    if (ctx.cache && originalCacheGet && originalCacheSet) {
        // Wrap get method to track cache hits/misses
        ctx.cache.get = async function (key) {
            const result = await originalCacheGet(key);
            if (result !== undefined) {
                performanceData.cacheHits++;
            } else {
                performanceData.cacheMisses++;
            }
            return result;
        };

        // Wrap set method (currently just passes through)
        ctx.cache.set = async function (key, value, ttl) {
            return await originalCacheSet(key, value, ttl);
        };
    }

    try {
        await next();
    } finally {
        // Restore original cache methods to prevent memory leaks
        if (ctx.cache && originalCacheGet && originalCacheSet) {
            ctx.cache.get = originalCacheGet;
            ctx.cache.set = originalCacheSet;
        }
    }

    const responseTime = Date.now() - startTime;
    const dbQueriesInRequest = performanceData.dbQueryCount - startDbQueries;

    // Record performance data
    performanceData.requestCount++;
    performanceData.totalResponseTime += responseTime;

    // Record slow requests
    if (responseTime > 1000) {
        // Requests over 1 second
        performanceData.slowRequests.push({
            method: ctx.method,
            url: ctx.url,
            responseTime,
            dbQueries: dbQueriesInRequest,
            timestamp: new Date().toISOString(),
        });

        // Keep only recent 100 slow requests
        if (performanceData.slowRequests.length > 100) {
            performanceData.slowRequests =
                performanceData.slowRequests.slice(-100);
        }
    }

    // Record performance info to logs
    if (responseTime > 500) {
        // Log warning for requests over 500ms
        log.warn(
            `慢请求 [${responseTime}ms] ${ctx.method} ${ctx.url} (DB查询: ${dbQueriesInRequest}次)`,
        );
    } else {
        log.debug(
            `请求 [${responseTime}ms] ${ctx.method} ${ctx.url} (DB查询: ${dbQueriesInRequest}次)`,
        );
    }

    // Add performance headers
    ctx.set('X-Response-Time', `${responseTime}ms`);
    ctx.set('X-DB-Queries', dbQueriesInRequest.toString());
};

// Database query counter middleware
export const dbQueryCounterMiddleware = async (ctx, next) => {
    // Listen to Sequelize query events
    const { sequelize } = await import('@services/db');

    const queryListener = () => {
        performanceData.dbQueryCount++;
    };

    sequelize.addHook('beforeQuery', queryListener);

    await next();

    sequelize.removeHook('beforeQuery', queryListener);
};

export default performanceMiddleware;
