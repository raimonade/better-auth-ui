"use client"

import { useContext } from "react"
import { AuthUIContext } from "../../lib/auth-ui-provider"

export function TeamsDebug() {
    const {
        organization,
        hooks: { useActiveOrganization, useListTeams, useHasPermission }
    } = useContext(AuthUIContext)

    const { data: activeOrganization, isPending: orgPending } =
        useActiveOrganization()
    const { data: teams, isPending: teamsPending } = useListTeams()
    const { data: hasCreatePermission, isPending: permissionPending } =
        useHasPermission({
            permissions: {
                team: ["create"]
            }
        })

    return (
        <div className="p-4 border rounded-lg bg-muted">
            <h3 className="font-semibold mb-4">Teams Debug Information</h3>

            <div className="space-y-2 text-sm">
                <div>
                    <strong>Organization Config:</strong>{" "}
                    {organization ? "Enabled" : "Disabled"}
                </div>

                <div>
                    <strong>Teams Config Enabled:</strong>{" "}
                    {organization?.teams?.enabled ? "Yes" : "No"}
                </div>

                <div>
                    <strong>Active Organization:</strong>{" "}
                    {orgPending
                        ? "Loading..."
                        : activeOrganization
                          ? activeOrganization.name
                          : "None"}
                </div>

                <div>
                    <strong>Organization ID:</strong>{" "}
                    {activeOrganization?.id || "N/A"}
                </div>

                <div>
                    <strong>Teams Data:</strong>{" "}
                    {teamsPending
                        ? "Loading..."
                        : teams
                          ? `${teams.length} teams`
                          : "No teams"}
                </div>

                <div>
                    <strong>Create Permission:</strong>{" "}
                    {permissionPending
                        ? "Loading..."
                        : hasCreatePermission?.success
                          ? "Yes"
                          : "No"}
                </div>

                {teams && teams.length > 0 && (
                    <div>
                        <strong>Team Names:</strong>
                        <ul className="ml-4 list-disc">
                            {teams.map((team) => (
                                <li key={team.id}>{team.name}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-4 p-2 bg-background rounded text-xs">
                    <strong>Raw Data:</strong>
                    <pre>
                        {JSON.stringify(
                            {
                                organizationConfig: organization,
                                activeOrganization,
                                teams,
                                hasCreatePermission
                            },
                            null,
                            2
                        )}
                    </pre>
                </div>
            </div>
        </div>
    )
}
