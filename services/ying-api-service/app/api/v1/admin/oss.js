import { ossService } from '@services/oss';
import adminAuthMiddleware from '@middlewares/admin/auth';
import { BAD_REQUEST } from '@utils/http-errors';
import router from './router';

router.post('/oss/upload', adminAuthMiddleware, async ctx => {
    const body = ctx.request.body;
    const { name, resource, tagging } = body;
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
    ctx.body = {
        data: res,
    };
});

export default router;
