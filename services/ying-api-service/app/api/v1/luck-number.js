import Router from 'koa-router';
import httpStatus from 'http-status';
import { ActivityDao } from '@dao/luck-number/activity';
import { NumberPoolDao } from '@dao/luck-number/number-pool';
import { UserParticipationDao } from '@dao/luck-number/user-participation';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '@utils/http-errors';
import { getUserIP } from '@utils/helpers';
import { sequelize } from '@utils/db';
import log from '@utils/log';

const router = new Router({
    prefix: '/api/v1/luck-number',
});

router.post('/create', async ctx => {
    const { key, numbers } = ctx.request.body;
    if (!key || !Array.isArray(numbers)) {
        throw BAD_REQUEST('活动 key 和号码池数据是必需的');
    }

    try {
        const activity = await ActivityDao.createActivity(key);
        const numberPoolEntries = numbers.map(number => ({
            activity_id: activity.id,
            number,
        }));
        await NumberPoolDao.createNumberPoolEntries(numberPoolEntries);

        ctx.response.status = httpStatus.CREATED;
        ctx.body = { message: '活动创建成功' };
    } catch (error) {
        log.error('Error creating activity:', error);
        throw INTERNAL_SERVER_ERROR(error.message);
    }
});

router.post('/draw', async ctx => {
    const { key, userName } = ctx.request.body;
    const ipAddress = getUserIP(ctx);

    if (!key || !userName) {
        throw BAD_REQUEST('活动 key 和用户信息是必需的');
    }

    const transaction = await sequelize.transaction();
    try {
        const activity = await ActivityDao.findActivityByKey(key);
        if (!activity) {
            throw BAD_REQUEST('活动不存在');
        }

        const existingParticipation =
            await UserParticipationDao.findParticipation(
                activity.id,
                userName,
                ipAddress,
            );

        if (existingParticipation) {
            throw BAD_REQUEST('用户已参与过此活动');
        }

        const numberEntry = await NumberPoolDao.findAvailableNumber(
            activity.id,
            { transaction },
        );
        if (!numberEntry) {
            throw BAD_REQUEST('号码池已空');
        }

        await NumberPoolDao.markNumberAsDrawn(numberEntry, { transaction });

        await UserParticipationDao.createUserParticipation(
            {
                activity_id: activity.id,
                user_name: userName,
                ip_address: ipAddress,
                drawn_number: numberEntry.number,
            },
            { transaction },
        );

        await transaction.commit();

        ctx.response.status = httpStatus.OK;
        ctx.body = { drawnNumber: numberEntry.number };
    } catch (error) {
        await transaction.rollback();
        log.error('Error during number draw:', error);
        throw INTERNAL_SERVER_ERROR(error.message);
    }
});

router.get('/query/:key', async ctx => {
    const { key } = ctx.params;

    try {
        const activity = await ActivityDao.findActivityByKey(key);
        if (!activity) {
            throw BAD_REQUEST('活动不存在');
        }

        const numberPool = await NumberPoolDao.findNumbersWithUserByActivity(
            activity.id,
        );

        ctx.response.status = httpStatus.OK;
        ctx.body = {
            activityKey: activity.key,
            numbers: numberPool.map(entry => ({
                number: entry.number,
                isDrawn: entry.is_drawn,
                drawnBy: entry.user_participation
                    ? entry.user_participation.user_name
                    : null,
            })),
        };
    } catch (error) {
        log.error('Error querying activity:', error);
        throw INTERNAL_SERVER_ERROR(error.message);
    }
});

export default router;
