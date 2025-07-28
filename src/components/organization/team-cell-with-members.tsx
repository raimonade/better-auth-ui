"use client"

import {
    EllipsisIcon,
    PencilIcon,
    Trash2Icon,
    UsersIcon,
    UserX,
    ArrowRightLeft,
    Plus,
    Mail
} from "lucide-react"
import { useContext, useState } from "react"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn } from "../../lib/utils"
import type { AuthLocalization } from "../../localization/auth-localization"
import type { SettingsCardClassNames } from "../settings/shared/settings-card"
import type { Team } from "../../types/team-options"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader } from "../ui/card"
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
import { Input } from "../ui/input"
import { Label } from "../ui/label"

import { DeleteTeamDialog } from "./delete-team-dialog"
import { UpdateTeamDialog } from "./update-team-dialog"
import { Separator } from "../ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenuShortcut } from "../ui/dropdown-menu"
import { MemberSearchDialog } from "./member-search-dialog"

export interface TeamCellWithMembersProps {
    className?: string
    classNames?: SettingsCardClassNames
    team: Team
    localization?: AuthLocalization
}

export function TeamCellWithMembers({
    className,
    classNames,
    team,
    localization: localizationProp
}: TeamCellWithMembersProps) {
    const {
        hooks: { useHasPermission, useActiveOrganization, useListTeams, useListTeamMembers },
        authClient,
        localization: contextLocalization,
        toast
    } = useContext(AuthUIContext)

    const localization = { ...contextLocalization, ...localizationProp }

    const { data: activeOrg } = useActiveOrganization()
    const { data: allTeams } = useListTeams()
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
    const { data: canInvite } = useHasPermission({
        permissions: {
            invitation: ["create"]
        }
    })

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
    const [moveDialogOpen, setMoveDialogOpen] = useState(false)
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
    const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState<any>(null)
    const [selectedTargetTeam, setSelectedTargetTeam] = useState("")
    const [email, setEmail] = useState("")
    const [isMoving, setIsMoving] = useState(false)
    const [isInviting, setIsInviting] = useState(false)

    // Get team members using the new API
    const { data: teamMembers = [] } = useListTeamMembers({
        query: { teamId: team.id }
    })

    // Get available members (org members not in this team) for search dialog
    // This is more complex now - we need to get all org members and filter out team members
    const availableMembers = activeOrg?.members?.filter((member: any) => {
        return !teamMembers.some((tm: any) => tm.userId === member.user?.id)
    }) || []

    const canManage =
        hasUpdatePermission?.success || hasDeletePermission?.success

    const handleRemoveFromTeam = async (teamMember: any) => {
        try {
            // Use the new removeTeamMember API
            await authClient.organization.removeTeamMember({
                teamId: team.id,
                userId: teamMember.userId
            })

            toast({
                variant: "success",
                message: localization.MEMBER_REMOVED_SUCCESSFULLY
            })
        } catch (error: any) {
            // eslint-disable-line @typescript-eslint/no-explicit-any
            toast({
                variant: "error",
                message: error.message || localization.FAILED_TO_REMOVE_MEMBER
            })
        }
    }

    const handleMoveToTeam = async () => {
        if (!selectedMember || !selectedTargetTeam) return

        setIsMoving(true)
        try {
            // Remove from current team
            await authClient.organization.removeTeamMember({
                teamId: team.id,
                userId: selectedMember.userId
            })

            // Add to new team if not "no-team"
            if (selectedTargetTeam !== "no-team") {
                await authClient.organization.addTeamMember({
                    teamId: selectedTargetTeam,
                    userId: selectedMember.userId
                })
            }

            toast({
                variant: "success",
                message: `Member moved to ${selectedTargetTeam === "no-team" ? "no team" : allTeams?.find((t) => t.id === selectedTargetTeam)?.name}`
            })

            setMoveDialogOpen(false)
            setSelectedMember(null)
            setSelectedTargetTeam("")
        } catch (error: any) {
            // eslint-disable-line @typescript-eslint/no-explicit-any
            toast({
                variant: "error",
                message: error.message || "Failed to move member"
            })
        } finally {
            setIsMoving(false)
        }
    }

    const handleAddMemberToTeam = async (member: any) => {
        try {
            // Add member to this team using the new API
            await authClient.organization.addTeamMember({
                teamId: team.id,
                userId: member.user.id
            })

            toast({
                variant: "success",
                message: localization.ADD_TEAM_MEMBER_SUCCESS
            })
        } catch (error: any) {
            toast({
                variant: "error",
                message: error.message || "Failed to add member to team"
            })
            throw error
        }
    }

    const handleInviteToTeam = async () => {
        if (!email.trim()) return

        setIsInviting(true)
        try {
            // First invite to organization
            await authClient.organization.inviteMember({
                email: email.trim(),
                role: "member",
                organizationId: activeOrg?.id
            })

            // Note: In Better Auth 1.3, team assignment happens after the user accepts the invitation
            // You would typically add them to the team after they join the organization

            toast({
                variant: "success",
                message: localization.INVITATION_SENT_SUCCESSFULLY
            })

            setEmail("")
            setInviteDialogOpen(false)
        } catch (error: any) {
            // eslint-disable-line @typescript-eslint/no-explicit-any
            toast({
                variant: "error",
                message: error.message || localization.FAILED_TO_SEND_INVITATION
            })
        } finally {
            setIsInviting(false)
        }
    }

    return (
        <>
            <Card className={cn(className, classNames?.cell)}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                <UsersIcon className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium">{team.name}</span>
                                <span className="text-sm text-muted-foreground">
                                    {teamMembers.length}{" "}
                                    {teamMembers.length === 1
                                        ? "member"
                                        : "members"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {canInvite?.success && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setInviteDialogOpen(true)
                                        }
                                    >
                                        <Mail className="h-4 w-4 mr-1" />
                                        Invite
                                    </Button>
                                    {availableMembers.length > 0 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setAddMemberDialogOpen(true)
                                            }
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            Add Member
                                        </Button>
                                    )}
                                </>
                            )}

                            {canManage && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            className={cn(
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
                                        onCloseAutoFocus={(e) =>
                                            e.preventDefault()
                                        }
                                    >
                                        {hasUpdatePermission?.success && (
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    setUpdateDialogOpen(true)
                                                }
                                            >
                                                {localization?.UPDATE_TEAM}
                                                <DropdownMenuShortcut>
                                                    <PencilIcon
                                                        className={cn(
                                                            "size-3.5 text-neutral-200",
                                                            classNames?.icon
                                                        )}
                                                    />
                                                </DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                        )}

                                        {hasDeletePermission?.success && (
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    setDeleteDialogOpen(true)
                                                }
                                                variant="destructive"
                                            >
                                                {localization?.DELETE_TEAM}
                                                <DropdownMenuShortcut>
                                                    <Trash2Icon
                                                        className={cn(
                                                            "size-3.5 text-neutral-200",
                                                            classNames?.icon
                                                        )}
                                                    />
                                                </DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                </CardHeader>

                {teamMembers.length > 0 && (
                    <CardContent className="pt-0">
                        <Separator className="mb-3" />
                        <div className="space-y-2">
                            {teamMembers.map(
                                (
                                    member: any // eslint-disable-line @typescript-eslint/no-explicit-any
                                ) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between p-2 rounded-lg border bg-muted/30"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={member.user.image}
                                                />
                                                <AvatarFallback>
                                                    {member.user.name?.[0] ||
                                                        member.user
                                                            .email?.[0] ||
                                                        "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {member.user.name ||
                                                        member.user.email}
                                                </p>
                                                <p className="text-xs text-muted-foreground capitalize">
                                                    {member.role}
                                                </p>
                                            </div>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <EllipsisIcon className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedMember(
                                                            member
                                                        )
                                                        setMoveDialogOpen(true)
                                                    }}
                                                >
                                                    Move to Team
                                                    <DropdownMenuShortcut>
                                                        <ArrowRightLeft className="size-3.5 text-neutral-200" />
                                                    </DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleRemoveFromTeam(
                                                            member
                                                        )
                                                    }
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    Remove from Org
                                                    <DropdownMenuShortcut>
                                                        <UserX className="size-3.5 text-neutral-200" />
                                                    </DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )
                            )}
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Move Member Dialog */}
            <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Move Member to Team</DialogTitle>
                        <DialogDescription>
                            Move{" "}
                            {selectedMember?.user.name ||
                                selectedMember?.user.email}{" "}
                            to a different team
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Select
                            value={selectedTargetTeam}
                            onValueChange={setSelectedTargetTeam}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select target team" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="no-team">No team</SelectItem>
                                {allTeams
                                    ?.filter((t) => t.id !== team.id)
                                    .map((targetTeam) => (
                                        <SelectItem
                                            key={targetTeam.id}
                                            value={targetTeam.id}
                                        >
                                            {targetTeam.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setMoveDialogOpen(false)}
                                disabled={isMoving}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleMoveToTeam}
                                disabled={isMoving || !selectedTargetTeam}
                            >
                                {isMoving ? "Moving..." : "Move Member"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Invite to Team Dialog */}
            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite Member to {team.name}</DialogTitle>
                        <DialogDescription>
                            Send an invitation directly to this team
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setInviteDialogOpen(false)}
                                disabled={isInviting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleInviteToTeam}
                                disabled={isInviting || !email.trim()}
                            >
                                {isInviting ? "Sending..." : "Send Invitation"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <MemberSearchDialog
                open={addMemberDialogOpen}
                onOpenChange={setAddMemberDialogOpen}
                title={localization.ADD_MEMBER}
                description={localization.ADD_MEMBER_TO_TEAM_DESCRIPTION}
                searchPlaceholder={localization.SEARCH_MEMBERS}
                onAddMember={handleAddMemberToTeam}
                availableMembers={availableMembers}
                classNames={classNames}
                localization={localization}
            />

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
