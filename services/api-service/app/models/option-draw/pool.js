import { sequelize } from '@services/db';
import { DataTypes, Model } from 'sequelize';

export class PoolModel extends Model {}

PoolModel.init(
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
        drawn_option: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'option_draw_pool',
        tableName: 'option_draw_pool',
        deletedAt: 'deleted_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        timestamps: true,
        paranoid: true,
    },
);
