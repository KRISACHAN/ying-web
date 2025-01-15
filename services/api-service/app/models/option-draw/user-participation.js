import { sequelize } from '@services/db';
import { DataTypes, Model } from 'sequelize';

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
                model: 'option_draw_activity',
                key: 'id',
            },
        },
        username: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        drawn_option: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'option_draw_user_participation',
        tableName: 'option_draw_user_participation',
        deletedAt: 'deleted_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        timestamps: true,
        paranoid: true,
    },
);
