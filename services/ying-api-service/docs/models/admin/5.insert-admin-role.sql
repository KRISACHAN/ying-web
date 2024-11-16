INSERT INTO `admin_role` (`admin_id`, `role_id`, `created_at`, `updated_at`) VALUES
(1, (SELECT id FROM `role` WHERE `name` = 'admin'), NOW(), NOW()),
(2, (SELECT id FROM `role` WHERE `name` = 'editor'), NOW(), NOW()),
(3, (SELECT id FROM `role` WHERE `name` = 'viewer'), NOW(), NOW());
