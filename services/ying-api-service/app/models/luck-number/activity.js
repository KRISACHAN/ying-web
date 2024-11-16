import { sequelize } from '@utils/db';
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
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        modelName: 'activity',
        tableName: 'activity',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
);
