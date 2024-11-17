import { ActivityModel } from '@models/luck-number/activity';
import { INTERNAL_SERVER_ERROR } from '@utils/http-errors';

export class ActivityDao {
    static async createActivity(key) {
        try {
            const res = await ActivityModel.create({ key });
            return res;
        } catch {
            throw INTERNAL_SERVER_ERROR('创建活动失败');
        }
    }

    static async findActivityByKey(key) {
        try {
            const res = await ActivityModel.findOne({ where: { key } });
            return res;
        } catch {
            throw INTERNAL_SERVER_ERROR('查询活动失败');
        }
    }
}
