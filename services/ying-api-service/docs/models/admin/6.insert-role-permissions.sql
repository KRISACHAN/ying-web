INSERT INTO `role_permissions` (`role_id`, `permission_id`, `created_at`, `updated_at`) VALUES
((SELECT `id` FROM `role` WHERE `name` = 'admin'), (SELECT `id` FROM `permissions` WHERE `name` = 'manage_users'), NOW(), NOW()),
((SELECT `id` FROM `role` WHERE `name` = 'admin'), (SELECT `id` FROM `permissions` WHERE `name` = 'manage_roles'), NOW(), NOW()),
((SELECT `id` FROM `role` WHERE `name` = 'admin'), (SELECT `id` FROM `permissions` WHERE `name` = 'manage_permissions'), NOW(), NOW()),
((SELECT `id` FROM `role` WHERE `name` = 'admin'), (SELECT `id` FROM `permissions` WHERE `name` = 'view_reports'), NOW(), NOW()),
((SELECT `id` FROM `role` WHERE `name` = 'admin'), (SELECT `id` FROM `permissions` WHERE `name` = 'edit_content'), NOW(), NOW()),
((SELECT `id` FROM `role` WHERE `name` = 'admin'), (SELECT `id` FROM `permissions` WHERE `name` = 'delete_content'), NOW(), NOW()),
((SELECT `id` FROM `role` WHERE `name` = 'admin'), (SELECT `id` FROM `permissions` WHERE `name` = 'publish_content'), NOW(), NOW()),
((SELECT `id` FROM `role` WHERE `name` = 'admin'), (SELECT `id` FROM `permissions` WHERE `name` = 'archive_content'), NOW(), NOW()),
((SELECT `id` FROM `role` WHERE `name` = 'editor'), (SELECT `id` FROM `permissions` WHERE `name` = 'view_reports'), NOW(), NOW()),
((SELECT `id` FROM `role` WHERE `name` = 'editor'), (SELECT `id` FROM `permissions` WHERE `name` = 'edit_content'), NOW(), NOW()),
((SELECT `id` FROM `role` WHERE `name` = 'editor'), (SELECT `id` FROM `permissions` WHERE `name` = 'publish_content'), NOW(), NOW()),
((SELECT `id` FROM `role` WHERE `name` = 'editor'), (SELECT `id` FROM `permissions` WHERE `name` = 'delete_content'), NOW(), NOW()),
((SELECT `id` FROM `role` WHERE `name` = 'viewer'), (SELECT `id` FROM `permissions` WHERE `name` = 'view_reports'), NOW(), NOW());
