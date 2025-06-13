# Organization and Team Member Management

This document explains the enhanced member management features that have been added to better-auth-ui, including search functionality and team assignment capabilities.

## Overview

The enhanced member management provides:

1. **Organization Member Management with Team Display**: View all organization members with their team assignments
2. **Team Member Search**: Add existing organization members to teams via search 
3. **Organization Member Search**: Admin-only search to move members between organizations
4. **Enhanced Team Assignment**: Move members between teams within an organization

## Components

### 1. OrganizationMembersWithTeamsCard

An enhanced version of the organization members card that shows team assignments for better organization visibility.

```tsx
import { OrganizationMembersWithTeamsCard } from "better-auth-ui"

function OrganizationSettingsPage() {
    return (
        <div className="space-y-6">
            <OrganizationMembersWithTeamsCard />
        </div>
    )
}
```

**Features:**
- Displays all organization members with their team assignments
- Enhanced member display showing team information
- All existing member management functionality (roles, removal, etc.)
- Clean, organized view of team structure

### 2. MemberCellWithTeams

Enhanced member cell that shows team assignment and provides team management actions.

```tsx
import { MemberCellWithTeams } from "better-auth-ui"

function CustomMembersList({ members }) {
    return (
        <div className="space-y-2">
            {members.map(member => (
                <MemberCellWithTeams
                    key={member.id}
                    member={member}
                />
            ))}
        </div>
    )
}
```

**Features:**
- Displays member info with team assignment
- Dropdown menu with "Move to Team" option
- Updates role and removes member actions
- Shows "No Team" when member isn't assigned to any team

### 3. TeamCellWithMembers (Enhanced)

The team cell component has been enhanced with search functionality to add existing organization members to teams.

```tsx
import { TeamCellWithMembers } from "better-auth-ui"

function TeamsPage() {
    const { data: teams } = useListTeams()
    
    return (
        <div className="space-y-4">
            {teams?.map(team => (
                <TeamCellWithMembers
                    key={team.id}
                    team={team}
                />
            ))}
        </div>
    )
}
```

**Enhanced Features:**
- "Add Member" button appears when org members are available to add to the team
- Search dialog to find and add existing organization members
- "Invite" button for sending email invitations (existing functionality)
- Move members to other teams or remove from organization

### 4. MemberSearchDialog

Reusable search dialog for finding and adding members.

```tsx
import { MemberSearchDialog } from "better-auth-ui"

function CustomComponent() {
    const [searchOpen, setSearchOpen] = useState(false)
    const [availableMembers, setAvailableMembers] = useState([])

    const handleAddMember = async (member) => {
        // Your logic to add member
        console.log("Adding member:", member)
    }

    return (
        <>
            <Button onClick={() => setSearchOpen(true)}>
                Search Members
            </Button>
            
            <MemberSearchDialog
                open={searchOpen}
                onOpenChange={setSearchOpen}
                title="Add Member"
                description="Search and add existing members"
                searchPlaceholder="Search members..."
                onAddMember={handleAddMember}
                availableMembers={availableMembers}
            />
        </>
    )
}
```

## Usage Scenarios

### 1. Organization Overview with Teams

**Use Case**: View organization structure with team assignments

```tsx
import { OrganizationMembersWithTeamsCard } from "better-auth-ui"

function OrganizationOverview() {
    return (
        <div className="space-y-6">
            <h1>Organization Members</h1>
            <OrganizationMembersWithTeamsCard />
        </div>
    )
}
```

**What happens:**
- Shows all organization members with their team assignments
- Clear visibility into team structure and member distribution
- All existing member management actions (role updates, removal, etc.)
- Enhanced display showing which team each member belongs to

### 2. Team Member Management

**Use Case**: Team lead wants to add existing organization members to their team

```tsx
import { TeamCellWithMembers } from "better-auth-ui"

function TeamManagement() {
    const { data: teams } = useListTeams()
    
    return (
        <div className="space-y-4">
            <h1>Team Management</h1>
            {teams?.map(team => (
                <TeamCellWithMembers
                    key={team.id}
                    team={team}
                />
            ))}
        </div>
    )
}
```

