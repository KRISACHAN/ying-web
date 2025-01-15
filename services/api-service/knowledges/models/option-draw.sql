DROP TABLE IF EXISTS `option_draw_activity`;
DROP TABLE IF EXISTS `option_draw_pool`;
DROP TABLE IF EXISTS `option_draw_user_participation`;

CREATE TABLE `option_draw_activity` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(20) NOT NULL,
  `description` VARCHAR(255),
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,
  `participant_limit` INT(11) NOT NULL DEFAULT 0,
  `allow_duplicate_options` BOOLEAN NOT NULL DEFAULT FALSE,
  `status` ENUM('not_started', 'ongoing', 'ended') NOT NULL DEFAULT 'not_started',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `option_draw_pool` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `activity_id` INT(11) NOT NULL,
  `drawn_option` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_activity_option` (`activity_id`, `drawn_option`, `deleted_at`),
  FOREIGN KEY (`activity_id`) REFERENCES `option_draw_activity`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `option_draw_user_participation` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `activity_id` INT(11) NOT NULL,
  `username` VARCHAR(40) NOT NULL,
  `drawn_option` VARCHAR(255),
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_activity` (`activity_id`, `username`, `deleted_at`),
  FOREIGN KEY (`activity_id`) REFERENCES `option_draw_activity`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
