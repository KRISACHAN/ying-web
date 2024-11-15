INSERT INTO admin (id, username, password, email, status, created_at, updated_at) VALUES
(1, 'superadmin', 'hashed_password', 'superadmin@example.com', 1, NOW(), NOW()),
(2, 'editorUser', 'hashed_password', 'editorUser@example.com', 1, NOW(), NOW()),
(3, 'viewerUser', 'hashed_password', 'viewerUser@example.com', 1, NOW(), NOW());
