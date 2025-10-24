import { sequelize } from '@services/db';
import log from '@utils/log';

/**
 * Base service class
 * Provides common transaction management, error handling and other functionality
 */
export class BaseService {
    constructor(dao) {
        this.dao = dao;
    }

    /**
     * Execute operation within transaction
     * @param {Function} callback - Callback function to execute
     * @returns {*} Return value of callback function
     */
    async executeInTransaction(callback) {
        const transaction = await sequelize.transaction();
        try {
            const result = await callback(transaction);
            await transaction.commit();
            return result;
        } catch (error) {
            await transaction.rollback();
            this.handleError(error, 'Transaction execution failed');
            throw error;
        }
    }

    /**
     * Unified error handling
     * @param {Error} error - Error object
     * @param {string} context - Error context
     */
    handleError(error, context = 'Service operation failed') {
        log.error(`${context}:`, {
            message: error.message,
            stack: error.stack,
            name: error.name,
        });
    }

    /**
     * Validate required parameters
     * @param {Object} params - Parameter object
     * @param {Array} requiredFields - Required fields array
     * @throws {Error} If required parameters are missing
     */
    validateRequiredParams(params, requiredFields) {
        const missingFields = requiredFields.filter(
            field =>
                params[field] === undefined ||
                params[field] === null ||
                params[field] === '',
        );

        if (missingFields.length > 0) {
            throw new Error(
                `Missing required parameters: ${missingFields.join(', ')}`,
            );
        }
    }

    /**
     * Safely execute async operation
     * @param {Function} operation - Operation to execute
     * @param {string} context - Operation context
     * @returns {*} Operation result
     */
    async safeExecute(operation, context = 'Service operation') {
        try {
            return await operation();
        } catch (error) {
            this.handleError(error, context);
            throw error;
        }
    }
}
