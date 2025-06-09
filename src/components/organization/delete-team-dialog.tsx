"use client"

import { type ComponentProps, useContext, useState } from "react"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn, getLocalizedError } from "../../lib/utils"
import type { AuthLocalization } from "../../localization/auth-localization"
import type { SettingsCardClassNames } from "../settings/shared/settings-card"
import type { Team } from "../../types/team-options"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "../ui/dialog"

export interface DeleteTeamDialogProps
    extends ComponentProps<typeof Dialog> {
    className?: string
    classNames?: SettingsCardClassNames
    team: Team
    localization?: AuthLocalization
}

export function DeleteTeamDialog({
    className,
    classNames,
    team,
    localization: localizationProp,
    onOpenChange,
    ...props
}: DeleteTeamDialogProps) {
    const {
        hooks: { useListTeams },
        localization: contextLocalization,
        mutators: { removeTeam },
        toast
    } = useContext(AuthUIContext)

    const localization = { ...contextLocalization, ...localizationProp }

    const { refetch: refetchTeams } = useListTeams()
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleDelete() {
        setIsDeleting(true)
        
        try {
            await removeTeam({ teamId: team.id })

            await refetchTeams?.()
            onOpenChange?.(false)

            toast({
                variant: "success",
                message: localization.DELETE_TEAM_SUCCESS
            })
        } catch (error) {
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Dialog onOpenChange={onOpenChange} {...props}>
            <DialogContent className={cn("sm:max-w-md", className)}>
                <DialogHeader>
                    <DialogTitle>{localization.DELETE_TEAM}</DialogTitle>
                    <DialogDescription>
                        {localization.DELETE_TEAM_DESCRIPTION}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        {localization.DELETE_TEAM_CONFIRM}
                    </p>
                    <p className="mt-2 font-medium">
                        {team.name}
                    </p>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange?.(false)}
                        disabled={isDeleting}
                    >
                        {localization.CANCEL}
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {localization.DELETE_TEAM}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 