import { sequelize } from '@services/db';
import { Model, DataTypes } from 'sequelize';
import { RoleModel } from './role';
import { PermissionsModel } from './permissions';

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
        timestamps: true,
        deletedAt: 'deleted_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['role_id', 'permission_id'],
            },
        ],
    },
);

RolePermissionsModel.belongsTo(RoleModel, {
    foreignKey: 'role_id',
    targetKey: 'id',
});

RoleModel.hasMany(RolePermissionsModel, {
    foreignKey: 'role_id',
    targetKey: 'id',
});

RolePermissionsModel.belongsTo(PermissionsModel, {
    foreignKey: 'permission_id',
    targetKey: 'id',
});

PermissionsModel.hasMany(RolePermissionsModel, {
    foreignKey: 'permission_id',
    targetKey: 'id',
});
