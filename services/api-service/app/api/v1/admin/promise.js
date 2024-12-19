import { PromiseDao } from '@dao/promise/promise';
import { PromiseCategoryDao } from '@dao/promise/promise-category';
import {
    createPromiseCategoryMiddleware,
    createPromiseMiddleware,
    editPromiseCategoryMiddleware,
    editPromiseMiddleware,
    watchPromiseCategoryMiddleware,
    watchPromiseMiddleware,
} from '@middlewares/auths/permission';
import {
    createPromiseCategoryValidator,
    createPromiseValidator,
    getPromiseCategoryDetailValidator,
    getPromiseCategoryListValidator,
    getPromiseDetailValidator,
    getPromiseListValidator,
    updatePromiseCategoryValidator,
    updatePromiseValidator,
} from '@middlewares/validators/promise';
import { getResourceType } from '@utils/helpers';
import { BAD_REQUEST } from '@utils/http-errors';
import httpStatus from 'http-status';
import { isUndefined } from 'lodash';
import router from './router';

router.post(
    '/promise/category',
    createPromiseCategoryMiddleware,
    createPromiseCategoryValidator,
    async ctx => {
        const { name, description, is_published = false } = ctx.request.body;
        await PromiseCategoryDao.create({ name, description, is_published });
        ctx.response.status = httpStatus.CREATED;
        ctx.body = { message: '分类创建成功' };
    },
);

router.get(
    '/promise/category/list',
    watchPromiseCategoryMiddleware,
    getPromiseCategoryListValidator,
    async ctx => {
        const {
            page_num = 1,
            page_size = 10,
            name,
            description,
            is_published,
            order = 'DESC',
        } = ctx.query;

        const params = {
            page_num: parseInt(page_num, 10),
            page_size: parseInt(page_size, 10),
            name,
            description,
            order: order.toUpperCase(),
        };

        if (!isUndefined(is_published)) {
            params.is_published = is_published === 'true';
        }

        const result = await PromiseCategoryDao.query(params);

        ctx.response.status = httpStatus.OK;
        ctx.set('x-pagination', JSON.stringify(result.pagination));
        ctx.body = result.data;
    },
);

router.get(
    '/promise/category/:id',
    watchPromiseCategoryMiddleware,
    getPromiseCategoryDetailValidator,
    async ctx => {
        const { id } = ctx.params;
        const category = await PromiseCategoryDao.search(id);
        ctx.response.status = httpStatus.OK;
        ctx.body = category;
    },
);

router.put(
    '/promise/category/:id',
    editPromiseCategoryMiddleware,
    getPromiseCategoryDetailValidator,
    updatePromiseCategoryValidator,
    async ctx => {
        const { id } = ctx.params;
        const { name, description, is_published } = ctx.request.body;
        await PromiseCategoryDao.update(id, {
            name,
            description,
            is_published,
        });
        ctx.response.status = httpStatus.OK;
        ctx.body = { message: '分类更新成功' };
    },
);

router.delete(
    '/promise/category/:id',
    editPromiseCategoryMiddleware,
    getPromiseCategoryDetailValidator,
    async ctx => {
        const { id } = ctx.params;
        await PromiseCategoryDao.delete(id);
        ctx.response.status = httpStatus.OK;
        ctx.body = { message: '分类删除成功' };
    },
);

router.post(
    '/promise/create',
    createPromiseMiddleware,
    createPromiseValidator,
    async ctx => {
        const {
            category_id,
            chapter,
            text,
            description,
            resource_url,
            is_published = false,
        } = ctx.request.body;

        const resource_type = getResourceType(resource_url);

        if (resource_url && !resource_type) {
            throw BAD_REQUEST('资源类型不支持');
        }

        await PromiseDao.create({
            category_id,
            chapter,
            text,
            description,
            resource_type,
            resource_url,
            is_published,
        });

        ctx.response.status = httpStatus.CREATED;
        ctx.body = { message: '经文创建成功' };
    },
);

router.get(
    '/promise/list',
    watchPromiseMiddleware,
    getPromiseListValidator,
    async ctx => {
        const {
            page_num = 1,
            page_size = 10,
            category_id,
            category_name,
            chapter,
            text,
            description,
            is_published,
            order = 'DESC',
        } = ctx.query;

        const params = {
            page_num: parseInt(page_num, 10),
            page_size: parseInt(page_size, 10),
            category_id: category_id ? parseInt(category_id, 10) : undefined,
            category_name,
            chapter,
            text,
            description,
            order: order.toUpperCase(),
        };

        if (!isUndefined(is_published)) {
            params.is_published = is_published === 'true';
        }

        const result = await PromiseDao.query(params);

        ctx.response.status = httpStatus.OK;
        ctx.set('x-pagination', JSON.stringify(result.pagination));
        ctx.body = result.data;
    },
);

router.get(
    '/promise/:id',
    watchPromiseMiddleware,
    getPromiseDetailValidator,
    async ctx => {
        const { id } = ctx.params;
        const { is_published } = ctx.query;

        const promise = await PromiseDao.search(id, {
            is_published: is_published ? is_published === 'true' : undefined,
        });
        ctx.response.status = httpStatus.OK;
        ctx.body = promise;
    },
);

router.put(
    '/promise/:id',
    editPromiseMiddleware,
    updatePromiseValidator,
    async ctx => {
        const { id } = ctx.params;
        const {
            category_id,
            chapter,
            text,
            description,
            resource_url,
            is_published,
        } = ctx.request.body;

        const updateData = {
            category_id,
            chapter,
            text,
            description,
            is_published,
        };

        if (resource_url) {
            updateData.resource_url = resource_url;
            updateData.resource_type = getResourceType(resource_url);
        }

        await PromiseDao.update(id, updateData);

        ctx.response.status = httpStatus.OK;
        ctx.body = { message: '经文更新成功' };
    },
);

router.delete(
    '/promise/:id',
    editPromiseMiddleware,
    getPromiseDetailValidator,
    async ctx => {
        const { id } = ctx.params;
        await PromiseDao.delete(id);
        ctx.response.status = httpStatus.OK;
        ctx.body = { message: '经文删除成功' };
    },
);

export default router;
