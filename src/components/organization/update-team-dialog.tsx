"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type ComponentProps, useContext } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn, getLocalizedError } from "../../lib/utils"
import type { AuthLocalization } from "../../localization/auth-localization"
import type { SettingsCardClassNames } from "../settings/shared/settings-card"
import type { Team } from "../../types/team-options"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "../ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../ui/form"
import { Input } from "../ui/input"

export interface UpdateTeamDialogProps
    extends ComponentProps<typeof Dialog> {
    className?: string
    classNames?: SettingsCardClassNames
    team: Team
    localization?: AuthLocalization
}

export function UpdateTeamDialog({
    className,
    classNames,
    team,
    localization: localizationProp,
    onOpenChange,
    ...props
}: UpdateTeamDialogProps) {
    const {
        hooks: { useListTeams },
        localization: contextLocalization,
        mutators: { updateTeam },
        toast
    } = useContext(AuthUIContext)

    const localization = { ...contextLocalization, ...localizationProp }

    const { refetch: refetchTeams } = useListTeams()

    const formSchema = z.object({
        name: z.string().min(1, {
            message: `${localization.TEAM_NAME} ${localization.IS_REQUIRED}`
        })
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        values: {
            name: team.name
        }
    })

    const isSubmitting = form.formState.isSubmitting

    async function onSubmit({ name }: z.infer<typeof formSchema>) {
        try {
            await updateTeam({
                teamId: team.id,
                data: { name }
            })

            await refetchTeams?.()
            onOpenChange?.(false)

            toast({
                variant: "success",
                message: localization.UPDATE_TEAM_SUCCESS
            })
        } catch (error) {
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })
        }
    }

    return (
        <Dialog onOpenChange={onOpenChange} {...props}>
            <DialogContent className={cn("sm:max-w-md", className)}>
                <DialogHeader>
                    <DialogTitle>{localization.UPDATE_TEAM}</DialogTitle>
                    <DialogDescription>
                        {localization.UPDATE_TEAM_DESCRIPTION}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={classNames?.label}>
                                        {localization.TEAM_NAME}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={
                                                localization.TEAM_NAME_PLACEHOLDER
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange?.(false)}
                                disabled={isSubmitting}
                            >
                                {localization.CANCEL}
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {localization.UPDATE_TEAM}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 