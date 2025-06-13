"use client"

import { useState } from "react"
import { useContext } from "react"
import { Plus, Settings, Users } from "lucide-react"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import { Button } from "../ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { CreateTeamDialog } from "./create-team-dialog"
import { TeamCell } from "./team-cell"
import { TeamMemberManagement } from "./team-member-management"

interface EnhancedTeamsCardProps {
    className?: string
}

export function EnhancedTeamsCard({ className }: EnhancedTeamsCardProps) {
    const {
        hooks: { useListTeams, useHasPermission },
        localization
    } = useContext(AuthUIContext)

    const { data: teams, isPending: teamsPending } = useListTeams()
    const { data: canManageTeams, isPending: permissionPending } =
        useHasPermission({
            permissions: {
                team: ["create", "update", "delete"]
            }
        })

    const [selectedTeam, setSelectedTeam] = useState<any>(null)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)

    if (teamsPending || permissionPending) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {localization.TEAMS}
                    </CardTitle>
                    <CardDescription>
                        {localization.TEAMS_DESCRIPTION}
                    </CardDescription>
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
                            {localization.TEAMS}
                        </CardTitle>
                        <CardDescription>
                            {localization.TEAMS_DESCRIPTION}
                        </CardDescription>
                    </div>
                    {canManageTeams?.success && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCreateDialogOpen(true)}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {localization.CREATE_TEAM}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {!teams || teams.length === 0 ? (
                    <div className="text-center py-8">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                            No teams yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {localization.TEAMS_INSTRUCTIONS}
                        </p>
                        {canManageTeams?.success && (
                            <Button onClick={() => setCreateDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                {localization.CREATE_TEAM}
                            </Button>
                        )}
                    </div>
                ) : (
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger
                                value="overview"
                                className="flex items-center gap-2"
                            >
                                <Settings className="h-4 w-4" />
                                Team Management
                            </TabsTrigger>
                            <TabsTrigger
                                value="members"
                                className="flex items-center gap-2"
                                disabled={!selectedTeam}
                            >
                                <Users className="h-4 w-4" />
                                Members{" "}
                                {selectedTeam ? `(${selectedTeam.name})` : ""}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent
                            value="overview"
                            className="space-y-4 mt-4"
                        >
                            <div className="grid gap-3">
                                {teams.map((team: any) => (
                                    <div key={team.id} className="relative">
                                        <TeamCell
                                            team={team}
                                            onTeamSelect={() =>
                                                setSelectedTeam(team)
                                            }
                                            isSelected={
                                                selectedTeam?.id === team.id
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="members" className="mt-4">
                            {selectedTeam ? (
                                <TeamMemberManagement team={selectedTeam} />
                            ) : (
                                <div className="text-center py-8">
                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">
                                        Select a team from the Team Management
                                        tab to view and manage its members.
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </CardContent>

            <CreateTeamDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />
        </Card>
    )
}

export default EnhancedTeamsCard
