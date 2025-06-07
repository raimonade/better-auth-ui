export type TeamOptions = {
    /**
     * Enable teams functionality
     * @default false
     */
    enabled: boolean
    /**
     * Maximum number of teams per organization
     * @default undefined (unlimited)
     */
    maximumTeams?: number
    /**
     * Allow removing all teams from an organization
     * @default true
     */
    allowRemovingAllTeams?: boolean
}

export type TeamOptionsContext = {
    /**
     * Whether teams functionality is enabled
     */
    enabled: boolean
    /**
     * Maximum number of teams per organization
     */
    maximumTeams?: number
    /**
     * Allow removing all teams from an organization
     */
    allowRemovingAllTeams: boolean
}

export type Team = {
    /**
     * Unique identifier for the team
     */
    id: string
    /**
     * Name of the team
     */
    name: string
    /**
     * ID of the organization this team belongs to
     */
    organizationId: string
    /**
     * Timestamp when the team was created
     */
    createdAt: Date
    /**
     * Timestamp when the team was last updated
     */
    updatedAt: Date
}

export type TeamMember = {
    /**
     * ID of the team
     */
    teamId: string
    /**
     * ID of the user
     */
    userId: string
    /**
     * ID of the organization
     */
    organizationId: string
}

export type CreateTeamParams = {
    /**
     * Name of the team
     */
    name: string
    /**
     * ID of the organization (optional, defaults to active organization)
     */
    organizationId?: string
}

export type UpdateTeamParams = {
    /**
     * ID of the team to update
     */
    teamId: string
    /**
     * Updated team data
     */
    data: {
        /**
         * New name for the team
         */
        name: string
    }
    /**
     * ID of the organization (optional, defaults to active organization)
     */
    organizationId?: string
}

export type RemoveTeamParams = {
    /**
     * ID of the team to remove
     */
    teamId: string
    /**
     * ID of the organization (optional, defaults to active organization)
     */
    organizationId?: string
}

export type ListTeamsParams = {
    /**
     * Query parameters
     */
    query?: {
        /**
         * ID of the organization (optional, defaults to active organization)
         */
        organizationId?: string
    }
}

export type AddTeamMemberParams = {
    /**
     * ID of the team
     */
    teamId: string
    /**
     * ID of the user to add
     */
    userId: string
    /**
     * ID of the organization (optional, defaults to active organization)
     */
    organizationId?: string
}

export type RemoveTeamMemberParams = {
    /**
     * ID of the team
     */
    teamId: string
    /**
     * ID of the user to remove
     */
    userId: string
    /**
     * ID of the organization (optional, defaults to active organization)
     */
    organizationId?: string
}
