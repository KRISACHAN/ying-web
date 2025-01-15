import { ActivityModel } from './activity';
import { PoolModel } from './pool';
import { UserParticipationModel } from './user-participation';

ActivityModel.hasMany(PoolModel, {
    foreignKey: 'activity_id',
    as: 'options',
});

ActivityModel.hasMany(UserParticipationModel, {
    foreignKey: 'activity_id',
    as: 'participations',
});

PoolModel.belongsTo(ActivityModel, {
    foreignKey: 'activity_id',
    as: 'activity',
});

UserParticipationModel.belongsTo(ActivityModel, {
    foreignKey: 'activity_id',
    as: 'activity',
});

export { ActivityModel, PoolModel, UserParticipationModel };
