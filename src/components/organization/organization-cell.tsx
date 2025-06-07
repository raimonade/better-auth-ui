"use client"

import type { Organization } from "better-auth/plugins/organization"
import { EllipsisIcon, Loader2, LogOutIcon, SettingsIcon } from "lucide-react"
import { useCallback, useContext, useMemo, useState } from "react"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn, getLocalizedError } from "../../lib/utils"
import type { AuthLocalization } from "../../localization/auth-localization"
import type { SettingsCardClassNames } from "../settings/shared/settings-card"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { LeaveOrganizationDialog } from "./leave-organization-dialog"
import { OrganizationView } from "./organization-view"

export interface OrganizationCellProps {
    className?: string
    classNames?: SettingsCardClassNames
    organization: Organization
    localization?: AuthLocalization
}

export function OrganizationCell({
    className,
    classNames,
    organization,
    localization: localizationProp
}: OrganizationCellProps) {
    const {
        authClient,
        basePath,
        hooks: { useActiveOrganization },
        localization: contextLocalization,
        viewPaths,
        navigate,
        toast
    } = useContext(AuthUIContext)

    const localization = useMemo(
        () => ({ ...contextLocalization, ...localizationProp }),
        [contextLocalization, localizationProp]
    )

    const { data: activeOrganization, refetch: refetchActiveOrganization } =
        useActiveOrganization()
    const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false)
    const [isManagingOrganization, setIsManagingOrganization] = useState(false)

    const handleManageOrganization = useCallback(async () => {
        if (activeOrganization?.id === organization.id) {
            navigate(`${basePath}/${viewPaths.ORGANIZATION}`)
            return
        }

        setIsManagingOrganization(true)

        try {
            await authClient.organization.setActive({
                organizationId: organization.id,
                fetchOptions: {
                    throw: true
                }
            })

            await refetchActiveOrganization?.()

            navigate(`${basePath}/${viewPaths.ORGANIZATION}`)
        } catch (error) {
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })
        } finally {
            setIsManagingOrganization(false)
        }
    }, [
        activeOrganization,
        authClient,
        organization.id,
        basePath,
        viewPaths,
        navigate,
        toast,
        localization,
        refetchActiveOrganization
    ])

    return (
        <>
            <Card className={cn("flex-row p-4", className, classNames?.cell)}>
                <OrganizationView
                    organization={organization}
                    localization={localization}
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className={cn(
                                "relative ms-auto",
                                classNames?.button,
                                classNames?.outlineButton
                            )}
                            disabled={isManagingOrganization}
                            size="icon"
                            type="button"
                            variant="outline"
                        >
                            {isManagingOrganization ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <EllipsisIcon className={classNames?.icon} />
                            )}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <DropdownMenuItem
                            onClick={handleManageOrganization}
                            disabled={isManagingOrganization}
                        >
                            <SettingsIcon className={classNames?.icon} />

                            {localization.MANAGE_ORGANIZATION}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setIsLeaveDialogOpen(true)}
                            variant="destructive"
                        >
                            <LogOutIcon className={classNames?.icon} />

                            {localization.LEAVE_ORGANIZATION}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Card>

            <LeaveOrganizationDialog
                open={isLeaveDialogOpen}
                onOpenChange={setIsLeaveDialogOpen}
                organization={organization}
                localization={localization}
            />
        </>
    )
}
