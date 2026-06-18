-- Remove the hardcoded seed admin user.
-- The seed admin user is now created by the application startup logic using credentials provided through Docker Compose secrets.
DELETE FROM users
WHERE id = '00000000-0000-0000-0000-000000000001'
  AND username = 'admin';