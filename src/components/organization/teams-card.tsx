"use client"

import { useContext, useState } from "react"

import { useIsHydrated } from "../../hooks/use-hydrated"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn } from "../../lib/utils"
import { SettingsCard } from "../settings/shared/settings-card"
import type { SettingsCardProps } from "../settings/shared/settings-card"
import { CardContent } from "../ui/card"
import { CreateTeamDialog } from "./create-team-dialog"
import { TeamCellWithMembers } from "./team-cell-with-members"

export function TeamsCard({
    className,
    classNames,
    localization,
    ...props
}: SettingsCardProps) {
    const {
        hooks: { useListTeams, useHasPermission },
        localization: contextLocalization,
        organization
    } = useContext(AuthUIContext)

    localization = { ...contextLocalization, ...localization }

    const isHydrated = useIsHydrated()
    const { data: teams, isPending: teamsPending } = useListTeams()
    const { data: hasPermission, isPending: permissionPending } =
        useHasPermission({
            permissions: {
                team: ["create"]
            }
        })

    const isPending = !isHydrated || teamsPending || permissionPending

    const [createDialogOpen, setCreateDialogOpen] = useState(false)

    // Don't render if teams are not enabled
    if (!organization?.teams?.enabled) {
        return null
    }

    return (
        <>
            <SettingsCard
                className={className}
                classNames={classNames}
                title={localization.TEAMS}
                description={localization.TEAMS_DESCRIPTION}
                instructions={localization.TEAMS_INSTRUCTIONS}
                actionLabel={localization.CREATE_TEAM}
                action={() => setCreateDialogOpen(true)}
                isPending={isPending}
                disabled={!hasPermission?.success}
                {...props}
            >
                {teams && teams?.length > 0 && (
                    <CardContent
                        className={cn("grid gap-4", classNames?.content)}
                    >
                        {teams?.map((team) => (
                            <TeamCellWithMembers
                                key={team.id}
                                classNames={classNames}
                                team={team}
                                localization={localization}
                            />
                        ))}
                    </CardContent>
                )}
            </SettingsCard>

            <CreateTeamDialog
                classNames={classNames}
                localization={localization}
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />
        </>
    )
}
