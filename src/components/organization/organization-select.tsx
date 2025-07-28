"use client"

import { useCallback, useContext, useMemo, useState } from "react"
import type { ComponentProps } from "react"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import { getLocalizedError } from "../../lib/utils"
import { cn } from "../../lib/utils"
import type { AuthLocalization } from "../../localization/auth-localization"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../ui/select"
import { OrganizationView } from "./organization-view"

export interface OrganizationSelectClassNames {
    base?: string
    trigger?: string
    content?: string
    item?: string
    skeleton?: string
}

export interface OrganizationSelectProps
    extends Omit<ComponentProps<typeof Select>, "onValueChange"> {
    className?: string
    classNames?: OrganizationSelectClassNames
    placeholder?: string
    localization?: AuthLocalization
    onValueChange?: (organizationId: string) => void
}

/**
 * A select dropdown for switching between organizations
 *
 * Only shows actual organizations (no personal accounts)
 * Uses the Select component for a cleaner interface
 */
export function OrganizationSelect({
    className,
    classNames,
    placeholder,
    localization: localizationProp,
    onValueChange,
    disabled,
    ...props
}: OrganizationSelectProps) {
    const {
        authClient,
        hooks: { useActiveOrganization, useListOrganizations },
        localization: contextLocalization,
        toast
    } = useContext(AuthUIContext)

    const localization = useMemo(
        () => ({ ...contextLocalization, ...localizationProp }),
        [contextLocalization, localizationProp]
    )

    const [isChanging, setIsChanging] = useState(false)

    const { data: organizations, isPending: organizationsPending } =
        useListOrganizations()
    const {
        data: activeOrganization,
        isPending: activePending,
        refetch: refetchActiveOrganization
    } = useActiveOrganization()

    const isPending = organizationsPending || activePending || isChanging

    const handleValueChange = useCallback(
        async (organizationId: string) => {
            if (isChanging || organizationId === activeOrganization?.id) return

            setIsChanging(true)

            try {
                onValueChange?.(organizationId)
                await authClient.organization.setActive({
                    organizationId: organizationId,
                    fetchOptions: {
                        
                    }
                })
                await refetchActiveOrganization?.()
            } catch (error) {
                toast({
                    variant: "error",
                    message: getLocalizedError({ error, localization })
                })
            } finally {
                setIsChanging(false)
            }
        },
        [
            isChanging,
            activeOrganization?.id,
            onValueChange,
            authClient,
            refetchActiveOrganization,
            toast,
            localization
        ]
    )

    if (isPending) {
        return (
            <div className={cn("w-full", className, classNames?.base)}>
                <div
                    className={cn(
                        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        classNames?.trigger,
                        classNames?.skeleton
                    )}
                >
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-muted animate-pulse" />
                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    </div>
                </div>
            </div>
        )
    }

    // Filter out organizations that don't exist or don't have a proper structure
    const validOrganizations =
        organizations?.filter((org) => org?.id && org?.name) || []

    if (validOrganizations.length === 0) {
        return (
            <div className={cn("w-full", className, classNames?.base)}>
                <div
                    className={cn(
                        "flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground",
                        classNames?.trigger
                    )}
                >
                    {localization.ORGANIZATIONS || "No organizations"}
                </div>
            </div>
        )
    }

    return (
        <Select
            value={activeOrganization?.id || ""}
            onValueChange={handleValueChange}
            disabled={disabled || isChanging}
            {...props}
        >
            <SelectTrigger
                className={cn(
                    "w-full",
                    className,
                    classNames?.base,
                    classNames?.trigger
                )}
            >
                <SelectValue
                    placeholder={
                        placeholder || localization.SELECT_ORGANIZATION
                    }
                >
                    {activeOrganization && (
                        <OrganizationView
                            organization={activeOrganization}
                            localization={localization}
                            size="sm"
                        />
                    )}
                </SelectValue>
            </SelectTrigger>
            <SelectContent className={classNames?.content}>
                {validOrganizations.map((organization) => (
                    <SelectItem
                        key={organization.id}
                        value={organization.id}
                        className={classNames?.item}
                    >
                        <OrganizationView
                            organization={organization}
                            localization={localization}
                            size="sm"
                        />
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
