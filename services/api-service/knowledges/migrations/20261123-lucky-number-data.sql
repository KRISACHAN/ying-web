-- Apply to the existing API database before deploying the API. Keep these tables on application rollback.
CREATE TABLE IF NOT EXISTS `lucky_number_data_schema` (
    `activity_id` INT NOT NULL,
    `columns_json` JSON NOT NULL,
    `revision` INT NOT NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL,
    PRIMARY KEY (`activity_id`),
    CONSTRAINT `fk_lucky_number_data_activity`
        FOREIGN KEY (`activity_id`) REFERENCES `lucky_number_activity` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `lucky_number_data_row` (
    `activity_id` INT NOT NULL,
    `drawn_number` INT NOT NULL,
    `values_json` JSON NOT NULL,
    `version` INT NOT NULL,
    `updated_by` INT NOT NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL,
    PRIMARY KEY (`activity_id`, `drawn_number`),
    CONSTRAINT `fk_lucky_number_data_schema`
        FOREIGN KEY (`activity_id`) REFERENCES `lucky_number_data_schema` (`activity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
