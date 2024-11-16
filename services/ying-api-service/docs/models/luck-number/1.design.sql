CREATE TABLE `activity` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(255) NOT NULL UNIQUE,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `number_pool` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `activity_id` INT(11) NOT NULL,
  `number` INT(11) NOT NULL,
  `is_drawn` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_activity_number` (`activity_id`, `number`),
  UNIQUE KEY `unique_number` (`number`),  -- Add this line
  FOREIGN KEY (`activity_id`) REFERENCES `activity`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `user_participation` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `activity_id` INT(11) NOT NULL,
  `user_name` VARCHAR(255) NOT NULL,
  `ip_address` VARCHAR(45) NOT NULL,
  `drawn_number` INT(11),
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_activity` (`activity_id`, `user_name`, `ip_address`),
  FOREIGN KEY (`activity_id`) REFERENCES `activity`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`drawn_number`) REFERENCES `number_pool`(`number`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
