import { AdminDao } from '@dao/admin/admin';
import { ERROR_NAMES } from '@utils/constants';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '@utils/helpers';
import {
    FORBIDDEN,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    UNAUTHORIZED,
} from '@utils/http-errors';
import { fetchAdminPermissions } from '@utils/permission-helper';
import jwt from 'jsonwebtoken';
import { eq } from 'lodash';
import parseBearerToken from 'parse-bearer-token';
import { BaseService } from './base.service';

/**
 * Authentication service
 * Handles login, token verification, permission checking and other authentication-related business
 */
export class AuthService extends BaseService {
    constructor() {
        super();
    }

    /**
     * Admin login
     * @param {string} email - Email
     * @param {string} password - Password
     * @returns {Object} Login result
     */
    async login(email, password) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ email, password }, [
                'email',
                'password',
            ]);

            // Verify admin account
            const admin = await AdminDao.verify({ email, password });
            if (!admin) {
                throw UNAUTHORIZED('账号不存在或密码错误');
            }

            // Get admin permission info
            const adminData = await fetchAdminPermissions(admin.id);
            if (!adminData || !adminData.permissions.length) {
                throw INTERNAL_SERVER_ERROR('获取管理员权限失败');
            }

            // Generate token
            const accessToken = generateAccessToken(
                admin.id,
                adminData.permissionNames,
            );
            const refreshToken = generateRefreshToken(
                admin.id,
                adminData.permissionNames,
            );

            return {
                access_token: accessToken,
                refresh_token: refreshToken,
                admin_info: {
                    admin: adminData.admin,
                    roles: adminData.roles,
                    permissions: adminData.permissions,
                },
            };
        }, 'Admin login failed');
    }

    /**
     * Verify token and get permission info
     * @param {string} token - JWT Token
     * @returns {Object} Authentication result
     */
    async verifyToken(token) {
        return await this.safeExecute(async () => {
            if (!token) {
                throw UNAUTHORIZED('未登录，请先登录');
            }

            let uid;
            let scopes;
            try {
                const tokenData = jwt.verify(
                    token,
                    process.env.ADMIN_ACCESS_SECRET_KEY,
                );
                uid = tokenData.uid;
                scopes = tokenData.scopes;
            } catch (error) {
                if (eq(error.name, ERROR_NAMES.TOKEN_EXPIRED_ERROR)) {
                    throw UNAUTHORIZED('token 已过期，请重新登录');
                }
                throw FORBIDDEN(error.message || '权限不足');
            }

            // Verify admin status
            const admin = await AdminDao.search({ id: uid });
            if (!admin || !admin.status) {
                throw NOT_FOUND('管理员不存在');
            }

            // Get permission info
            const adminData = await fetchAdminPermissions(uid);
            if (!adminData || !adminData.permissions.length) {
                throw FORBIDDEN('没有访问权限');
            }

            return {
                admin: adminData.admin,
                roles: adminData.roles,
                permissions: adminData.permissions,
                auth: {
                    uid,
                    scopes,
                },
            };
        }, 'Token verification failed');
    }

    /**
     * Refresh access token
     * @param {string} refreshToken - Refresh token
     * @returns {Object} New token info
     */
    async refreshToken(refreshToken) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ refreshToken }, ['refreshToken']);

            // Verify refresh token
            const tokenData = verifyRefreshToken(refreshToken);

            // Get latest permission info
            const adminData = await fetchAdminPermissions(tokenData.uid);
            if (!adminData || !adminData.permissions.length) {
                throw FORBIDDEN('权限已变更，请重新登录');
            }

            // Generate new token
            const newAccessToken = generateAccessToken(
                tokenData.uid,
                adminData.permissionNames,
            );
            const newRefreshToken = generateRefreshToken(
                tokenData.uid,
                adminData.permissionNames,
            );

            return {
                access_token: newAccessToken,
                refresh_token: newRefreshToken,
                admin_info: {
                    admin: adminData.admin,
                    roles: adminData.roles,
                    permissions: adminData.permissions,
                },
            };
        }, 'Token refresh failed');
    }

    /**
     * Check admin permission
     * @param {number} adminId - Admin ID
     * @param {string} requiredPermission - Required permission
     * @returns {boolean} Whether has permission
     */
    async checkPermission(adminId, requiredPermission) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ adminId, requiredPermission }, [
                'adminId',
                'requiredPermission',
            ]);

            const adminData = await fetchAdminPermissions(adminId);
            if (!adminData) {
                return false;
            }

            return (
                adminData.permissionNames.includes(requiredPermission) ||
                adminData.permissionNames.includes('all_accesses')
            );
        }, 'Permission check failed');
    }

    /**
     * Extract token from request
     * @param {Object} request - Koa request object
     * @returns {string|null} Token string
     */
    extractTokenFromRequest(request) {
        return parseBearerToken(request);
    }

    /**
     * Get admin permission info
     * @param {number} adminId - Admin ID
     * @returns {Object} Permission info
     */
    async getAdminPermissions(adminId) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ adminId }, ['adminId']);
            return await fetchAdminPermissions(adminId);
        }, 'Get admin permissions failed');
    }
}

// Export singleton instance
export const authService = new AuthService();
export default AuthService;
