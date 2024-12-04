import { AdminModel } from './admin';
import { AdminRoleModel } from './admin-role';
import { PermissionsModel } from './permissions';
import { RoleModel } from './role';
import { RolePermissionsModel } from './role-permissions';

AdminRoleModel.belongsTo(AdminModel, {
    foreignKey: 'admin_id',
    targetKey: 'id',
});

AdminModel.hasMany(AdminRoleModel, { foreignKey: 'admin_id', targetKey: 'id' });

AdminRoleModel.belongsTo(RoleModel, { foreignKey: 'role_id', targetKey: 'id' });

RoleModel.hasMany(AdminRoleModel, { foreignKey: 'role_id', targetKey: 'id' });

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

export {
    AdminModel,
    AdminRoleModel,
    PermissionsModel,
    RoleModel,
    RolePermissionsModel,
};
