-- =============================================
-- Promise Management System Database Schema
-- =============================================
-- This schema defines the promise management system
-- Includes: promise categories and individual promises
-- Optimized with indexes for performance and proper constraints

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS `promise_category`;
DROP TABLE IF EXISTS `promise`;

-- =============================================
-- Promise Categories Table
-- =============================================
-- Stores promise category information for organizing promises
CREATE TABLE `promise_category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) NOT NULL UNIQUE,           -- Unique category name
  `description` VARCHAR(100),                    -- Category description
  `is_published` BOOLEAN NOT NULL DEFAULT FALSE, -- Publication status
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,                         -- Soft delete timestamp
  PRIMARY KEY (`id`),
  INDEX `idx_name` (`name`),                    -- Index for category lookups
  INDEX `idx_published` (`is_published`)        -- Index for publication filtering
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- Promises Table
-- =============================================
-- Stores individual promise entries with multimedia support
CREATE TABLE `promise` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `category_id` INT NOT NULL,                   -- Reference to category
  `category_name` VARCHAR(20) NOT NULL,         -- Category name (denormalized for performance)
  `chapter` VARCHAR(20) NOT NULL,               -- Chapter/section identifier
  `text` VARCHAR(255) NOT NULL,                 -- Promise text content
  `description` VARCHAR(510),                    -- Extended description
  `resource_type` ENUM('image', 'video', 'audio'), -- Type of associated media
  `resource_url` TEXT,                          -- URL to associated media resource
  `is_published` BOOLEAN NOT NULL DEFAULT FALSE, -- Publication status
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,                        -- Soft delete timestamp
  PRIMARY KEY (`id`),
  FOREIGN KEY (`category_id`) REFERENCES `promise_category`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_name`) REFERENCES `promise_category`(`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_category` (`category_id`),         -- Index for category-based queries
  INDEX `idx_category_name` (`category_name`), -- Index for category name lookups
  INDEX `idx_chapter` (`chapter`),             -- Index for chapter-based queries
  INDEX `idx_published` (`is_published`)       -- Index for publication filtering
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
