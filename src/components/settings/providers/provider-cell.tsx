"use client"

import type { SocialProvider } from "better-auth/social-providers"
import { Loader2 } from "lucide-react"
import { useContext, useState } from "react"

import { AuthUIContext } from "../../../lib/auth-ui-provider"
import type { Provider } from "../../../lib/social-providers"
import { cn, getLocalizedError } from "../../../lib/utils"
import type { AuthLocalization } from "../../../localization/auth-localization"
import type { Refetch } from "../../../types/refetch"
import { Button } from "../../ui/button"
import { Card } from "../../ui/card"
import type { SettingsCardClassNames } from "../shared/settings-card"

export interface ProviderCellProps {
    className?: string
    classNames?: SettingsCardClassNames
    account?: { accountId: string; provider: string } | null
    isPending?: boolean
    localization?: Partial<AuthLocalization>
    other?: boolean
    provider: Provider
    refetch?: Refetch
}

export function ProviderCell({
    className,
    classNames,
    account,
    localization,
    other,
    provider,
    refetch
}: ProviderCellProps) {
    const {
        authClient,
        basePath,
        baseURL,
        colorIcons,
        localization: contextLocalization,
        mutators: { unlinkAccount },
        viewPaths,
        toast
    } = useContext(AuthUIContext)

    localization = { ...contextLocalization, ...localization }

    const [isLoading, setIsLoading] = useState(false)

    const handleLink = async () => {
        setIsLoading(true)
        const callbackURL = `${baseURL}${basePath}/${viewPaths.CALLBACK}?redirectTo=${window.location.pathname}`

        try {
            if (other) {
                await authClient.oauth2.link({
                    providerId: provider.provider as SocialProvider,
                    callbackURL,
                    fetchOptions: { throw: true }
                })
            } else {
                await authClient.linkSocial({
                    provider: provider.provider as SocialProvider,
                    callbackURL,
                    fetchOptions: { throw: true }
                })
            }
        } catch (error) {
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })

            setIsLoading(false)
        }
    }

    const handleUnlink = async () => {
        setIsLoading(true)

        try {
            await unlinkAccount({
                accountId: account?.accountId,
                providerId: provider.provider
            })

            await refetch?.()
        } catch (error) {
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })
        }

        setIsLoading(false)
    }

    return (
        <Card
            className={cn(
                "flex-row items-center gap-3 px-4 py-3",
                className,
                classNames?.cell
            )}
        >
            {provider.icon &&
                (colorIcons === true ? (
                    <provider.icon
                        className={cn("size-4", classNames?.icon)}
                        variant="color"
                    />
                ) : colorIcons === false ? (
                    <provider.icon className={cn("size-4", classNames?.icon)} />
                ) : (
                    <>
                        <provider.icon
                            className={cn(
                                "size-4 dark:hidden",
                                classNames?.icon
                            )}
                            variant="color"
                        />
                        <provider.icon
                            className={cn(
                                "hidden size-4 dark:block",
                                classNames?.icon
                            )}
                        />
                    </>
                ))}

            <span className="text-sm">{provider.name}</span>

            <Button
                className={cn("relative ms-auto", classNames?.button)}
                disabled={isLoading}
                size="sm"
                type="button"
                variant={account ? "outline" : "default"}
                onClick={account ? handleUnlink : handleLink}
            >
                {isLoading && <Loader2 className="animate-spin" />}
                {account ? localization.UNLINK : localization.LINK}
            </Button>
        </Card>
    )
}
