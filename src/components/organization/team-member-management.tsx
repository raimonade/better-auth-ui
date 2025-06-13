"use client"

import { useState, useContext, useEffect } from "react"
import {
    AlertTriangle,
    Mail,
    MoreHorizontal,
    Plus,
    Users,
    UserX
} from "lucide-react"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import type { Team } from "../../types/team-options"
import { Button } from "../ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "../ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../ui/select"
import { Separator } from "../ui/separator"
import { UserView } from "../user-view"
import { DropdownMenuShortcut } from "../ui/dropdown-menu"

interface TeamMemberManagementProps {
    team: Team
    className?: string
}

export function TeamMemberManagement({
    team,
    className
}: TeamMemberManagementProps) {
    const {
        hooks: { useActiveOrganization, useHasPermission },
        authClient,
        localization,
        toast
    } = useContext(AuthUIContext)

    const { data: activeOrg } = useActiveOrganization()
    const { data: canInvite, isPending: permissionPending } = useHasPermission({
        permissions: {
            invitation: ["create"]
        }
    })

    const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("member")
    const [isInviting, setIsInviting] = useState(false)
    // Get team members from organization data filtered by teamId
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const teamMembers =
        activeOrg?.members?.filter((member: any) => {
            // Check if member has teamId that matches current team
            return member.teamId === team.id
        }) || []

    const handleInviteToTeam = async () => {
        if (!email.trim()) {
            toast({
                variant: "error",
                message: localization.ENTER_EMAIL_ADDRESS
            })
            return
        }

        setIsInviting(true)
        try {
            // Invite member with specific team assignment
            await authClient.organization.inviteMember({
                email: email.trim(),
                role: role as "member" | "admin" | "owner",
                teamId: team.id,
                organizationId: activeOrg?.id
            })

            toast({
                variant: "success",
                message: localization.INVITATION_SENT_SUCCESSFULLY
            })

            setEmail("")
            setRole("member")
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

    const handleRemoveFromOrganization = async (memberIdOrEmail: string) => {
        try {
            await authClient.organization.removeMember({
                memberIdOrEmail,
                organizationId: activeOrg?.id
            })

            toast({
                variant: "success",
                message: localization.MEMBER_REMOVED_SUCCESSFULLY
            })
        } catch (error: any) {
            toast({
                variant: "error",
                message: error.message || localization.FAILED_TO_REMOVE_MEMBER
            })
        }
    }

    if (permissionPending || !activeOrg) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {localization.TEAM_MEMBERS}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-16 bg-muted rounded" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            {localization.TEAM_MEMBERS}
                        </CardTitle>
                        <CardDescription>
                            {teamMembers.length}{" "}
                            {teamMembers.length === 1 ? "member" : "members"} in{" "}
                            {team.name}
                        </CardDescription>
                    </div>
                    {canInvite?.success && (
                        <Dialog
                            open={inviteDialogOpen}
                            onOpenChange={setInviteDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    {localization.INVITE_MEMBER}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {localization.INVITE_MEMBER_TO_TEAM}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Send an invitation to join {team.name}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="email">
                                            {localization.EMAIL_ADDRESS}
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder={
                                                localization.ENTER_EMAIL_ADDRESS
                                            }
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="role">
                                            {localization.ROLE}
                                        </Label>
                                        <Select
                                            value={role}
                                            onValueChange={setRole}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="member">
                                                    {localization.MEMBER}
                                                </SelectItem>
                                                <SelectItem value="admin">
                                                    {localization.ADMIN}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setInviteDialogOpen(false)
                                            }
                                            disabled={isInviting}
                                        >
                                            {localization.CANCEL}
                                        </Button>
                                        <Button
                                            onClick={handleInviteToTeam}
                                            disabled={
                                                isInviting || !email.trim()
                                            }
                                        >
                                            {isInviting
                                                ? localization.SENDING
                                                : localization.SEND_INVITATION}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {teamMembers.length === 0 ? (
                    <div className="text-center py-8">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                            No team members yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            Invite members to join this team
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {teamMembers.map((member: any) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between p-3 border rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <UserView user={member.user} />
                                    <div>
                                        <p className="font-medium">
                                            {member.user.name ||
                                                member.user.email}
                                        </p>
                                        <p className="text-sm text-muted-foreground capitalize">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleRemoveFromOrganization(
                                                    member.id
                                                )
                                            }
                                            className="text-destructive focus:text-destructive"
                                        >
                                            {
                                                localization.REMOVE_FROM_ORGANIZATION
                                            }
                                            <DropdownMenuShortcut>
                                                <UserX className="size-3.5 text-neutral-200" />
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                    </div>
                )}

                {/* Information about team member management limitations */}
                <Separator className="my-4" />
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                            <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                                Team Member Management
                            </p>
                            <p className="text-amber-700 dark:text-amber-300">
                                Team membership is managed through invitations.
                                To move a member to a different team, remove
                                them from the organization and send a new
                                invitation with the desired team.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default TeamMemberManagement
