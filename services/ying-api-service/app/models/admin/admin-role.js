import { sequelize } from '@utils/db';
import { Model, DataTypes } from 'sequelize';
import { RoleModel } from './role';
import { AdminModel } from './admin';

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

AdminRoleModel.belongsTo(AdminModel, {
    foreignKey: 'admin_id',
    targetKey: 'id',
});

AdminModel.hasMany(AdminRoleModel, { foreignKey: 'admin_id', targetKey: 'id' });

AdminRoleModel.belongsTo(RoleModel, { foreignKey: 'role_id', targetKey: 'id' });

RoleModel.hasMany(AdminRoleModel, { foreignKey: 'role_id', targetKey: 'id' });
