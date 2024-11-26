import { ActivityDao } from '@dao/lucky-number/activity';
import { NumberPoolDao } from '@dao/lucky-number/number-pool';
import { UserParticipationDao } from '@dao/lucky-number/user-participation';
import {
    createEventMiddleware,
    editEventMiddleware,
    watchEventMiddleware,
} from '@middlewares/auths/permission';
import {
    cancelParticipatedLuckyNumberValidatorMiddleware,
    createLuckyNumberValidatorMiddleware,
    deleteLuckyNumberValidatorMiddleware,
    queryLuckyNumberValidatorMiddleware,
} from '@middlewares/validators/lucky-number';
import { sequelize } from '@services/db';
import { BAD_REQUEST } from '@utils/http-errors';
import log from '@utils/log';
import httpStatus from 'http-status';

import router from './router';

router.post(
    '/lucky-number/create',
    createEventMiddleware,
    createLuckyNumberValidatorMiddleware,
    async ctx => {
        const { key, name, description, numbers } = ctx.request.body;

        const transaction = await sequelize.transaction();
        const activity = await ActivityDao.create(
            { key, name, description },
            transaction,
        );
        const numberPoolEntries = numbers.map(number => ({
            activity_id: activity.id,
            drawn_number: number,
        }));
        await NumberPoolDao.createNumberPoolEntries(
            numberPoolEntries,
            transaction,
        );

        await transaction.commit();

        ctx.response.status = httpStatus.CREATED;
        ctx.body = {
            message: '活动创建成功',
        };
    },
);

router.get(
    '/lucky-number/query/:key',
    watchEventMiddleware,
    queryLuckyNumberValidatorMiddleware,
    async ctx => {
        const { key } = ctx.params;

        const activity = await ActivityDao.search({ key });
        if (!activity) {
            throw BAD_REQUEST('活动不存在');
        }

        const numberPool = await NumberPoolDao.findNumbersWithUserByActivity(
            activity.id,
        );

        ctx.response.status = httpStatus.OK;
        ctx.body = {
            id: activity.id,
            name: activity.name,
            activity_key: activity.key,
            description: activity.description,
            numbers: numberPool.map(entry => ({
                id: entry.id,
                drawn_number: entry.drawn_number,
                is_drawn: entry.is_drawn,
                user_name: entry.lucky_number_user_participation
                    ? entry.lucky_number_user_participation.user_name
                    : null,
            })),
        };
    },
);

router.delete(
    '/lucky-number/delete/:key',
    editEventMiddleware,
    deleteLuckyNumberValidatorMiddleware,
    async ctx => {
        const { key } = ctx.params;
        await ActivityDao.delete({ key });
        ctx.response.status = httpStatus.OK;
        ctx.body = {
            message: '活动删除成功',
        };
    },
);

router.put(
    '/lucky-number/cancel-participation',
    editEventMiddleware,
    cancelParticipatedLuckyNumberValidatorMiddleware,
    async ctx => {
        const { key, drawn_number, user_name } = ctx.request.body;

        const transaction = await sequelize.transaction();

        try {
            const activity = await ActivityDao.search({ key });
            if (!activity) {
                throw BAD_REQUEST('活动不存在');
            }

            const participation = await UserParticipationDao.findParticipation({
                activity_id: activity.id,
                drawn_number: `${drawn_number}`,
                user_name,
            });

            if (!participation || participation.drawn_number !== drawn_number) {
                throw BAD_REQUEST('无效的参与记录或号码不匹配');
            }

            await NumberPoolDao.unmarkNumberAsDrawn(drawn_number, transaction);
            await UserParticipationDao.deleteParticipation(
                participation.id,
                transaction,
            );

            await transaction.commit();

            ctx.response.status = httpStatus.OK;
            ctx.body = { message: '抽取结果已取消' };
        } catch (error) {
            log.error(error);
            await transaction.rollback();
            throw error;
        }
    },
);

router.get('/lucky-number/list', watchEventMiddleware, async ctx => {
    const { page_num = 1, page_size = 10 } = ctx.query;

    const result = await ActivityDao.query({
        page_num: parseInt(page_num, 10),
        page_size: parseInt(page_size, 10),
    });
    ctx.response.status = httpStatus.OK;
    ctx.set('x-pagination', JSON.stringify(result.page));
    ctx.body = result.data;
});

export default router;
