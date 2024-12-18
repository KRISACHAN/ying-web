import { eq } from 'lodash';

export const ADMIN_MEMBER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
};

export const ADMIN_PERMISSIONS = Object.freeze({
    ALL_ACCESSES: 'all_accesses',
    OSS_UPLOAD: 'oss_upload',
    CREATE_ADMIN: 'create_admin',
    EDIT_ADMIN: 'edit_admin',
    DELETE_ADMIN: 'delete_admin',
    WATCH_ADMIN: 'watch_admin',
    CREATE_ROLE: 'create_role',
    EDIT_ROLE: 'edit_role',
    DELETE_ROLE: 'delete_role',
    WATCH_ROLE: 'watch_role',
    CREATE_PERMISSION: 'create_permission',
    EDIT_PERMISSION: 'edit_permission',
    DELETE_PERMISSION: 'delete_permission',
    WATCH_PERMISSION: 'watch_permission',
    CREATE_EVENT: 'create_event',
    EDIT_EVENT: 'edit_event',
    DELETE_EVENT: 'delete_event',
    WATCH_EVENT: 'watch_event',
    CREATE_PROMISE_CATEGORY: 'create_promise_category',
    EDIT_PROMISE_CATEGORY: 'edit_promise_category',
    DELETE_PROMISE_CATEGORY: 'delete_promise_category',
    WATCH_PROMISE_CATEGORY: 'watch_promise_category',
    CREATE_PROMISE: 'create_promise',
    EDIT_PROMISE: 'edit_promise',
    DELETE_PROMISE: 'delete_promise',
    WATCH_PROMISE: 'watch_promise',
});

export const LUCKY_NUMBER_STATUS = Object.freeze({
    NOT_FOUND: 'not_found',
    NOT_STARTED: 'not_started',
    ONGOING: 'ongoing',
    ENDED: 'ended',
});

export const ERROR_NAMES = Object.freeze({
    SEQUELIZE_UNIQUE_CONSTRAINT_ERROR: 'SequelizeUniqueConstraintError',
    SEQUELIZE_VALIDATION_ERROR: 'SequelizeValidationError',
    SEQUELIZE_FOREIGN_KEY_CONSTRAINT_ERROR:
        'SequelizeForeignKeyConstraintError',
    SEQUELIZE_CONNECTION_ERROR: 'SequelizeConnectionError',
    SEQUELIZE_TIMEOUT_ERROR: 'SequelizeTimeoutError',
    SEQUELIZE_TRANSACTION_ERROR: 'SequelizeTransactionError',
    SEQUELIZE_MIGRATION_ERROR: 'SequelizeMigrationsError',
    SEQUELIZE_DATA_TYPE_ERROR: 'SequelizeDataTypeError',
    SEQUELIZE_CONNECTION_NOT_ESTABLISHED_ERROR:
        'SequelizeConnectionNotEstablishedError',
    TOKEN_EXPIRED_ERROR: 'TokenExpiredError',
});

export const hasManageUsersPermission = permissionNames => {
    return !!permissionNames.find(
        ({ name }) =>
            eq(name, ADMIN_PERMISSIONS.ALL_ACCESSES) ||
            eq(name, ADMIN_PERMISSIONS.CREATE_ADMIN) ||
            eq(name, ADMIN_PERMISSIONS.EDIT_ADMIN) ||
            eq(name, ADMIN_PERMISSIONS.DELETE_ADMIN) ||
            eq(name, ADMIN_PERMISSIONS.WATCH_ADMIN),
    );
};
