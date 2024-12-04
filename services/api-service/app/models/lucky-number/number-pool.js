import { sequelize } from '@services/db';
import { DataTypes, Model } from 'sequelize';

import { ActivityModel } from './activity';

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
        drawn_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'lucky_number_pool',
        tableName: 'lucky_number_pool',
        timestamps: true,
        deletedAt: 'deleted_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['activity_id', 'drawn_number'],
                name: 'unique_activity_number',
            },
        ],
    },
);
