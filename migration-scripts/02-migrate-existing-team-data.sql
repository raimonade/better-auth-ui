-- Better Auth 1.3 Migration Script
-- Step 2: Migrate existing team data from member.teamId to teamMembers table

-- First, check if there's any existing team data to migrate
SELECT COUNT(*) as members_with_teams 
FROM member 
WHERE teamId IS NOT NULL;

-- If the above query returns > 0, run this migration:
-- This will create teamMembers records for all existing team assignments
INSERT INTO teamMembers (id, teamId, memberId, createdAt)
SELECT 
    NEWID() as id,
    teamId,
    id as memberId,
    GETDATE()
FROM member 
WHERE teamId IS NOT NULL;

-- Verify the migration
SELECT 
    tm.*, 
    m.userId,
    t.name as teamName,
    t.organizationId
FROM teamMembers tm
JOIN member m ON tm.memberId = m.id
JOIN team t ON tm.teamId = t.id;