**What happens:**
- Each team shows current members
- "Add Member" button appears if organization members are available to add
- Clicking "Add Member" opens search dialog with org members not in this team
- Selecting a member moves them to this team

### 3. Moving Members Between Teams

**Use Case**: Reorganizing team structure

```tsx
import { MemberCellWithTeams } from "better-auth-ui"

function OrganizationMembersView() {
    const { data: activeOrg } = useActiveOrganization()
    
    return (
        <div className="space-y-2">
            {activeOrg?.members?.map(member => (
                <MemberCellWithTeams
                    key={member.id}
                    member={member}
                />
            ))}
        </div>
    )
}
```

**What happens:**
- Each member cell shows their current team assignment
- Dropdown menu includes "Move to Team" option
- Selecting "Move to Team" opens dialog to choose destination team
- Member is moved to selected team (or "No Team")

## Permissions

### Organization Level
- **Admin/Owner Only**: Moving members between organizations
- **Admin/Owner**: Inviting new members via email
- **Member**: View organization members and their teams

### Team Level  
- **Organization Admin/Owner**: All team management actions
- **Team Member with Invite Permission**: Add existing org members to teams
- **Team Member**: View team members

## API Methods Used

The components use these better-auth API methods:

```typescript
// Remove member from organization
await authClient.organization.removeMember({
    memberIdOrEmail: member.id,
    organizationId: org.id
})

// Invite member to organization with team assignment
await authClient.organization.inviteMember({
    email: member.user.email,
    role: member.role,
    teamId: team.id, // Optional - assigns to team
    organizationId: org.id
})

// List all organizations (admin only)
const { data: organizations } = useListOrganizations()

// List teams in current organization
const { data: teams } = useListTeams()

// Get active organization with members
const { data: activeOrg } = useActiveOrganization()
```

## Configuration

Enable the enhanced functionality in your AuthUIProvider:

```tsx
import { AuthUIProvider } from "better-auth-ui"

function App() {
    return (
        <AuthUIProvider
            authClient={authClient}
            organization={{
                teams: {
                    enabled: true,
                    maximumTeams: 10,
                    allowRemovingAllTeams: false
                }
            }}
        >
            {/* Your app */}
        </AuthUIProvider>
    )
}
```

## Styling

All components inherit the existing styling patterns and can be customized with `classNames`:

```tsx
<OrganizationMembersWithTeamsCard
    classNames={{
        cell: "border-2 border-blue-200",
        button: "bg-blue-500 hover:bg-blue-600",
        content: "bg-gray-50"
    }}
/>
```

## Error Handling

The components handle common error scenarios:

- Network failures during member operations
- Permission denied errors
- Invalid member states
- Organization/team not found errors

All errors are displayed via toast notifications with localized messages.

## Localization

New localization keys added:

```typescript
{
    SEARCH_MEMBERS: "Search members...",
    SEARCH_USERS: "Search users...", 
    ADD_TO_ORGANIZATION: "Add to Organization",
    MOVE_TO_TEAM: "Move to Team",
    MOVE_TO_ORGANIZATION: "Move to Organization",
    SELECT_ORGANIZATION: "Select Organization",
    MEMBER_MOVED_SUCCESSFULLY: "Member moved successfully",
    FAILED_TO_MOVE_MEMBER: "Failed to move member",
    ADD_MEMBER: "Add Member",
    ADD_MEMBER_TO_TEAM_DESCRIPTION: "Search and add existing members to this team",
    ADD_MEMBER_TO_ORG_DESCRIPTION: "Search and add users to this organization",
    NO_MEMBERS_FOUND: "No members found",
    NO_USERS_FOUND: "No users found",
    AVAILABLE_MEMBERS: "Available Members",
    AVAILABLE_USERS: "Available Users"
}
```

## Migration from Basic Teams

If you're currently using the basic teams functionality:

1. Replace `OrganizationMembersCard` with `OrganizationMembersWithTeamsCard` for enhanced functionality
2. Replace `MemberCell` with `MemberCellWithTeams` to show team assignments  
3. `TeamCellWithMembers` automatically gets the enhanced search functionality
4. No breaking changes - all existing functionality preserved 