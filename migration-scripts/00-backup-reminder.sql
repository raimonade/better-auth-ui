-- Better Auth 1.3 Migration Scripts
-- IMPORTANT: BACKUP YOUR DATABASE BEFORE RUNNING THESE SCRIPTS!

-- To create a backup in MSSQL:
-- BACKUP DATABASE [YourDatabaseName] 
-- TO DISK = 'C:\Backups\YourDatabaseName_BeforeBetterAuth13_Migration.bak'
-- WITH FORMAT, INIT, NAME = 'Before Better Auth 1.3 Migration';

-- Migration Order:
-- 1. Run 01-create-team-members-table.sql
-- 2. Run 02-migrate-existing-team-data.sql (check if you have team data first)
-- 3. Run 03-drop-teamid-from-member.sql (only after verifying step 2)
-- 4. Run 04-add-org-apikeys-optional.sql (only if using org API keys)

-- To verify your current schema before migration:
SELECT 
    t.name AS TableName,
    c.name AS ColumnName,
    ty.name AS DataType,
    c.max_length,
    c.is_nullable
FROM sys.tables t
INNER JOIN sys.columns c ON t.object_id = c.object_id
INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
WHERE t.name IN ('member', 'team', 'organization', 'apiKey')
ORDER BY t.name, c.column_id;