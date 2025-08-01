# Better Auth 1.3 Database Migration Guide for MSSQL

## Overview
These migration scripts update your MSSQL database schema to support Better Auth 1.3's multi-team architecture.

## Key Changes
- **Breaking Change**: `teamId` is removed from the `member` table
- New `teamMembers` junction table for many-to-many team membership
- Optional: Organization-scoped API keys support

## Migration Steps

### 1. **BACKUP YOUR DATABASE FIRST!**
```sql
BACKUP DATABASE [YourDatabaseName] 
TO DISK = 'C:\Backups\YourDatabaseName_BeforeBetterAuth13_Migration.bak'
WITH FORMAT, INIT, NAME = 'Before Better Auth 1.3 Migration';
```

### 2. Run Migration Scripts in Order

#### Script 1: Create teamMembers Table
Run `01-create-team-members-table.sql`

This creates the new junction table for team membership.

#### Script 2: Migrate Existing Data (if applicable)
Run `02-migrate-existing-team-data.sql`

**Important**: First run the SELECT query to check if you have any team data to migrate. Only run the INSERT if you have existing team assignments.

#### Script 3: Remove teamId from member Table
Run `03-drop-teamid-from-member.sql`

**Warning**: Only run this after verifying that step 2 completed successfully!

#### Script 4: Add Organization API Keys (Optional)
Run `04-add-org-apikeys-optional.sql`

Only run this if you plan to use organization-scoped API keys.

## Verification

After migration, verify your schema:

```sql
-- Check teamMembers table was created
SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'teamMembers';

-- Check member table no longer has teamId
SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'member' AND COLUMN_NAME = 'teamId';

-- Verify team memberships
SELECT 
    o.name as OrgName,
    t.name as TeamName,
    u.email as UserEmail,
    m.role as MemberRole
FROM teamMembers tm
JOIN team t ON tm.teamId = t.id
JOIN member m ON tm.memberId = m.id
JOIN [user] u ON m.userId = u.id
JOIN organization o ON t.organizationId = o.id
ORDER BY o.name, t.name, u.email;
```

## Rollback Plan

If you need to rollback:

1. Restore from your backup
2. Or manually reverse the changes:
   - Add `teamId VARCHAR(36)` back to member table
   - Populate it from teamMembers data
   - Drop teamMembers table

## Application Code Updates

After database migration, update your application code:

1. Remove all `fetchOptions: { throw: true }` from API calls
2. Add `organizationId` parameter to organization update calls
3. Use new team member APIs instead of filtering by `teamId`
4. Update any direct SQL queries that reference `member.teamId`

See the main migration guide for detailed code examples.