"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { type ComponentProps, useContext } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useLang } from "../../../hooks/use-lang"
import { AuthUIContext } from "../../../lib/auth-ui-provider"
import { cn, getLocalizedError } from "../../../lib/utils"
import type { AuthLocalization } from "../../../localization/auth-localization"
import type { Refetch } from "../../../types/refetch"
import { Button } from "../../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "../../ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../../ui/form"
import { Input } from "../../ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../../ui/select"
import type { SettingsCardClassNames } from "../shared/settings-card"

interface CreateAPIKeyDialogProps extends ComponentProps<typeof Dialog> {
    classNames?: SettingsCardClassNames
    localization?: AuthLocalization
    onSuccess: (key: string) => void
    refetch?: Refetch
}

export function CreateAPIKeyDialog({
    classNames,
    localization,
    onSuccess,
    refetch,
    onOpenChange,
    ...props
}: CreateAPIKeyDialogProps) {
    const {
        authClient,
        apiKey,
        localization: contextLocalization,
        toast
    } = useContext(AuthUIContext)

    localization = { ...contextLocalization, ...localization }

    const { lang } = useLang()

    const formSchema = z.object({
        name: z
            .string()
            .min(1, `${localization.NAME} ${localization.IS_REQUIRED}`),
        expiresInDays: z.string().optional()
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            expiresInDays: "none"
        }
    })

    const { isSubmitting } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const expiresIn =
                values.expiresInDays && values.expiresInDays !== "none"
                    ? Number.parseInt(values.expiresInDays) * 60 * 60 * 24
                    : undefined

            const result = await authClient.apiKey.create({
                name: values.name,
                expiresIn,
                prefix: typeof apiKey === "object" ? apiKey.prefix : undefined,
                metadata:
                    typeof apiKey === "object" ? apiKey.metadata : undefined,
                fetchOptions: { throw: true }
            })

            await refetch?.()
            onSuccess(result.key)
            onOpenChange?.(false)
            form.reset()
        } catch (error) {
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })
        }
    }

    const rtf = new Intl.RelativeTimeFormat(lang ?? "en")

    return (
        <Dialog onOpenChange={onOpenChange} {...props}>
            <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                className={classNames?.dialog?.content}
            >
                <DialogHeader className={classNames?.dialog?.header}>
                    <DialogTitle
                        className={cn("text-lg md:text-xl", classNames?.title)}
                    >
                        {localization.CREATE_API_KEY}
                    </DialogTitle>

                    <DialogDescription
                        className={cn(
                            "text-xs md:text-sm",
                            classNames?.description
                        )}
                    >
                        {localization.CREATE_API_KEY_DESCRIPTION}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel
                                            className={classNames?.label}
                                        >
                                            {localization.NAME}
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                className={classNames?.input}
                                                placeholder={
                                                    localization.API_KEY_NAME_PLACEHOLDER
                                                }
                                                autoFocus
                                                disabled={isSubmitting}
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="expiresInDays"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className={classNames?.label}
                                        >
                                            {localization.EXPIRES}
                                        </FormLabel>

                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={isSubmitting}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className={
                                                        classNames?.input
                                                    }
                                                >
                                                    <SelectValue
                                                        placeholder={
                                                            localization.NO_EXPIRATION
                                                        }
                                                    />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                <SelectItem value="none">
                                                    {localization.NO_EXPIRATION}
                                                </SelectItem>

                                                {[
                                                    1, 7, 30, 60, 90, 180, 365
                                                ].map((days) => (
                                                    <SelectItem
                                                        key={days}
                                                        value={days.toString()}
                                                    >
                                                        {days === 365
                                                            ? rtf.format(
                                                                  1,
                                                                  "year"
                                                              )
                                                            : rtf.format(
                                                                  days,
                                                                  "day"
                                                              )}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className={classNames?.dialog?.footer}>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange?.(false)}
                                className={cn(
                                    classNames?.button,
                                    classNames?.outlineButton
                                )}
                                disabled={isSubmitting}
                            >
                                {localization.CANCEL}
                            </Button>

                            <Button
                                type="submit"
                                variant="default"
                                className={cn(
                                    classNames?.button,
                                    classNames?.primaryButton
                                )}
                                disabled={isSubmitting}
                            >
                                {isSubmitting && (
                                    <Loader2 className="animate-spin" />
                                )}

                                {localization.CREATE_API_KEY}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
