import log from '@utils/log';
import dayjs from 'dayjs';

/**
 * Audit logging middleware
 * Records admin operations, permission changes, login/logout and other sensitive operations
 */
const auditLogMiddleware = async (ctx, next) => {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substr(2, 9);

    // Record request start
    const auditData = {
        requestId,
        timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        method: ctx.method,
        url: ctx.url,
        ip: ctx.ip,
        userAgent: ctx.headers['user-agent'],
        adminId: null,
        adminEmail: null,
        action: null,
        status: null,
        responseTime: null,
        error: null,
    };

    // Try to get admin info
    if (ctx.admin && ctx.admin.admin) {
        auditData.adminId = ctx.admin.admin.id;
        auditData.adminEmail = ctx.admin.admin.email;
    }

    // Determine action type based on path and method
    const path = ctx.path;
    const method = ctx.method;

    if (path.includes('/login')) {
        auditData.action = 'LOGIN';
    } else if (path.includes('/logout')) {
        auditData.action = 'LOGOUT';
    } else if (method === 'POST' && path.includes('/create')) {
        auditData.action = 'CREATE';
    } else if (method === 'PUT' && path.includes('/update')) {
        auditData.action = 'UPDATE';
    } else if (method === 'DELETE') {
        auditData.action = 'DELETE';
    } else if (method === 'GET' && path.includes('/query')) {
        auditData.action = 'QUERY';
    } else {
        auditData.action = 'ACCESS';
    }

    try {
        await next();

        // Record successful response
        auditData.status = ctx.status;
        auditData.responseTime = Date.now() - startTime;

        // Record audit log
        logAudit(auditData);
    } catch (error) {
        // Record error response
        auditData.status = error.status || 500;
        auditData.responseTime = Date.now() - startTime;
        auditData.error = error.message;

        // Record audit log
        logAudit(auditData);

        throw error;
    }
};

/**
 * Record audit log
 * @param {Object} auditData - Audit data
 */
function logAudit(auditData) {
    const logMessage = [
        `[AUDIT] ${auditData.requestId}`,
        `${auditData.timestamp}`,
        `${auditData.method} ${auditData.url}`,
        `IP: ${auditData.ip}`,
        `Admin: ${auditData.adminId || 'N/A'} (${auditData.adminEmail || 'N/A'})`,
        `Action: ${auditData.action}`,
        `Status: ${auditData.status}`,
        `Time: ${auditData.responseTime}ms`,
        auditData.error ? `Error: ${auditData.error}` : '',
    ]
        .filter(Boolean)
        .join(' | ');

    // Choose log level based on operation type and status
    if (auditData.action === 'LOGIN' || auditData.action === 'LOGOUT') {
        log.info(logMessage);
    } else if (auditData.status >= 400) {
        log.warn(logMessage);
    } else if (
        auditData.action === 'CREATE' ||
        auditData.action === 'UPDATE' ||
        auditData.action === 'DELETE'
    ) {
        log.info(logMessage);
    } else {
        log.debug(logMessage);
    }
}

/**
 * Permission change audit log
 * @param {Object} data - Permission change data
 */
export function logPermissionChange(data) {
    const logMessage = [
        `[PERMISSION_CHANGE]`,
        `Admin: ${data.adminId} (${data.adminEmail})`,
        `Action: ${data.action}`,
        `Target: ${data.targetType} (${data.targetId})`,
        `Details: ${JSON.stringify(data.details)}`,
        `Timestamp: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
    ].join(' | ');

    log.info(logMessage);
}

/**
 * Sensitive operation audit log
 * @param {Object} data - Sensitive operation data
 */
export function logSensitiveOperation(data) {
    const logMessage = [
        `[SENSITIVE_OPERATION]`,
        `Admin: ${data.adminId} (${data.adminEmail})`,
        `Operation: ${data.operation}`,
        `Resource: ${data.resource}`,
        `Details: ${JSON.stringify(data.details)}`,
        `Timestamp: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
    ].join(' | ');

    log.warn(logMessage);
}

export default auditLogMiddleware;
