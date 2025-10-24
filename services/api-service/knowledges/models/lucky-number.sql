-- =============================================
-- Lucky Number Activity System Database Schema
-- =============================================
-- This schema defines the lucky number activity system
-- Includes: activities, number pools, and user participations
-- Optimized with indexes for performance and proper constraints

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS `lucky_number_activity`;
DROP TABLE IF EXISTS `lucky_number_pool`;
DROP TABLE IF EXISTS `lucky_number_user_participation`;

-- =============================================
-- Lucky Number Activities Table
-- =============================================
-- Stores lucky number activity information
CREATE TABLE `lucky_number_activity` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(20) NOT NULL UNIQUE,        -- Unique activity identifier
  `name` VARCHAR(20) NOT NULL,              -- Activity display name
  `description` VARCHAR(255),               -- Activity description
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,                    -- Soft delete timestamp
  `participant_limit` INT NOT NULL DEFAULT 0, -- Maximum participants (0=unlimited)
  `status` ENUM('not_started', 'ongoing', 'ended') NOT NULL DEFAULT 'not_started', -- Activity status
  PRIMARY KEY (`id`),
  INDEX `idx_key` (`key`),                  -- Index for activity lookups
  INDEX `idx_status` (`status`),           -- Index for status filtering
  INDEX `idx_created_at` (`created_at`)    -- Index for chronological queries
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- Lucky Number Pool Table
-- =============================================
-- Stores the pool of numbers available for each activity
CREATE TABLE `lucky_number_pool` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `activity_id` INT NOT NULL,              -- Reference to activity
  `drawn_number` INT NOT NULL,             -- The actual number in the pool
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,                   -- Soft delete timestamp
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_activity_number` (`activity_id`, `drawn_number`, `deleted_at`), -- Prevent duplicate numbers per activity
  INDEX `idx_activity_id` (`activity_id`), -- Index for activity-based queries
  INDEX `idx_drawn_number` (`drawn_number`), -- Index for number lookups
  FOREIGN KEY (`activity_id`) REFERENCES `lucky_number_activity`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- User Participation Table
-- =============================================
-- Tracks user participation in lucky number activities
CREATE TABLE `lucky_number_user_participation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `activity_id` INT NOT NULL,              -- Reference to activity
  `username` VARCHAR(40) NOT NULL,         -- Participating user
  `drawn_number` INT,                      -- Number drawn by user (NULL if not drawn yet)
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,                   -- Soft delete timestamp
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_activity` (`activity_id`, `username`, `deleted_at`), -- One participation per user per activity
  INDEX `idx_activity_id` (`activity_id`), -- Index for activity-based queries
  INDEX `idx_username` (`username`),       -- Index for user-based queries
  INDEX `idx_drawn_number` (`drawn_number`), -- Index for number-based queries
  FOREIGN KEY (`activity_id`) REFERENCES `lucky_number_activity`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
