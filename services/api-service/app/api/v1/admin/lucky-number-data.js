import {
    editEventMiddleware,
    watchEventMiddleware,
} from '@middlewares/auths/permission';
import { luckyNumberKeyValidatorMiddleware } from '@middlewares/validators/lucky-number';
import {
    commitNumberData,
    previewNumberData,
    readParticipationData,
    updateParticipationData,
} from '@services/lucky-number/number-data.service';
import { exportNumberData } from '@services/lucky-number/number-data-export';
import {
    limitNumberDataImports,
    readNumberDataUpload,
} from '@services/lucky-number/number-data-upload';
import {
    FORBIDDEN,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    REQUEST_ENTITY_TOO_LARGE,
    UNPROCESSABLE_ENTITY,
} from '@utils/http-errors';
import log from '@utils/log';
import createError from 'http-errors';
import bodyParser from 'koa-body';

import router from './router';

const path = '/lucky-number/:key';
const participationData = `${path}/participations/:id/number-data`;

const numberDataResponse = async (ctx, next) => {
    ctx.set('Cache-Control', 'no-store');
    try {
        await next();
    } catch (error) {
        const known = createError.isHttpError(error);
        const failure = known
            ? error
            : INTERNAL_SERVER_ERROR('号码资料操作失败');
        log.warn({
            action: 'lucky-number-data',
            method: ctx.method,
            uid: ctx.state.adminUid,
            key: ctx.params.key,
            status: failure.status,
            error: error.name,
        });
        ctx.status = failure.status;
        ctx.body = {
            message: failure.message,
            errors: failure.errors,
            sheets: failure.sheets,
            headers: failure.headers,
        };
    }
};

const requireAdminId = async (ctx, next) => {
    const uid = ctx.state.adminUid;
    if (!Number.isInteger(uid) || uid < 1 || uid > 2147483647) {
        throw FORBIDDEN('管理员身份无效');
    }
    await next();
};

const participationId = async (ctx, next) => {
    const id = Number(ctx.params.id);
    if (!/^\d+$/.test(ctx.params.id) || id < 1 || id > 2147483647) {
        throw NOT_FOUND('参与记录不存在或已取消');
    }
    ctx.state.participationId = id;
    await next();
};

const parseJson = bodyParser({
    jsonLimit: '768kb',
    onError: error => {
        if (error.status === 413)
            throw REQUEST_ENTITY_TOO_LARGE('资料超过大小限制');
        throw UNPROCESSABLE_ENTITY('资料必须使用 JSON 格式');
    },
});

for (const [step, operation] of [
    ['preview', previewNumberData],
    ['commit', commitNumberData],
]) {
    router.post(
        `${path}/number-data/import/${step}`,
        numberDataResponse,
        editEventMiddleware,
        requireAdminId,
        luckyNumberKeyValidatorMiddleware,
        limitNumberDataImports,
        async ctx => {
            const upload = await readNumberDataUpload(ctx);
            const result = await operation(
                ctx.params.key,
                upload,
                ctx.state.adminUid,
            );
            if (result.counts) {
                log.info({
                    action: `lucky-number-data-${step}`,
                    uid: ctx.state.adminUid,
                    key: ctx.params.key,
                    counts: result.counts,
                    written: result.written,
                });
            }
            ctx.body = result;
        },
    );
}

router.get(
    `${path}/participations/export`,
    numberDataResponse,
    watchEventMiddleware,
    luckyNumberKeyValidatorMiddleware,
    async ctx => {
        const csv = await exportNumberData(ctx.params.key, ctx.state.adminUid);
        if (!csv) {
            ctx.status = 204;
            return;
        }
        ctx.attachment('lucky-number.csv');
        ctx.type = 'text/csv; charset=utf-8';
        ctx.body = csv;
    },
);

router.get(
    participationData,
    numberDataResponse,
    watchEventMiddleware,
    luckyNumberKeyValidatorMiddleware,
    participationId,
    async ctx => {
        ctx.body = await readParticipationData(
            ctx.params.key,
            ctx.state.participationId,
        );
    },
);

router.put(
    participationData,
    numberDataResponse,
    editEventMiddleware,
    requireAdminId,
    luckyNumberKeyValidatorMiddleware,
    participationId,
    parseJson,
    async ctx => {
        ctx.body = await updateParticipationData(
            ctx.params.key,
            ctx.state.participationId,
            ctx.state.adminUid,
            ctx.request.body,
        );
        log.info({
            action: 'lucky-number-data-edit',
            uid: ctx.state.adminUid,
            key: ctx.params.key,
            version: ctx.body.version,
        });
    },
);
