"use client"
import { useContext } from "react"

import { AuthUIContext } from "../../../lib/auth-ui-provider"
import { cn } from "../../../lib/utils"
import type { AuthLocalization } from "../../../localization/auth-localization"
import { CardContent } from "../../ui/card"
import { SettingsCard } from "../shared/settings-card"
import type { SettingsCardClassNames } from "../shared/settings-card"
import { AccountCell } from "./account-cell"

export interface AccountsCardProps {
    className?: string
    classNames?: SettingsCardClassNames
    localization?: Partial<AuthLocalization>
}

export function AccountsCard({
    className,
    classNames,
    localization
}: AccountsCardProps) {
    const {
        basePath,
        hooks: { useListDeviceSessions },
        localization: contextLocalization,
        viewPaths,
        navigate
    } = useContext(AuthUIContext)

    localization = { ...contextLocalization, ...localization }

    const { data: deviceSessions, isPending, refetch } = useListDeviceSessions()

    return (
        <SettingsCard
            className={className}
            classNames={classNames}
            title={localization.ACCOUNTS}
            description={localization.ACCOUNTS_DESCRIPTION}
            actionLabel={localization.ADD_ACCOUNT}
            instructions={localization.ACCOUNTS_INSTRUCTIONS}
            isPending={isPending}
            action={() => navigate(`${basePath}/${viewPaths.SIGN_IN}`)}
        >
            {deviceSessions?.length && (
                <CardContent className={cn("grid gap-4", classNames?.content)}>
                    {deviceSessions?.map((deviceSession) => (
                        <AccountCell
                            key={deviceSession.session.id}
                            classNames={classNames}
                            deviceSession={deviceSession}
                            localization={localization}
                            refetch={refetch}
                        />
                    ))}
                </CardContent>
            )}
        </SettingsCard>
    )
}
