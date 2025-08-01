-- Better Auth 1.3 Migration Script
-- Step 1: Create teamMembers table for multi-team support

CREATE TABLE teamMembers (
    id VARCHAR(36) PRIMARY KEY,
    teamId VARCHAR(36) NOT NULL,
    memberId VARCHAR(36) NOT NULL,
    createdAt DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (teamId) REFERENCES team(id) ON DELETE CASCADE,
    FOREIGN KEY (memberId) REFERENCES member(id) ON DELETE CASCADE,
    
    -- Ensure a member can only be in a team once
    UNIQUE(teamId, memberId)
);

-- Create indexes for performance
CREATE INDEX idx_teamMembers_teamId ON teamMembers(teamId);
CREATE INDEX idx_teamMembers_memberId ON teamMembers(memberId);