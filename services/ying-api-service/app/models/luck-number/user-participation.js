import { sequelize } from '@utils/db';
import { Model, DataTypes } from 'sequelize';
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
        },
        user_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        ip_address: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        drawn_number: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'user_participation',
        tableName: 'user_participation',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['activity_id', 'user_name', 'ip_address'],
            },
        ],
    },
);
