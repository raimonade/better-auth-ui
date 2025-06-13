import type { BetterFetchError } from "@better-fetch/fetch"
import type { Invitation } from "better-auth/plugins/organization"
import type { ApiKey } from "./api-key"
import type { AuthClient, Session, User } from "./auth-client"
import type { Refetch } from "./refetch"
import type { Team, TeamMember } from "./team-options"

type AuthHook<T> = {
    isPending: boolean
    data?: T | null
    error?: BetterFetchError | null
    refetch?: Refetch
}

export interface AuthHooks {
    useSession: AuthClient["useSession"]
    useListAccounts: () => AuthHook<{ accountId: string; provider: string }[]>
    useListDeviceSessions: () => AuthHook<{ session: Session; user: User }[]>
    useListSessions: () => AuthHook<Session[]>
    useListPasskeys: AuthClient["useListPasskeys"]
    useListApiKeys: () => AuthHook<ApiKey[]>
    useActiveOrganization: AuthClient["useActiveOrganization"]
    useListOrganizations: AuthClient["useListOrganizations"]
    useHasPermission: (params: {
        permissions: Record<string, string[]>
    }) => AuthHook<{ success: boolean }>
    useInvitation: (params: { query: { id: string } }) => AuthHook<Invitation>
    useListTeams: (params?: {
        query?: { organizationId?: string }
    }) => AuthHook<Team[]>
    useIsRestoring?: () => boolean
}
