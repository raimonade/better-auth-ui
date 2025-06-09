# Teams Support in Better Auth UI

This document explains how to use the teams feature that has been added to better-auth-ui.

## Overview

Teams allow you to group members within an organization. The teams feature provides additional organization structure and can be used to manage permissions at a more granular level.

## Setup

### 1. Enable Teams in Better Auth Server

First, enable teams in your better-auth server configuration:

```typescript
// auth.ts
import { betterAuth } from "better-auth"
import { organization } from "better-auth/plugins"

export const auth = betterAuth({
    plugins: [
        organization({
            teams: {
                enabled: true,
                maximumTeams: 10, // Optional: limit teams per organization
                allowRemovingAllTeams: false // Optional: prevent removing the last team
            }
        })
    ]
})
```

### 2. Enable Teams in Better Auth Client

Enable teams in your better-auth client configuration:

```typescript
// auth-client.ts
import { createAuthClient } from "better-auth/client"
import { organizationClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    plugins: [
        organizationClient({
            teams: {
                enabled: true
            }
        })
    ]
})
```

### 3. Enable Teams in Better Auth UI

Enable teams in your better-auth-ui provider:

```tsx
// app.tsx or your root component
import { AuthUIProvider } from "better-auth-ui"

function App() {
    return (
        <AuthUIProvider
            authClient={authClient}
            organization={{
                teams: {
                    enabled: true,
                    maximumTeams: 10, // Optional
                    allowRemovingAllTeams: false // Optional
                }
            }}
        >
            {/* Your app content */}
        </AuthUIProvider>
    )
}
```

## Usage

### Teams Management Page

Once teams are enabled, a "Teams" tab will appear in the organization settings. You can access it at:

```
/auth/teams
```

### Available Components

The following components are now available for teams management:

#### TeamsCard
Displays all teams in the organization with create/manage options:

```tsx
import { TeamsCard } from "better-auth-ui"

function OrganizationSettings() {
    return (
        <TeamsCard />
    )
}
```

#### TeamCell
Displays individual team information with management actions:

```tsx
import { TeamCell } from "better-auth-ui"

function TeamsList({ teams }) {
    return (
        <div>
            {teams.map(team => (
                <TeamCell key={team.id} team={team} />
            ))}
        </div>
    )
}
```

#### Team Dialogs
- `CreateTeamDialog` - For creating new teams
- `UpdateTeamDialog` - For editing team names
- `DeleteTeamDialog` - For removing teams

### Team Assignment During Invitation

When inviting members to an organization, you can now optionally assign them to a team:

1. Go to the Members page in organization settings
2. Click "Invite Member"
3. Fill in email and role
4. Optionally select a team from the dropdown
5. Send the invitation

The invited member will be added to the specified team upon accepting the invitation.

## Permissions

Teams follow the organization's permission system. To manage teams, users need the following permissions:

- `team:create` - Create new teams
- `team:update` - Update team details  
- `team:delete` - Remove teams

By default:
- Organization owners and admins can manage teams
- Regular members cannot create, update, or delete teams

## Configuration Options

### maximumTeams
Limit the number of teams per organization:

```typescript
teams: {
    enabled: true,
    maximumTeams: 10 // Fixed number
    // OR
    maximumTeams: async ({ organizationId, session }, request) => {
        // Dynamic limit based on organization plan
        const plan = await getPlan(organizationId)
        return plan === 'pro' ? 20 : 5
    }
}
```

### allowRemovingAllTeams
Control whether the last team can be removed:

```typescript
teams: {
    enabled: true,
    allowRemovingAllTeams: false // Prevent removing the last team
}
```

## Database Schema

When teams are enabled, a new `team` table is added with the following structure:

| Field Name | Type | Description |
|------------|------|-------------|
| id | string | Unique identifier for each team |
| name | string | The name of the team |
| organizationId | string | The ID of the organization |
| createdAt | Date | Timestamp of when the team was created |
| updatedAt | Date | Timestamp of when the team was last updated |

## Localization

The following localization keys are available for customization:

- `TEAMS` - "Teams"
- `TEAM` - "Team"
- `CREATE_TEAM` - "Create Team"
- `TEAM_NAME` - "Team Name"
- `TEAM_NAME_PLACEHOLDER` - "Development Team"
- `TEAM_NAME_DESCRIPTION` - "This is your team's visible name."
- `CREATE_TEAM_SUCCESS` - "Team created successfully"
- `TEAMS_DESCRIPTION` - "Manage teams within your organization."
- `TEAMS_INSTRUCTIONS` - "Create teams to organize members within your organization."
- `UPDATE_TEAM` - "Update Team"
- `UPDATE_TEAM_SUCCESS` - "Team updated successfully"
- `DELETE_TEAM` - "Delete Team"
- `DELETE_TEAM_CONFIRM` - "Are you sure you want to delete this team?"
- `DELETE_TEAM_SUCCESS` - "Team deleted successfully"
- `SELECT_TEAM` - "Select a team"
- `SELECT_TEAM_LABEL` - "Select Team"
- `NO_TEAM` - "No team"

## Example Implementation

Here's a complete example of how to set up teams in your application:

```tsx
// auth.ts
import { betterAuth } from "better-auth"
import { organization } from "better-auth/plugins"

export const auth = betterAuth({
    database: {
        // your database config
    },
    plugins: [
        organization({
            teams: {
                enabled: true,
                maximumTeams: 10,
                allowRemovingAllTeams: false
            }
        })
    ]
})

// auth-client.ts
import { createAuthClient } from "better-auth/client"
import { organizationClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
    plugins: [
        organizationClient({
            teams: {
                enabled: true
            }
        })
    ]
})

// app.tsx
import { AuthUIProvider, SettingsCards } from "better-auth-ui"
import { authClient } from "./auth-client"

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
            <div className="container mx-auto p-4">
                <SettingsCards view="TEAMS" />
            </div>
        </AuthUIProvider>
    )
}

export default App
```

This will render the teams management interface where users can create, update, and delete teams within their organization. 