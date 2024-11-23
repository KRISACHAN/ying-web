import { getRandomInt } from '@utils/helpers';
import { NOT_FOUND } from '@utils/http-errors';
import fs from 'fs';
import Router from 'koa-router';
import path from 'path';

const router = new Router({
    prefix: '/api/v1/www/promise',
});

router.get('/result', async ctx => {
    const directoryPath = path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'constants',
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

    if (data.length === 0) {
        throw NOT_FOUND('没有找到对应的经文，请重新试试');
    }

    const dataIndex = getRandomInt(0, data.length - 1);
    ctx.body = data[dataIndex];
});

export default router;
