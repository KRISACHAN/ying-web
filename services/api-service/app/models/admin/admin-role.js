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
            references: {
                model: 'admin',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'role',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        modelName: 'admin_role',
        tableName: 'admin_role',
        deletedAt: 'deleted_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                unique: true,
                fields: ['admin_id', 'role_id', 'deleted_at'],
            },
        ],
    },
);
