"use client"

import { useState, useContext, useMemo } from "react"
import { Search, UserPlus, Loader2 } from "lucide-react"
import type { User } from "better-auth"
import type { Member } from "better-auth/plugins/organization"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import { cn } from "../../lib/utils"
import type { AuthLocalization } from "../../localization/auth-localization"
import type { SettingsCardClassNames } from "../settings/shared/settings-card"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "../ui/dialog"
import { Input } from "../ui/input"
import { UserView } from "../user-view"
import { Card } from "../ui/card"
// import { ScrollArea } from "../ui/scroll-area"

export interface MemberSearchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    searchPlaceholder: string
    onAddMember: (member: Member & { user: Partial<User> }) => Promise<void>
    availableMembers: (Member & { user: Partial<User> })[]
    className?: string
    classNames?: SettingsCardClassNames
    localization?: AuthLocalization
}

export function MemberSearchDialog({
    open,
    onOpenChange,
    title,
    description,
    searchPlaceholder,
    onAddMember,
    availableMembers,
    className,
    classNames,
    localization: localizationProp
}: MemberSearchDialogProps) {
    const { localization: contextLocalization } = useContext(AuthUIContext)
    const localization = { ...contextLocalization, ...localizationProp }

    const [searchQuery, setSearchQuery] = useState("")
    const [addingMemberId, setAddingMemberId] = useState<string | null>(null)

    const filteredMembers = useMemo(() => {
        if (!searchQuery.trim()) return availableMembers

        const query = searchQuery.toLowerCase()
        return availableMembers.filter((member) => {
            const user = member.user
            return (
                user.name?.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query)
            )
        })
    }, [availableMembers, searchQuery])

    const handleAddMember = async (
        member: Member & { user: Partial<User> }
    ) => {
        setAddingMemberId(member.id)
        try {
            await onAddMember(member)
            onOpenChange(false)
            setSearchQuery("")
        } catch (error) {
            // Error handling is done in the parent component
        } finally {
            setAddingMemberId(null)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn("max-w-md", className)}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                        <div className="space-y-2">
                            {filteredMembers.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    {searchQuery.trim()
                                        ? localization.NO_MEMBERS_FOUND
                                        : localization.AVAILABLE_MEMBERS}
                                </div>
                            ) : (
                                filteredMembers.map((member) => (
                                    <Card
                                        key={member.id}
                                        className={cn(
                                            "flex items-center justify-between p-3",
                                            classNames?.cell
                                        )}
                                    >
                                        <UserView
                                            user={member.user}
                                            localization={localization}
                                            className="flex-1"
                                        />
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                handleAddMember(member)
                                            }
                                            disabled={
                                                addingMemberId === member.id
                                            }
                                        >
                                            {addingMemberId === member.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <UserPlus className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
