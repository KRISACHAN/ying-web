import { sequelize } from '@services/db';
import { Model, DataTypes } from 'sequelize';

export class ActivityModel extends Model {}

ActivityModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        key: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'lucky_number_activity',
        tableName: 'lucky_number_activity',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
);
