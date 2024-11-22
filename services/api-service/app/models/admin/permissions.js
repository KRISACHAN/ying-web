import { sequelize } from '@services/db';
import { DataTypes, Model } from 'sequelize';

export class PermissionsModel extends Model {}

PermissionsModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize,
        modelName: 'permissions',
        tableName: 'permissions',
        timestamps: true,
        deletedAt: 'deleted_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
);
