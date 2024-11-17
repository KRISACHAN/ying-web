import Router from 'koa-router';
import fs from 'fs';
import path from 'path';
import { getRandomInt } from '@utils/helpers';
import { NOT_FOUND } from '@utils/http-errors';

const router = new Router({
    prefix: '/api/v1/promise',
});

router.get('/result', async ctx => {
    try {
        const directoryPath = path.resolve(
            __dirname,
            '..',
            '..',
            'constants',
            'promises',
        );
        const files = fs.readdirSync(directoryPath);

        if (files.length === 0) {
            throw NOT_FOUND('No promise files found');
        }

        const randomFileIndex = getRandomInt(0, files.length - 1);
        const randomFile = files[randomFileIndex];

        const filePath = path.join(directoryPath, randomFile);
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content)
            .filter(item => !!item)
            .map(item => item.trim());

        if (data.length === 0) {
            throw NOT_FOUND('No data found in the selected file');
        }

        const dataIndex = getRandomInt(0, data.length - 1);
        ctx.body = data[dataIndex];
    } catch (error) {
        ctx.status = error.status || 500;
        ctx.body = { message: error.message || 'Internal Server Error' };
    }
});

export default router;
