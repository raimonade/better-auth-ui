"use client"

import { EllipsisIcon, PencilIcon, Trash2Icon, UsersIcon } from "lucide-react"
import { useContext, useState } from "react"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn } from "../../lib/utils"
import type { AuthLocalization } from "../../localization/auth-localization"
import type { SettingsCardClassNames } from "../settings/shared/settings-card"
import type { Team } from "../../types/team-options"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { DeleteTeamDialog } from "./delete-team-dialog"
import { UpdateTeamDialog } from "./update-team-dialog"

export interface TeamCellProps {
    className?: string
    classNames?: SettingsCardClassNames
    team: Team
    localization?: AuthLocalization
}

export function TeamCell({
    className,
    classNames,
    team,
    localization: localizationProp
}: TeamCellProps) {
    const {
        hooks: { useHasPermission },
        localization: contextLocalization
    } = useContext(AuthUIContext)
    
    const localization = { ...contextLocalization, ...localizationProp }

    const { data: hasUpdatePermission } = useHasPermission({
        permissions: {
            team: ["update"]
        }
    })

    const { data: hasDeletePermission } = useHasPermission({
        permissions: {
            team: ["delete"]
        }
    })

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false)

    const canManage = hasUpdatePermission?.success || hasDeletePermission?.success

    return (
        <>
            <Card
                className={cn(
                    "flex-row items-center p-4",
                    className,
                    classNames?.cell
                )}
            >
                <div className="flex items-center gap-3 flex-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <UsersIcon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium">{team.name}</span>
                        <span className="text-sm text-muted-foreground">
                            {localization.TEAM}
                        </span>
                    </div>
                </div>

                {canManage && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className={cn(
                                    "relative ms-auto",
                                    classNames?.button,
                                    classNames?.outlineButton
                                )}
                                size="icon"
                                type="button"
                                variant="outline"
                            >
                                <EllipsisIcon className={classNames?.icon} />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            onCloseAutoFocus={(e) => e.preventDefault()}
                        >
                            {hasUpdatePermission?.success && (
                                <DropdownMenuItem
                                    onClick={() => setUpdateDialogOpen(true)}
                                >
                                    <PencilIcon className={classNames?.icon} />
                                    {localization?.UPDATE_TEAM}
                                </DropdownMenuItem>
                            )}

                            {hasDeletePermission?.success && (
                                <DropdownMenuItem
                                    onClick={() => setDeleteDialogOpen(true)}
                                    variant="destructive"
                                >
                                    <Trash2Icon className={classNames?.icon} />
                                    {localization?.DELETE_TEAM}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </Card>

            <DeleteTeamDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                team={team}
                classNames={classNames}
                localization={localization}
            />

            <UpdateTeamDialog
                open={updateDialogOpen}
                onOpenChange={setUpdateDialogOpen}
                team={team}
                classNames={classNames}
                localization={localization}
            />
        </>
    )
} 