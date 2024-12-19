import { PromiseDao } from '@dao/promise/promise';
import { PromiseCategoryDao } from '@dao/promise/promise-category';
import { getRandomInt } from '@utils/helpers';
import { NOT_FOUND } from '@utils/http-errors';
import fs from 'fs';
import path from 'path';

import router from './router';

router.get('/promise/result', async ctx => {
    const directoryPath = path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'public',
        'promises',
    );
    const files = fs.readdirSync(directoryPath);

    if (files.length === 0) {
        throw NOT_FOUND('没有找到对应的经文，请重新试试');
    }

    const randomFileIndex = getRandomInt(0, files.length - 1);
    const randomFile = files[randomFileIndex];

    const filePath = path.join(directoryPath, randomFile);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content)
        .filter(item => !!item)
        .map(item => item.trim());

    ctx.body = data.length > 0 ? data[getRandomInt(0, data.length - 1)] : '';
});

router.get('/promise-category', async ctx => {
    const result = await PromiseCategoryDao.query({
        is_published: true,
        // Maybe we don't have too much categories
        // so we just return 100 categories
        page_size: 100,
    });
    ctx.body = result.data;
});

router.get('/promise/random/:category_id?', async ctx => {
    const { category_id } = ctx.params;

    const promise = await PromiseDao.random({
        category_id: category_id ? parseInt(category_id, 10) : undefined,
        is_published: true,
    });

    ctx.body = promise;
});

export default router;
