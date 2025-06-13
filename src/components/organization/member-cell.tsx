"use client"

import type { User } from "better-auth"
import type { Member } from "better-auth/plugins/organization"
import { EllipsisIcon, UserCogIcon, UserXIcon } from "lucide-react"
import { useContext, useState } from "react"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn } from "../../lib/utils"
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
import { UserView } from "../user-view"
import { RemoveMemberDialog } from "./remove-member-dialog"
import { UpdateMemberRoleDialog } from "./update-member-role-dialog"
import { DropdownMenuShortcut } from "../ui/dropdown-menu"

export interface MemberCellProps {
    className?: string
    classNames?: SettingsCardClassNames
    member: Member & { user: Partial<User> }
    localization?: AuthLocalization
    hideActions?: boolean
}

export function MemberCell({
    className,
    classNames,
    member,
    localization: localizationProp,
    hideActions
}: MemberCellProps) {
    const {
        organization,
        hooks: { useActiveOrganization, useSession, useListTeams },
        localization: contextLocalization
    } = useContext(AuthUIContext)
    const localization = { ...contextLocalization, ...localizationProp }

    const { data: sessionData } = useSession()
    const { data: activeOrganization } = useActiveOrganization()
    const { data: teams } = useListTeams()
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
    const [updateRoleDialogOpen, setUpdateRoleDialogOpen] = useState(false)

    const builtInRoles = [
        { role: "owner", label: localization.OWNER },
        { role: "admin", label: localization.ADMIN },
        { role: "member", label: localization.MEMBER }
    ]

    const myRole = activeOrganization?.members.find(
        (m) => m.user.id === sessionData?.user.id
    )?.role
    const roles = [...builtInRoles, ...(organization?.customRoles || [])]
    const role = roles.find((r) => r.role === member.role)

    // Find the team this member belongs to
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const memberTeam = teams?.find(
        (team: any) => team.id === (member as any).teamId
    )

    return (
        <>
            <Card
                className={cn(
                    "flex-row items-center p-4",
                    className,
                    classNames?.cell
                )}
            >
                <UserView
                    user={member.user}
                    localization={localization}
                    className="flex-1"
                />
                <div className="text-right">
                    <div className="text-sm opacity-70">{role?.label}</div>
                    {memberTeam && (
                        <div className="text-xs text-muted-foreground">
                            Team: {memberTeam.name}
                        </div>
                    )}
                </div>

                {(member.role !== "owner" || myRole === "owner") &&
                    !hideActions && (
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
                                    <EllipsisIcon
                                        className={classNames?.icon}
                                    />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                onCloseAutoFocus={(e) => e.preventDefault()}
                            >
                                <DropdownMenuItem
                                    onClick={() =>
                                        setUpdateRoleDialogOpen(true)
                                    }
                                >
                                    {localization?.UPDATE_ROLE}
                                    <DropdownMenuShortcut>
                                        <UserCogIcon
                                            className={cn(
                                                "size-3.5 text-neutral-200",
                                                classNames?.icon
                                            )}
                                        />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => setRemoveDialogOpen(true)}
                                    variant="destructive"
                                >
                                    {localization?.REMOVE_MEMBER}
                                    <DropdownMenuShortcut>
                                        <UserXIcon
                                            className={cn(
                                                "size-3.5 text-neutral-200",
                                                classNames?.icon
                                            )}
                                        />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
            </Card>

            <RemoveMemberDialog
                open={removeDialogOpen}
                onOpenChange={setRemoveDialogOpen}
                member={member}
                classNames={classNames}
                localization={localization}
            />

            <UpdateMemberRoleDialog
                open={updateRoleDialogOpen}
                onOpenChange={setUpdateRoleDialogOpen}
                member={member}
                classNames={classNames}
                localization={localization}
            />
        </>
    )
}
