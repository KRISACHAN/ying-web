import { PromiseDao } from '@dao/promise/promise';
import { PromiseCategoryDao } from '@dao/promise/promise-category';
import { BAD_REQUEST, NOT_FOUND } from '@utils/http-errors';
import { BaseService } from '../base.service';

/**
 * Promise service
 * Handles promise related business logic
 */
export class PromiseService extends BaseService {
    constructor() {
        super(PromiseDao);
    }

    /**
     * Create promise
     * @param {Object} promiseData - Promise data
     * @returns {Object} Created promise
     */
    async createPromise({
        title,
        content,
        categoryId,
        userId,
        deadline = null,
    }) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams(
                { title, content, categoryId, userId },
                ['title', 'content', 'categoryId', 'userId'],
            );

            // Verify category exists
            const category = await PromiseCategoryDao.findById(categoryId);
            if (!category) {
                throw BAD_REQUEST('承诺分类不存在');
            }

            return await PromiseDao.create({
                title,
                content,
                category_id: categoryId,
                user_id: userId,
                deadline,
                status: 'pending',
            });
        }, 'Create promise failed');
    }

    /**
     * Update promise
     * @param {number} id - Promise ID
     * @param {Object} updates - Update data
     * @returns {boolean} Update result
     */
    async updatePromise(id, updates) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ id }, ['id']);

            const promise = await PromiseDao.findById(id);
            if (!promise) {
                throw NOT_FOUND('承诺不存在');
            }

            // If updating category, verify category exists
            if (updates.categoryId) {
                const category = await PromiseCategoryDao.findById(
                    updates.categoryId,
                );
                if (!category) {
                    throw BAD_REQUEST('承诺分类不存在');
                }
                updates.category_id = updates.categoryId;
                delete updates.categoryId;
            }

            return await PromiseDao.update(id, updates);
        }, 'Update promise failed');
    }

    /**
     * Delete promise
     * @param {number} id - Promise ID
     * @returns {boolean} Delete result
     */
    async deletePromise(id) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ id }, ['id']);

            const promise = await PromiseDao.findById(id);
            if (!promise) {
                throw NOT_FOUND('承诺不存在');
            }

            return await PromiseDao.delete(id);
        }, 'Delete promise failed');
    }

    /**
     * Get promise list
     * @param {Object} params - Query parameters
     * @param {Object} ctx - Koa context (for caching)
     * @returns {Object} Promise list
     */
    async getPromiseList(
        { pageNum = 1, pageSize = 10, filters = {} },
        ctx = null,
    ) {
        return await this.safeExecute(async () => {
            return await PromiseDao.query({ pageNum, pageSize, filters }, ctx);
        }, 'Get promise list failed');
    }

    /**
     * Get promise by ID
     * @param {number} id - Promise ID
     * @returns {Object} Promise info
     */
    async getPromiseById(id) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ id }, ['id']);
            return await PromiseDao.findById(id);
        }, 'Get promise by id failed');
    }

    /**
     * Update promise status
     * @param {number} id - Promise ID
     * @param {string} status - New status
     * @returns {boolean} Update result
     */
    async updatePromiseStatus(id, status) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ id, status }, ['id', 'status']);

            // Validate status value
            if (
                !['pending', 'completed', 'failed', 'cancelled'].includes(
                    status,
                )
            ) {
                throw BAD_REQUEST('无效的承诺状态');
            }

            const promise = await PromiseDao.findById(id);
            if (!promise) {
                throw NOT_FOUND('承诺不存在');
            }

            return await PromiseDao.update(id, { status });
        }, 'Update promise status failed');
    }

    /**
     * Create promise category
     * @param {Object} categoryData - Category data
     * @returns {Object} Created category
     */
    async createPromiseCategory({ name, description, color = '#000000' }) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ name }, ['name']);

            // Check if category name already exists
            const existingCategory = await PromiseCategoryDao.findByName(name);
            if (existingCategory) {
                throw BAD_REQUEST('承诺分类已存在');
            }

            return await PromiseCategoryDao.create({
                name,
                description,
                color,
            });
        }, 'Create promise category failed');
    }

    /**
     * Update promise category
     * @param {number} id - Category ID
     * @param {Object} updates - Update data
     * @returns {boolean} Update result
     */
    async updatePromiseCategory(id, updates) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ id }, ['id']);

            const category = await PromiseCategoryDao.findById(id);
            if (!category) {
                throw NOT_FOUND('承诺分类不存在');
            }

            // If updating name, check for duplicates
            if (updates.name && updates.name !== category.name) {
                const existingCategory = await PromiseCategoryDao.findByName(
                    updates.name,
                );
                if (existingCategory) {
                    throw BAD_REQUEST('承诺分类名称已存在');
                }
            }

            return await PromiseCategoryDao.update(id, updates);
        }, 'Update promise category failed');
    }

    /**
     * Delete promise category
     * @param {number} id - Category ID
     * @returns {boolean} Delete result
     */
    async deletePromiseCategory(id) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ id }, ['id']);

            const category = await PromiseCategoryDao.findById(id);
            if (!category) {
                throw NOT_FOUND('承诺分类不存在');
            }

            // Check if there are promises using this category
            const promisesCount = await PromiseDao.countByCategory(id);
            if (promisesCount > 0) {
                throw BAD_REQUEST('该分类下还有承诺，无法删除');
            }

            return await PromiseCategoryDao.delete(id);
        }, 'Delete promise category failed');
    }

    /**
     * Get promise category list
     * @param {Object} params - Query parameters
     * @returns {Object} Category list
     */
    async getPromiseCategoryList({ pageNum = 1, pageSize = 10 }) {
        return await this.safeExecute(async () => {
            return await PromiseCategoryDao.query({ pageNum, pageSize });
        }, 'Get promise category list failed');
    }

    /**
     * Get promise category by ID
     * @param {number} id - Category ID
     * @returns {Object} Category info
     */
    async getPromiseCategoryById(id) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ id }, ['id']);
            return await PromiseCategoryDao.findById(id);
        }, 'Get promise category by id failed');
    }
}

// Export singleton instance
export const promiseService = new PromiseService();
export default PromiseService;
