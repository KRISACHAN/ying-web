export const permissionMap = Object.freeze({
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
});

export const LUCKY_NUMBER_STATUS = Object.freeze({
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
    JWT_TOKEN_EXPIRED_ERROR: 'TokenExpiredError',
});
