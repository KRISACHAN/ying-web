import { AdminModel } from './admin';
import { AdminRoleModel } from './admin-role';
import { PermissionsModel } from './permissions';
import { RoleModel } from './role';
import { RolePermissionsModel } from './role-permissions';

// Basic associations
AdminRoleModel.belongsTo(AdminModel, {
    foreignKey: 'admin_id',
    targetKey: 'id',
});

AdminRoleModel.belongsTo(RoleModel, {
    foreignKey: 'role_id',
    targetKey: 'id',
});

RolePermissionsModel.belongsTo(RoleModel, {
    foreignKey: 'role_id',
    targetKey: 'id',
});

RolePermissionsModel.belongsTo(PermissionsModel, {
    foreignKey: 'permission_id',
    targetKey: 'id',
});

// hasMany associations (using unique aliases)
AdminModel.hasMany(AdminRoleModel, {
    foreignKey: 'admin_id',
    targetKey: 'id',
    as: 'AdminRoles',
});

RoleModel.hasMany(AdminRoleModel, {
    foreignKey: 'role_id',
    targetKey: 'id',
    as: 'RoleAdmins',
});

RoleModel.hasMany(RolePermissionsModel, {
    foreignKey: 'role_id',
    targetKey: 'id',
    as: 'RolePermissions',
});

PermissionsModel.hasMany(RolePermissionsModel, {
    foreignKey: 'permission_id',
    targetKey: 'id',
    as: 'PermissionRoles',
});

// belongsToMany associations (for optimized queries)
AdminModel.belongsToMany(RoleModel, {
    through: AdminRoleModel,
    foreignKey: 'admin_id',
    otherKey: 'role_id',
    as: 'Roles',
});

RoleModel.belongsToMany(AdminModel, {
    through: AdminRoleModel,
    foreignKey: 'role_id',
    otherKey: 'admin_id',
    as: 'Admins',
});

RoleModel.belongsToMany(PermissionsModel, {
    through: RolePermissionsModel,
    foreignKey: 'role_id',
    otherKey: 'permission_id',
    as: 'Permissions',
});

PermissionsModel.belongsToMany(RoleModel, {
    through: RolePermissionsModel,
    foreignKey: 'permission_id',
    otherKey: 'role_id',
    as: 'Roles',
});

export {
    AdminModel,
    AdminRoleModel,
    PermissionsModel,
    RoleModel,
    RolePermissionsModel,
};
