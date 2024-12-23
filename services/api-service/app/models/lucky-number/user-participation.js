import { sequelize } from '@services/db';
import { DataTypes, Model } from 'sequelize';

import { ActivityModel } from './activity';

export class UserParticipationModel extends Model {}

UserParticipationModel.init(
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
            onDelete: 'CASCADE',
        },
        username: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        drawn_number: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'lucky_number_user_participation',
        tableName: 'lucky_number_user_participation',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                unique: true,
                fields: ['activity_id', 'username', 'deleted_at'],
                name: 'unique_user_activity',
            },
        ],
    },
);
