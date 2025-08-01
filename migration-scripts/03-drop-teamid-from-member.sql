-- Better Auth 1.3 Migration Script
-- Step 3: Remove teamId column from member table

-- IMPORTANT: Only run this after successfully migrating data in step 2!

-- First, drop any indexes on teamId if they exist
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_member_teamId' AND object_id = OBJECT_ID('member'))
    DROP INDEX idx_member_teamId ON member;

-- Drop any foreign key constraints on teamId
DECLARE @ConstraintName nvarchar(200)
SELECT @ConstraintName = CONSTRAINT_NAME 
FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
WHERE CONSTRAINT_SCHEMA = SCHEMA_NAME() 
    AND TABLE_NAME = 'member' 
    AND CONSTRAINT_NAME LIKE '%teamId%'

IF @ConstraintName IS NOT NULL
    EXEC('ALTER TABLE member DROP CONSTRAINT ' + @ConstraintName)

-- Finally, drop the teamId column
ALTER TABLE member DROP COLUMN teamId;