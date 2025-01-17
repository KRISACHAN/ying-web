import { ossUploadMiddleware } from '@middlewares/auths/permission';
import { ossService } from '@services/oss';
import { BAD_REQUEST } from '@utils/http-errors';

import router from './router';

router.post('/oss/upload', ossUploadMiddleware, async ctx => {
    const { name, resource, tagging } = ctx.request.body;
    if (!name) {
        throw BAD_REQUEST('上传资源必须要有名字');
    }
    if (!resource) {
        throw BAD_REQUEST('不可上传空资源');
    }

    const headers = {
        'x-oss-storage-class': 'Standard',
    };
    if (tagging) {
        headers['x-oss-tagging'] = tagging;
    }

    const res = await ossService.upload({
        name,
        resource,
        headers,
    });

    ctx.body = res;
});

export default router;
