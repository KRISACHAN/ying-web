import { sequelize } from '@services/db';
import { DataTypes, Model } from 'sequelize';

export class RolePermissionsModel extends Model {}

RolePermissionsModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        permission_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'role_permissions',
        tableName: 'role_permissions',
        deletedAt: 'deleted_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                unique: true,
                fields: ['role_id', 'permission_id', 'deleted_at'],
            },
        ],
    },
);
