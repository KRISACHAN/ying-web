DROP TABLE IF EXISTS `promise_category`;
DROP TABLE IF EXISTS `promise`;

CREATE TABLE `promise_category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) NOT NULL UNIQUE,
  `description` VARCHAR(100),
  `is_published` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `promise` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `category_id` INT NOT NULL,
  `category_name` VARCHAR(20) NOT NULL,
  `chapter` VARCHAR(20) NOT NULL,
  `text` VARCHAR(255) NOT NULL,
  `description` VARCHAR(510),
  `resource_type` ENUM('image', 'video', 'audio'),
  `resource_url` TEXT,
  `is_published` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`category_id`) REFERENCES `promise_category`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_name`) REFERENCES `promise_category`(`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_category` (`category_id`),
  INDEX `idx_category_name` (`category_name`),
  INDEX `idx_chapter` (`chapter`),
  INDEX `idx_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
