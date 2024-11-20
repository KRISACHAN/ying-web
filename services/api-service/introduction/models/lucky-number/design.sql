CREATE TABLE `lucky_number_activity` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(20) NOT NULL,
  `description` VARCHAR(255),
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `lucky_number_pool` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `activity_id` INT(11) NOT NULL,
  `drawn_number` INT(11) NOT NULL,
  `is_drawn` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_activity_number` (`activity_id`, `drawn_number`),
  FOREIGN KEY (`activity_id`) REFERENCES `lucky_number_activity`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `lucky_number_user_participation` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `activity_id` INT(11) NOT NULL,
  `user_name` VARCHAR(40) NOT NULL,
  `drawn_number` INT(11),
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`activity_id`) REFERENCES `lucky_number_activity`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`drawn_number`) REFERENCES `lucky_number_pool`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
