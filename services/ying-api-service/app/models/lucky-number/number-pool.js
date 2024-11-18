import { sequelize } from '@services/db';
import { Model, DataTypes } from 'sequelize';
import { ActivityModel } from './activity';
import { UserParticipationModel } from './user-participation';

export class NumberPoolModel extends Model {}

NumberPoolModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        activity_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: ActivityModel,
                key: 'id',
            },
        },
        number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        is_drawn: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: 'lucky_number_pool',
        tableName: 'lucky_number_pool',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['activity_id', 'number'],
            },
        ],
    },
);

NumberPoolModel.hasOne(UserParticipationModel, {
    foreignKey: 'drawn_number',
    sourceKey: 'id',
    as: 'lucky_number_user_participation',
});
