-- =============================================
-- Admin Management System Database Schema
-- =============================================
-- This schema defines the admin management system with role-based access control (RBAC)
-- Includes: admin users, roles, permissions, and their relationships
-- Optimized with indexes for performance and proper foreign key constraints

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS `admin`;
DROP TABLE IF EXISTS `role`;
DROP TABLE IF EXISTS `admin_role`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `role_permissions`;

-- =============================================
-- Admin Users Table
-- =============================================
-- Stores admin user information with authentication credentials
CREATE TABLE `admin` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL UNIQUE,  -- Unique username for login
  `password` VARCHAR(255) NOT NULL,         -- Hashed password
  `email` VARCHAR(255) NOT NULL UNIQUE,     -- Unique email address
  `status` TINYINT(1) NOT NULL DEFAULT 1,  -- Account status (1=active, 0=inactive)
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,                    -- Soft delete timestamp
  PRIMARY KEY (`id`),
  INDEX `idx_username` (`username`),        -- Index for login queries
  INDEX `idx_email` (`email`),             -- Index for email lookups
  INDEX `idx_status` (`status`)            -- Index for status filtering
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- Roles Table
-- =============================================
-- Defines different roles that can be assigned to admin users
CREATE TABLE `role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL UNIQUE,     -- Role name (e.g., 'admin', 'moderator')
  `description` TEXT,                       -- Role description
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,                    -- Soft delete timestamp
  PRIMARY KEY (`id`),
  INDEX `idx_name` (`name`)                -- Index for role lookups
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- Permissions Table
-- =============================================
-- Defines specific permissions that can be granted to roles
CREATE TABLE `permissions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL UNIQUE,     -- Permission name (e.g., 'user.read', 'admin.write')
  `description` TEXT,                      -- Permission description
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,                   -- Soft delete timestamp
  PRIMARY KEY (`id`),
  INDEX `idx_name` (`name`)               -- Index for permission lookups
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- Role-Permissions Junction Table
-- =============================================
-- Many-to-many relationship between roles and permissions
-- Defines which permissions are granted to each role
CREATE TABLE `role_permissions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,                   -- Soft delete timestamp
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_role_permission` (`role_id`, `permission_id`, `deleted_at`),
  INDEX `idx_role_id` (`role_id`),        -- Index for role-based queries
  INDEX `idx_permission_id` (`permission_id`), -- Index for permission-based queries
  FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- Admin-Role Junction Table
-- =============================================
-- Many-to-many relationship between admin users and roles
-- Defines which roles are assigned to each admin user
CREATE TABLE `admin_role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `admin_id` INT NOT NULL,
  `role_id` INT NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,                   -- Soft delete timestamp
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_admin_role` (`admin_id`, `role_id`, `deleted_at`),
  INDEX `idx_admin_id` (`admin_id`),       -- Index for admin-based queries
  INDEX `idx_role_id` (`role_id`),        -- Index for role-based queries
  FOREIGN KEY (`admin_id`) REFERENCES `admin`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
