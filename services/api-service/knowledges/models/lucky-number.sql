DROP TABLE IF EXISTS `lucky_number_activity`;
DROP TABLE IF EXISTS `lucky_number_pool`;
DROP TABLE IF EXISTS `lucky_number_user_participation`;

CREATE TABLE `lucky_number_activity` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(20) NOT NULL,
  `description` VARCHAR(255),
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,
  `participant_limit` INT NOT NULL DEFAULT 0,
  `status` ENUM('not_started', 'ongoing', 'ended') NOT NULL DEFAULT 'not_started',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `lucky_number_pool` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `activity_id` INT NOT NULL,
  `drawn_number` INT NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_activity_number` (`activity_id`, `drawn_number`, `deleted_at`),
  FOREIGN KEY (`activity_id`) REFERENCES `lucky_number_activity`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `lucky_number_user_participation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `activity_id` INT NOT NULL,
  `username` VARCHAR(40) NOT NULL,
  `drawn_number` INT,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_activity` (`activity_id`, `username`, `deleted_at`),
  FOREIGN KEY (`activity_id`) REFERENCES `lucky_number_activity`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
