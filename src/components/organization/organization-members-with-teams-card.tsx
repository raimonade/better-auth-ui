"use client"

import { useContext, useEffect, useState } from "react"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn } from "../../lib/utils"
import { SettingsCard } from "../settings/shared/settings-card"
import type { SettingsCardProps } from "../settings/shared/settings-card"
import { CardContent } from "../ui/card"
import { InviteMemberDialog } from "./invite-member-dialog"
import { MemberCell } from "./member-cell"

export function OrganizationMembersWithTeamsCard({
    className,
    classNames,
    localization: localizationProp,
    ...props
}: SettingsCardProps) {
    const {
        basePath,
        hooks: { useActiveOrganization, useHasPermission },
        localization: contextLocalization,
        replace,
        viewPaths,
        authClient,
        toast
    } = useContext(AuthUIContext)

    const localization = { ...contextLocalization, ...localizationProp }

    const {
        data: activeOrganization,
        isPending: organizationPending,
        isRefetching: organizationFetching
    } = useActiveOrganization()

    const { data: hasPermissionInvite, isPending: isPendingInvite } =
        useHasPermission({
            permissions: {
                invitation: ["create"]
            }
        })

    const {
        data: hasPermissionUpdateMember,
        isPending: isPendingUpdateMember
    } = useHasPermission({
        permissions: {
            member: ["update"]
        }
    })

    useEffect(() => {
        if (organizationPending || organizationFetching) return
        if (!activeOrganization) replace(`${basePath}/${viewPaths.SETTINGS}`)
    }, [
        activeOrganization,
        organizationPending,
        organizationFetching,
        basePath,
        replace,
        viewPaths
    ])

    const isPending = isPendingInvite || isPendingUpdateMember

    const members = activeOrganization?.members
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false)

    if (!activeOrganization) {
        return (
            <SettingsCard
                className={className}
                classNames={classNames}
                title={localization.MEMBERS}
                description={localization.MEMBERS_DESCRIPTION}
                instructions={localization.MEMBERS_INSTRUCTIONS}
                actionLabel={localization.INVITE_MEMBER}
                isPending
                {...props}
            />
        )
    }

    return (
        <>
            <SettingsCard
                className={className}
                classNames={classNames}
                title={localization.MEMBERS}
                description={localization.MEMBERS_DESCRIPTION}
                instructions={localization.MEMBERS_INSTRUCTIONS}
                actionLabel={localization.INVITE_MEMBER}
                action={() => setInviteDialogOpen(true)}
                isPending={isPending}
                disabled={!hasPermissionInvite?.success}
                {...props}
            >
                {!isPending && members && members.length > 0 && (
                    <CardContent
                        className={cn("grid gap-4", classNames?.content)}
                    >
                        {members
                            .sort(
                                (a, b) =>
                                    new Date(a.createdAt).getTime() -
                                    new Date(b.createdAt).getTime()
                            )
                            .map((member) => (
                                <MemberCell
                                    key={member.id}
                                    classNames={classNames}
                                    member={member}
                                    localization={localization}
                                    hideActions={
                                        !hasPermissionUpdateMember?.success
                                    }
                                />
                            ))}
                    </CardContent>
                )}
            </SettingsCard>

            <InviteMemberDialog
                open={inviteDialogOpen}
                onOpenChange={setInviteDialogOpen}
                classNames={classNames}
                localization={localization}
            />
        </>
    )
}
