import { sequelize } from '@services/db';
import { DataTypes, Model } from 'sequelize';

export class AdminRoleModel extends Model {}

AdminRoleModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        admin_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'admin_role',
        tableName: 'admin_role',
        timestamps: true,
        deletedAt: 'deleted_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['admin_id', 'role_id'],
            },
        ],
    },
);
