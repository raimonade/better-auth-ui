import type { Invitation } from "better-auth/plugins/organization"
import { useContext, useEffect, useState } from "react"
import { AuthUIContext } from "../lib/auth-ui-provider"
import { getSearchParam } from "../lib/utils"

export interface InvitationContext {
    invitationId: string | null
    hasInvitation: boolean
    isLoading: boolean
    invitation: Invitation | null
    error: string | null
}

/**
 * Hook to manage invitation context throughout the auth flow
 * Useful for invitation-only sign-up flows
 */
export function useInvitationContext(): InvitationContext {
    const {
        hooks: { useInvitation },
        localization
    } = useContext(AuthUIContext)

    const [invitationId, setInvitationId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const id = getSearchParam("invitationId")
        setInvitationId(id)
    }, [])

    const { data: invitation, isPending } = useInvitation({
        query: invitationId ? { id: invitationId } : undefined
    })

    useEffect(() => {
        if (invitationId && !isPending && !invitation) {
            setError(
                localization.INVITATION_NOT_FOUND || "Invitation not found"
            )
        } else if (invitation) {
            setError(null)
        }
    }, [invitation, isPending, invitationId, localization])

    useEffect(() => {
        if (invitation && invitationId) {
            // Validate invitation
            if (
                invitation.status !== "pending" ||
                new Date(invitation.expiresAt) < new Date()
            ) {
                setError(
                    new Date(invitation.expiresAt) < new Date()
                        ? localization.INVITATION_EXPIRED ||
                              "Invitation expired"
                        : localization.INVITATION_NOT_FOUND ||
                              "Invitation not found"
                )
            }
        }
    }, [invitation, invitationId, localization])

    return {
        invitationId,
        hasInvitation: !!invitationId,
        isLoading: isPending,
        invitation,
        error
    }
}
