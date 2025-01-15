# 基础后台管理系统：MySQL RBAC 设计

## 表设计

这个 RBAC（基于角色的访问控制）系统旨在高效管理用户权限。它由几个关键表组成：用于存储用户信息的 `admin` 表、用于角色定义的 `role` 表、用于可用系统权限的 `permissions` 表、用于关联角色和权限的 `role_permissions` 表，以及用于关联用户和角色的 `admin_role` 表。这种结构使系统能够基于用户的角色确定其权限，确保安全且灵活的访问控制。

### 管理员表 (Admin)

| 列名       | 类型         | 描述                         |
| ---------- | ------------ | ---------------------------- |
| id         | INT          | 主键，自增                   |
| username   | varchar(255) | 唯一用户名                   |
| password   | varchar(255) | 用户密码                     |
| email      | varchar(255) | 唯一邮箱地址                 |
| status     | tinyint(1)   | 用户状态（0：禁用，1：启用） |
| created_at | datetime     | 记录创建时间戳               |
| updated_at | datetime     | 记录更新时间戳               |

### 角色表 (Role)

| 列名        | 类型         | 描述           |
| ----------- | ------------ | -------------- |
| id          | INT          | 主键，自增     |
| name        | varchar(255) | 唯一角色名称   |
| description | text         | 角色描述       |
| created_at  | datetime     | 记录创建时间戳 |
| updated_at  | datetime     | 记录更新时间戳 |

### 权限表 (Permissions)

| 列名        | 类型         | 描述           |
| ----------- | ------------ | -------------- |
| id          | INT          | 主键，自增     |
| name        | varchar(255) | 唯一权限名称   |
| description | text         | 权限描述       |
| created_at  | datetime     | 记录创建时间戳 |
| updated_at  | datetime     | 记录更新时间戳 |

### 角色-权限关联表 (Role-Permissions)

| 列名          | 类型     | 描述                     |
| ------------- | -------- | ------------------------ |
| id            | INT      | 主键，自增               |
| role_id       | INT      | 角色ID，与权限ID组合唯一 |
| permission_id | INT      | 权限ID，与角色ID组合唯一 |
| created_at    | datetime | 记录创建时间戳           |
| updated_at    | datetime | 记录更新时间戳           |

### 管理员-角色关联表 (Admin-Role)

| 列名       | 类型     | 描述                     |
| ---------- | -------- | ------------------------ |
| id         | INT      | 主键，自增               |
| admin_id   | INT      | 用户ID，与角色ID组合唯一 |
| role_id    | INT      | 角色ID，与用户ID组合唯一 |
| created_at | datetime | 记录创建时间戳           |
| updated_at | datetime | 记录更新时间戳           |

## 目的和优势

RBAC 系统旨在提供一种结构化且可扩展的方式来管理用户权限。通过将用户与角色关联，将角色与权限关联，系统可以高效地确定用户被允许执行的操作。这种设计提供了以下几个优势：

-   **可扩展性**：可以轻松添加新的角色和权限，而不影响现有用户。
-   **安全性**：确保用户只能访问他们被授权使用的资源。
-   **灵活性**：可以为用户分配多个角色，支持复杂的权限结构。
-   **可维护性**：通过将权限分组到角色中简化权限管理。

这种 RBAC 模型特别适用于需要控制和审计用户访问的应用程序，如企业软件、内容管理系统以及任何包含敏感数据的应用程序。
