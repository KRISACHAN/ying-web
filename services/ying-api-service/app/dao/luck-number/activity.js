import { ActivityModel } from '@models/luck-number/activity';

export class ActivityDao {
    static async createActivity(key) {
        return await ActivityModel.create({ key });
    }

    static async findActivityByKey(key) {
        return await ActivityModel.findOne({ where: { key } });
    }
}
