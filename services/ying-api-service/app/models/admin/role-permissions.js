import { sequelize } from '@utils/db';
import { Model, DataTypes } from 'sequelize';
import { RoleModel } from './role';
import { PermissionsModel } from './permissions';

// 定义角色权限模型
export class RolePermissionsModel extends Model {}

// 初始角色权限模型
RolePermissionsModel.init(
    {
        id: {
            type: DataTypes.INTEGER, // 数据类型为整型
            allowNull: false, // 不允许为空
            primaryKey: true, // 设置为主键
            autoIncrement: true, // 自增
        },
        role_id: {
            type: DataTypes.INTEGER, // 数据类型为整型
            allowNull: false, // 不允许为空
        },
        permission_id: {
            type: DataTypes.INTEGER, // 数据类型为整型
            allowNull: false, // 不允许为空
        },
    },
    {
        sequelize,
        modelName: 'role_permissions',
        tableName: 'role_permissions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['role_id', 'permission_id'], // 增加唯一性约束
            },
        ],
    },
);

/**
 * 关系概述:
 *  RolePermissionsModel 连接 RoleModel 和 PermissionsModel，表示角色与权限之间的多对多关系。
 *  每个角色可以有多个权限，每个权限也可以被多个角色拥有。
 *
 * 外键:
 *  role_id 在 RolePermissionsModel 中指向 RoleModel 的 id。
 *  permission_id 在 RolePermissionsModel 中指向 PermissionsModel 的 id。
 */

/**
 * 这表示 RolePermissionsModel（角色权限模型）属于 RoleModel（角色模型）。
 * 通过 foreignKey: 'role_id' 指定在 RolePermissionsModel 中使用 role_id 字段作为外键，指向 RoleModel 的主键 id。
 * 这意味着每个 RolePermissionsModel 实例都与一个 RoleModel 实例相关联，表示某个角色具有某些权限
 */
RolePermissionsModel.belongsTo(RoleModel, {
    foreignKey: 'role_id',
    targetKey: 'id',
});
/**
 * 这表示 RoleModel 可以有多个 RolePermissionsModel 实例。
 * 通过 foreignKey: 'role_id' 指定在 RolePermissionsModel 中使用 role_id 字段作为外键。
 * 这意味着一个角色可以拥有多个权限。
 */
RoleModel.hasMany(RolePermissionsModel, {
    foreignKey: 'role_id',
    targetKey: 'id',
});

/**
 * 这表示 RolePermissionsModel 属于 PermissionsModel（权限模型）。
 * 通过 foreignKey: 'permission_id' 指定在 RolePermissionsModel 中使用 permission_id 字段作为外键，指向 PermissionsModel 的主键 id。
 * 这意味着每个 RolePermissionsModel 实例都与一个 PermissionsModel 实例相关联，表示某个权限被某个角色所拥有。
 */
RolePermissionsModel.belongsTo(PermissionsModel, {
    foreignKey: 'permission_id',
    targetKey: 'id',
});
/**
 * 这表示 PermissionsModel 可以有多个 RolePermissionsModel 实例。
 * 通过 foreignKey: 'permission_id' 指定在 RolePermissionsModel 中使用 permission_id 字段作为外键。
 * 这意味着一个权限可以被多个角色所拥有。
 */
PermissionsModel.hasMany(RolePermissionsModel, {
    foreignKey: 'permission_id',
    targetKey: 'id',
});
