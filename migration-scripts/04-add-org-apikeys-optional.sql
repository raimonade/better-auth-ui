-- Better Auth 1.3 Migration Script
-- Step 4: Add organization support to API keys (OPTIONAL)
-- Only run this if you want to use organization-scoped API keys

-- Check if organizationId column already exists
IF NOT EXISTS (
    SELECT * 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'apiKey' 
    AND COLUMN_NAME = 'organizationId'
)
BEGIN
    -- Add organizationId to apiKey table
    ALTER TABLE apiKey ADD organizationId VARCHAR(36);
    
    -- Add foreign key constraint
    ALTER TABLE apiKey 
    ADD CONSTRAINT FK_apiKey_organization 
    FOREIGN KEY (organizationId) REFERENCES organization(id) ON DELETE CASCADE;
    
    -- Create index for performance
    CREATE INDEX idx_apiKey_organizationId ON apiKey(organizationId);
END
ELSE
BEGIN
    PRINT 'organizationId column already exists in apiKey table'
END