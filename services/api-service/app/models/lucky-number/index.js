import { ActivityModel } from './activity';
import { NumberPoolModel } from './number-pool';
import { UserParticipationModel } from './user-participation';

ActivityModel.hasMany(NumberPoolModel, {
    foreignKey: 'activity_id',
    as: 'number_pool',
});

NumberPoolModel.belongsTo(ActivityModel, {
    foreignKey: 'activity_id',
});

ActivityModel.hasMany(UserParticipationModel, {
    foreignKey: 'activity_id',
    as: 'participations',
});

UserParticipationModel.belongsTo(ActivityModel, {
    foreignKey: 'activity_id',
});

export { ActivityModel, NumberPoolModel, UserParticipationModel };
