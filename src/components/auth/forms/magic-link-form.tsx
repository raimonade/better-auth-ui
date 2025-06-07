"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { BetterFetchOption } from "better-auth/react"
import { Loader2 } from "lucide-react"
import { useCallback, useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useIsHydrated } from "../../../hooks/use-hydrated"
import { AuthUIContext } from "../../../lib/auth-ui-provider"
import { cn, getLocalizedError, getSearchParam } from "../../../lib/utils"
import type { AuthLocalization } from "../../../localization/auth-localization"
import { Button } from "../../ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../../ui/form"
import { Input } from "../../ui/input"
import type { AuthFormClassNames } from "../auth-form"

export interface MagicLinkFormProps {
    className?: string
    classNames?: AuthFormClassNames
    callbackURL?: string
    isSubmitting?: boolean
    localization: Partial<AuthLocalization>
    redirectTo?: string
    setIsSubmitting?: (value: boolean) => void
}

export function MagicLinkForm({
    className,
    classNames,
    callbackURL: callbackURLProp,
    isSubmitting,
    localization,
    redirectTo: redirectToProp,
    setIsSubmitting
}: MagicLinkFormProps) {
    const isHydrated = useIsHydrated()

    const {
        authClient,
        basePath,
        baseURL,
        persistClient,
        localization: contextLocalization,
        redirectTo: contextRedirectTo,
        viewPaths,
        toast
    } = useContext(AuthUIContext)

    localization = { ...contextLocalization, ...localization }

    const getRedirectTo = useCallback(
        () =>
            redirectToProp || getSearchParam("redirectTo") || contextRedirectTo,
        [redirectToProp, contextRedirectTo]
    )

    const getCallbackURL = useCallback(
        () =>
            `${baseURL}${
                callbackURLProp ||
                (persistClient
                    ? `${basePath}/${viewPaths.CALLBACK}?redirectTo=${getRedirectTo()}`
                    : getRedirectTo())
            }`,
        [
            callbackURLProp,
            persistClient,
            basePath,
            viewPaths,
            baseURL,
            getRedirectTo
        ]
    )

    const formSchema = z.object({
        email: z
            .string()
            .min(1, {
                message: `${localization.EMAIL} ${localization.IS_REQUIRED}`
            })
            .email({
                message: `${localization.EMAIL} ${localization.IS_INVALID}`
            })
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        }
    })

    isSubmitting = isSubmitting || form.formState.isSubmitting

    useEffect(() => {
        setIsSubmitting?.(form.formState.isSubmitting)
    }, [form.formState.isSubmitting, setIsSubmitting])

    async function sendMagicLink({ email }: z.infer<typeof formSchema>) {
        try {
            await authClient.signIn.magicLink({
                email,
                callbackURL: getCallbackURL(),
                fetchOptions: { throw: true }
            })

            toast({
                variant: "success",
                message: localization.MAGIC_LINK_EMAIL
            })

            form.reset()
        } catch (error) {
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(sendMagicLink)}
                noValidate={isHydrated}
                className={cn("grid w-full gap-6", className, classNames?.base)}
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={classNames?.label}>
                                {localization.EMAIL}
                            </FormLabel>

                            <FormControl>
                                <Input
                                    className={classNames?.input}
                                    type="email"
                                    placeholder={localization.EMAIL_PLACEHOLDER}
                                    disabled={isSubmitting}
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage className={classNames?.error} />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                        "w-full",
                        classNames?.button,
                        classNames?.primaryButton
                    )}
                >
                    {isSubmitting ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        localization.MAGIC_LINK_ACTION
                    )}
                </Button>
            </form>
        </Form>
    )
}
