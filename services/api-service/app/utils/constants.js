import { eq } from 'lodash';

export const adminMap = Object.freeze({
    ADMIN: 'admin',
    MEMBER: 'member',
});

export const isAdmin = role => eq(role, adminMap.ADMIN);

export const isMember = role => eq(role, adminMap.MEMBER);

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
