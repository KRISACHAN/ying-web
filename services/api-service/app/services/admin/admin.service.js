import { AdminDao } from '@dao/admin/admin';
import { AdminRoleDao } from '@dao/admin/admin-role';
import { NOT_FOUND, PRECONDITION_FAILED } from '@utils/http-errors';
import { BaseService } from './base.service';

/**
 * Admin service
 * Handles admin-related business logic
 */
export class AdminService extends BaseService {
    constructor() {
        super(AdminDao);
    }

    /**
     * Create admin
     * @param {Object} adminData - Admin data
     * @param {Array} roleIds - Role ID array
     * @returns {boolean} Creation result
     */
    async createAdmin({ username, email, password }, roleIds = []) {
        return await this.executeInTransaction(async transaction => {
            this.validateRequiredParams({ username, email, password }, [
                'username',
                'email',
                'password',
            ]);

            // Check if email already exists
            const existingAdmin = await AdminDao.findByEmail(email);
            if (existingAdmin) {
                throw PRECONDITION_FAILED('管理员已存在');
            }

            // Create admin
            const admin = await AdminDao.create(
                { username, email, password },
                transaction,
            );

            // Assign roles
            if (roleIds && roleIds.length > 0) {
                await this.assignRoles(admin.id, roleIds, transaction);
            }

            return true;
        });
    }

    /**
     * Update admin info
     * @param {number} id - Admin ID
     * @param {Object} updates - Update data
     * @returns {boolean} Update result
     */
    async updateAdmin(id, updates) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ id }, ['id']);

            const admin = await AdminDao.findById(id);
            if (!admin) {
                throw NOT_FOUND('管理员不存在');
            }

            // If updating email, check for duplicates
            if (updates.email && updates.email !== admin.email) {
                const existingAdmin = await AdminDao.findByEmail(updates.email);
                if (existingAdmin) {
                    throw PRECONDITION_FAILED('邮箱已被使用');
                }
            }

            return await AdminDao.update(id, updates);
        }, 'Update admin failed');
    }

    /**
     * Delete admin
     * @param {number} id - Admin ID
     * @returns {boolean} Delete result
     */
    async deleteAdmin(id) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ id }, ['id']);

            const admin = await AdminDao.findById(id);
            if (!admin) {
                throw NOT_FOUND('管理员不存在');
            }

            return await AdminDao.delete(id);
        }, 'Delete admin failed');
    }

    /**
     * Get admin list
     * @param {Object} params - Query parameters
     * @param {Object} ctx - Koa context (for caching)
     * @returns {Object} Admin list
     */
    async getAdminList(
        { pageNum = 1, pageSize = 10, filters = {} },
        ctx = null,
    ) {
        return await this.safeExecute(async () => {
            return await AdminDao.query({ pageNum, pageSize }, ctx);
        }, 'Get admin list failed');
    }

    /**
     * Get admin by ID
     * @param {number} id - Admin ID
     * @returns {Object} Admin info
     */
    async getAdminById(id) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ id }, ['id']);
            return await AdminDao.findById(id);
        }, 'Get admin by id failed');
    }

    /**
     * Get admin by email
     * @param {string} email - Email
     * @returns {Object} Admin info
     */
    async getAdminByEmail(email) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ email }, ['email']);
            return await AdminDao.findByEmail(email);
        }, 'Get admin by email failed');
    }

    /**
     * Assign roles to admin
     * @param {number} adminId - Admin ID
     * @param {Array} roleIds - Role ID array
     * @param {Object} transaction - Transaction object
     * @returns {boolean} Assignment result
     */
    async assignRoles(adminId, roleIds, transaction = null) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ adminId, roleIds }, [
                'adminId',
                'roleIds',
            ]);

            // Delete existing roles first
            await AdminRoleDao.deleteByAdmin(adminId, transaction);

            // Add new roles
            if (roleIds.length > 0) {
                await AdminRoleDao.create(
                    roleIds.map(roleId => ({
                        admin_id: adminId,
                        role_id: roleId,
                    })),
                    transaction,
                );
            }

            return true;
        }, 'Assign roles failed');
    }

    /**
     * Update admin roles
     * @param {number} adminId - Admin ID
     * @param {Array} roleIds - Role ID array
     * @returns {boolean} Update result
     */
    async updateAdminRoles(adminId, roleIds) {
        return await this.executeInTransaction(async transaction => {
            return await this.assignRoles(adminId, roleIds, transaction);
        });
    }
}

// Export singleton instance
export const adminService = new AdminService();
export default AdminService;
