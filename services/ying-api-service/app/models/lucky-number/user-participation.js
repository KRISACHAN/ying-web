import { sequelize } from '@services/db';
import { Model, DataTypes } from 'sequelize';
import { ActivityModel } from './activity';
import { NumberPoolModel } from './number-pool';

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
        },
        user_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true, // Make user_name unique across the table
        },
        drawn_number: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: NumberPoolModel,
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'lucky_number_user_participation',
        tableName: 'lucky_number_user_participation',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['user_name'],
            },
        ],
    },
);
