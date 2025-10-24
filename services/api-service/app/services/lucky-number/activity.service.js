import { ActivityDao } from '@dao/lucky-number/activity';
import { NumberPoolDao } from '@dao/lucky-number/number-pool';
import { UserParticipationDao } from '@dao/lucky-number/user-participation';
import { LUCKY_NUMBER_STATUS } from '@utils/constants';
import { BAD_REQUEST } from '@utils/http-errors';
import { BaseService } from '../base.service';

/**
 * Lucky number activity service
 * Handles lucky number activity related business logic
 */
export class LuckyNumberActivityService extends BaseService {
    constructor() {
        super(ActivityDao);
    }

    /**
     * Create lucky number activity
     * @param {Object} activityData - Activity data
     * @returns {Object} Created activity
     */
    async createActivity({
        key,
        name,
        description,
        numbers,
        participantLimit = 0,
    }) {
        return await this.executeInTransaction(async transaction => {
            this.validateRequiredParams({ key, name, description, numbers }, [
                'key',
                'name',
                'description',
                'numbers',
            ]);

            // Create activity
            const activity = await ActivityDao.create(
                {
                    key,
                    name,
                    description,
                    participant_limit: participantLimit,
                    status: LUCKY_NUMBER_STATUS.NOT_STARTED,
                },
                transaction,
            );

            // Create number pool
            const numberPoolEntries = numbers.map(number => ({
                activity_id: activity.id,
                drawn_number: number,
            }));
            await NumberPoolDao.create(numberPoolEntries, transaction);

            return activity;
        });
    }

    /**
     * Get activity info
     * @param {string} key - Activity key
     * @returns {Object} Activity info
     */
    async getActivityInfo(key) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ key }, ['key']);

            const activity = await ActivityDao.search({ key });
            if (!activity) {
                throw BAD_REQUEST('活动不存在');
            }

            const count = await NumberPoolDao.getCount(activity.id);

            return {
                id: activity.id,
                activity_key: activity.key,
                name: activity.name,
                description: activity.description,
                participant_limit: activity.participant_limit,
                status: activity.status,
                count,
            };
        }, 'Get activity info failed');
    }

    /**
     * Update activity status
     * @param {string} key - Activity key
     * @param {string} status - New status
     * @returns {Object} Updated activity
     */
    async updateActivityStatus(key, status) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ key, status }, ['key', 'status']);

            // Validate status value
            if (
                ![
                    LUCKY_NUMBER_STATUS.NOT_STARTED,
                    LUCKY_NUMBER_STATUS.ONGOING,
                    LUCKY_NUMBER_STATUS.ENDED,
                ].includes(status)
            ) {
                throw BAD_REQUEST('无效的活动状态');
            }

            return await ActivityDao.updateStatus({ key, status });
        }, 'Update activity status failed');
    }

    /**
     * Delete activity
     * @param {string} key - Activity key
     * @returns {boolean} Delete result
     */
    async deleteActivity(key) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ key }, ['key']);
            return await ActivityDao.delete({ key });
        }, 'Delete activity failed');
    }

    /**
     * Get activity list
     * @param {Object} params - Query parameters
     * @param {Object} ctx - Koa context (for caching)
     * @returns {Object} Activity list
     */
    async getActivityList({ pageNum = 1, pageSize = 10 }, ctx = null) {
        return await this.safeExecute(async () => {
            return await ActivityDao.query({ pageNum, pageSize }, ctx);
        }, 'Get activity list failed');
    }

    /**
     * Cancel user participation
     * @param {string} key - Activity key
     * @param {string} username - Username
     * @returns {Object} Cancellation result
     */
    async cancelParticipation(key, username) {
        return await this.executeInTransaction(async transaction => {
            this.validateRequiredParams({ key, username }, ['key', 'username']);

            const activity = await ActivityDao.search({ key });
            if (!activity) {
                throw BAD_REQUEST('活动不存在');
            }

            const participation = await UserParticipationDao.search({
                activity_id: activity.id,
                username,
            });

            if (!participation) {
                throw BAD_REQUEST('未找到参与记录');
            }

            const drawnNumber = participation.drawn_number;
            await UserParticipationDao.delete(participation.id, transaction);

            return {
                username,
                drawn_number: drawnNumber,
            };
        });
    }

    /**
     * Get activity participation records
     * @param {string} key - Activity key
     * @param {Object} params - Query parameters
     * @returns {Object} Participation records list
     */
    async getActivityParticipations(key, { pageNum = 1, pageSize = 10 }) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ key }, ['key']);

            const activity = await ActivityDao.search({ key });
            if (!activity) {
                throw BAD_REQUEST('活动不存在');
            }

            return await UserParticipationDao.query({
                pageNum: parseInt(pageNum, 10),
                pageSize: parseInt(pageSize, 10),
                activity_id: activity.id,
            });
        }, 'Get activity participations failed');
    }

    /**
     * Check if activity exists
     * @param {string} key - Activity key
     * @returns {boolean} Whether exists
     */
    async checkActivityExists(key) {
        return await this.safeExecute(async () => {
            this.validateRequiredParams({ key }, ['key']);
            const activity = await ActivityDao.search({ key });
            return !!activity;
        }, 'Check activity exists failed');
    }
}

// Export singleton instance
export const luckyNumberActivityService = new LuckyNumberActivityService();
export default LuckyNumberActivityService;
