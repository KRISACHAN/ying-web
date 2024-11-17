# Basic Backend Management System: MySQL RBAC Design

## Table Design

This RBAC (Role-Based Access Control) system is designed to manage user permissions efficiently. It consists of several key tables: the `admin` table for user information, the `role` table for role definitions, the `permissions` table for available system permissions, the `role_permissions` table to associate roles with permissions, and the `admin_role` table to associate users with roles. This structure allows the system to determine user permissions based on their roles, ensuring secure and flexible access control.

### Admin Table

| Column Name | Type         | Description                           |
| ----------- | ------------ | ------------------------------------- |
| id          | int(11)      | Primary key, auto-increment           |
| username    | varchar(255) | Unique username                       |
| password    | varchar(255) | User password                         |
| email       | varchar(255) | Unique email address                  |
| status      | tinyint(1)   | User status (0: disabled, 1: enabled) |
| created_at  | datetime     | Record creation timestamp             |
| updated_at  | datetime     | Record update timestamp               |

### Role Table

| Column Name | Type         | Description                 |
| ----------- | ------------ | --------------------------- |
| id          | int(11)      | Primary key, auto-increment |
| name        | varchar(255) | Unique role name            |
| description | text         | Role description            |
| created_at  | datetime     | Record creation timestamp   |
| updated_at  | datetime     | Record update timestamp     |

### Permissions Table

| Column Name | Type         | Description                 |
| ----------- | ------------ | --------------------------- |
| id          | int(11)      | Primary key, auto-increment |
| name        | varchar(255) | Unique permission name      |
| description | text         | Permission description      |
| created_at  | datetime     | Record creation timestamp   |
| updated_at  | datetime     | Record update timestamp     |

### Role-Permissions Association Table

| Column Name   | Type     | Description                        |
| ------------- | -------- | ---------------------------------- |
| id            | int(11)  | Primary key, auto-increment        |
| role_id       | int(11)  | Role ID, unique with permission_id |
| permission_id | int(11)  | Permission ID, unique with role_id |
| created_at    | datetime | Record creation timestamp          |
| updated_at    | datetime | Record update timestamp            |

### Admin-Role Association Table

| Column Name | Type     | Description                   |
| ----------- | -------- | ----------------------------- |
| id          | int(11)  | Primary key, auto-increment   |
| admin_id    | int(11)  | User ID, unique with role_id  |
| role_id     | int(11)  | Role ID, unique with admin_id |
| created_at  | datetime | Record creation timestamp     |
| updated_at  | datetime | Record update timestamp       |

## Purpose and Benefits

The RBAC system is designed to provide a structured and scalable way to manage user permissions. By associating users with roles and roles with permissions, the system can efficiently determine what actions a user is allowed to perform. This design offers several benefits:

-   **Scalability**: Easily add new roles and permissions without affecting existing users.
-   **Security**: Ensure that users only have access to the resources they are authorized to use.
-   **Flexibility**: Assign multiple roles to users, allowing for complex permission structures.
-   **Maintainability**: Simplify permission management by grouping permissions into roles.

This RBAC model is ideal for applications where user access needs to be controlled and audited, such as enterprise software, content management systems, and any application with sensitive data.
