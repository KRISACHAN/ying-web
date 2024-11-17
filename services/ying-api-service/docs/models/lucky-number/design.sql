CREATE TABLE `lucky_number_activity` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(255) NOT NULL UNIQUE,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `lucky_number_pool` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `activity_id` INT(11) NOT NULL,
  `number` INT(11) NOT NULL,
  `is_drawn` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_activity_number` (`activity_id`, `number`),
  FOREIGN KEY (`activity_id`) REFERENCES `lucky_number_activity`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `lucky_number_user_participation` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `activity_id` INT(11) NOT NULL,
  `user_name` VARCHAR(255) NOT NULL,
  `ip_address` VARCHAR(45) NOT NULL,
  `drawn_number` INT(11),
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_activity` (`activity_id`, `user_name`, `ip_address`),
  FOREIGN KEY (`activity_id`) REFERENCES `lucky_number_activity`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`drawn_number`) REFERENCES `lucky_number_pool`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
