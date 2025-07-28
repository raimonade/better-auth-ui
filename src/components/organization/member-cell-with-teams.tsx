"use client"

import type { User } from "better-auth"
import type { Member } from "better-auth/plugins/organization"
import {
    EllipsisIcon,
    UserCogIcon,
    UserXIcon,
    ArrowRightLeft
} from "lucide-react"
import { useContext, useState, useEffect } from "react"

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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "../ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../ui/select"
import { UserView } from "../user-view"
import { RemoveMemberDialog } from "./remove-member-dialog"
import { UpdateMemberRoleDialog } from "./update-member-role-dialog"
import { DropdownMenuShortcut } from "../ui/dropdown-menu"

export interface MemberCellWithTeamsProps {
    className?: string
    classNames?: SettingsCardClassNames
    member: Member & { user: Partial<User> }
    localization?: AuthLocalization
    hideActions?: boolean
}

export function MemberCellWithTeams({
    className,
    classNames,
    member,
    localization: localizationProp,
    hideActions
}: MemberCellWithTeamsProps) {
    const {
        organization,
        hooks: { useActiveOrganization, useSession, useListTeams },
        localization: contextLocalization,
        authClient,
        toast
    } = useContext(AuthUIContext)
    const localization = { ...contextLocalization, ...localizationProp }

    const { data: sessionData } = useSession()
    const { data: activeOrganization } = useActiveOrganization()
    const { data: teams } = useListTeams()
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
    const [updateRoleDialogOpen, setUpdateRoleDialogOpen] = useState(false)
    const [moveTeamDialogOpen, setMoveTeamDialogOpen] = useState(false)
    const [selectedTeamId, setSelectedTeamId] = useState("")
    const [isMovingTeam, setIsMovingTeam] = useState(false)

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

    // Find the team this member belongs to by checking team membership
    // Note: This is a simplified approach - in a real app you might want to cache this data
    const [memberTeam, setMemberTeam] = useState<any>(null)
    
    // Check team membership for this user
    useEffect(() => {
        const findMemberTeam = async () => {
            if (!teams || !member.user.id) return
            
            for (const team of teams) {
                try {
                    const teamMembers = await authClient.organization.listTeamMembers({
                        query: { teamId: team.id }
                    })
                    if (teamMembers.data?.some((tm: any) => tm.userId === member.user.id)) {
                        setMemberTeam(team)
                        return
                    }
                } catch (error) {
                    // Team member lookup failed, continue to next team
                }
            }
            setMemberTeam(null)
        }
        
        findMemberTeam()
    }, [teams, member.user.id, authClient])

    const handleMoveToTeam = async () => {
        if (!selectedTeamId && selectedTeamId !== "no-team") return

        setIsMovingTeam(true)
        try {
            // First, remove from current team if they're in one
            if (memberTeam) {
                await authClient.organization.removeTeamMember({
                    teamId: memberTeam.id,
                    userId: member.user.id!
                })
            }

            // Then add to new team if not "no-team"
            if (selectedTeamId !== "no-team") {
                await authClient.organization.addTeamMember({
                    teamId: selectedTeamId,
                    userId: member.user.id!
                })
            }

            const targetTeam =
                selectedTeamId === "no-team"
                    ? localization.NO_TEAM
                    : teams?.find((t) => t.id === selectedTeamId)?.name

            toast({
                variant: "success",
                message: `${localization.MEMBER_MOVED_SUCCESSFULLY} ${targetTeam}`
            })

            setMoveTeamDialogOpen(false)
            setSelectedTeamId("")
            
            // Update the member team state
            if (selectedTeamId === "no-team") {
                setMemberTeam(null)
            } else {
                setMemberTeam(teams?.find((t) => t.id === selectedTeamId))
            }
        } catch (error) {
            toast({
                variant: "error",
                message:
                    (error as Error).message ||
                    localization.FAILED_TO_MOVE_MEMBER
            })
        } finally {
            setIsMovingTeam(false)
        }
    }

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
                    {memberTeam ? (
                        <div className="text-xs text-muted-foreground">
                            Team: {memberTeam.name}
                        </div>
                    ) : (
                        <div className="text-xs text-muted-foreground">
                            {localization.NO_TEAM}
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
                                    onClick={() => setMoveTeamDialogOpen(true)}
                                >
                                    {localization?.MOVE_TO_TEAM}
                                    <DropdownMenuShortcut>
                                        <ArrowRightLeft
                                            className={cn(
                                                "size-3.5 text-neutral-200",
                                                classNames?.icon
                                            )}
                                        />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => setRemoveDialogOpen(true)}
                                    className="text-destructive focus:text-destructive"
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

            <Dialog
                open={moveTeamDialogOpen}
                onOpenChange={setMoveTeamDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{localization.MOVE_TO_TEAM}</DialogTitle>
                        <DialogDescription>
                            Select a team to move{" "}
                            {member.user.name || member.user.email} to.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Select
                            value={selectedTeamId}
                            onValueChange={setSelectedTeamId}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={localization.SELECT_TEAM}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="no-team">
                                    {localization.NO_TEAM}
                                </SelectItem>
                                {teams?.map((team) => (
                                    <SelectItem key={team.id} value={team.id}>
                                        {team.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setMoveTeamDialogOpen(false)}
                                disabled={isMovingTeam}
                            >
                                {localization.CANCEL}
                            </Button>
                            <Button
                                onClick={handleMoveToTeam}
                                disabled={!selectedTeamId || isMovingTeam}
                            >
                                {isMovingTeam ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Moving...
                                    </>
                                ) : (
                                    localization.MOVE_TO_TEAM
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
