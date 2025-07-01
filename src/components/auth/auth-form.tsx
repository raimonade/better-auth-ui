"use client"

import { useContext, useEffect, useState } from "react"

import { AuthUIContext } from "../../lib/auth-ui-provider"
import type { AuthView } from "../../lib/auth-view-paths"
import { getAuthViewByPath, getSearchParam } from "../../lib/utils"
import type { AuthLocalization } from "../../localization/auth-localization"
import { AuthCallback } from "./auth-callback"
import { EmailOTPForm } from "./forms/email-otp-form"
import { ForgotPasswordForm } from "./forms/forgot-password-form"
import { MagicLinkForm } from "./forms/magic-link-form"
import { RecoverAccountForm } from "./forms/recover-account-form"
import { ResetPasswordForm } from "./forms/reset-password-form"
import { SignInForm } from "./forms/sign-in-form"
import { SignUpForm } from "./forms/sign-up-form"
import { TwoFactorForm } from "./forms/two-factor-form"
import { SignOut } from "./sign-out"

export type AuthFormClassNames = {
    base?: string
    button?: string
    checkbox?: string
    description?: string
    error?: string
    forgotPasswordLink?: string
    icon?: string
    input?: string
    label?: string
    otpInput?: string
    otpInputContainer?: string
    outlineButton?: string
    primaryButton?: string
    providerButton?: string
    qrCode?: string
    secondaryButton?: string
}

export interface AuthFormProps {
    className?: string
    classNames?: AuthFormClassNames
    callbackURL?: string
    isSubmitting?: boolean
    localization?: Partial<AuthLocalization>
    pathname?: string
    redirectTo?: string
    view?: AuthView
    otpSeparators?: 0 | 1 | 2
    setIsSubmitting?: (isSubmitting: boolean) => void
}

export function AuthForm({
    className,
    classNames,
    callbackURL,
    isSubmitting,
    localization,
    pathname,
    redirectTo,
    view,
    otpSeparators = 0,
    setIsSubmitting
}: AuthFormProps) {
    const {
        basePath,
        credentials,
        localization: contextLocalization,
        magicLink,
        emailOTP,
        signUp,
        twoFactor: twoFactorEnabled,
        viewPaths,
        replace,
        hooks: { useInvitation }
    } = useContext(AuthUIContext)

    const signUpEnabled = !!signUp

    localization = { ...contextLocalization, ...localization }

    const path = pathname?.split("/").pop()

    // Check for invitation ID in URL for invitation-only sign-up flows
    const [invitationId, setInvitationId] = useState<string | null>(null)
    const [invitationChecked, setInvitationChecked] = useState(false)

    useEffect(() => {
        const id = getSearchParam("invitationId")
        setInvitationId(id)
        setInvitationChecked(true)
    }, [])

    // Validate invitation if present (only for sign-up view when sign-ups are disabled)
    const shouldValidateInvitation =
        view === "SIGN_UP" && !signUpEnabled && invitationId

    // Only call useInvitation when we actually need to validate
    const invitationQuery = shouldValidateInvitation
        ? { id: invitationId }
        : undefined
    const { data: invitation, isPending: invitationPending } = useInvitation({
        query: invitationQuery
    })

    // Check if invitation is valid
    const isValidInvitation =
        invitation &&
        invitation.status === "pending" &&
        new Date(invitation.expiresAt) > new Date()

    // Handle invalid invitations - redirect with error
    useEffect(() => {
        if (shouldValidateInvitation && !invitationPending && invitationId) {
            if (!invitation) {
                // Invitation not found
                console.error("Invitation not found:", invitationId)
                replace(
                    `${basePath}/${viewPaths.SIGN_IN}?error=invitation_not_found`
                )
                return
            }

            if (invitation.status !== "pending") {
                // Invitation already used or rejected
                console.error("Invitation not pending:", invitation.status)
                replace(
                    `${basePath}/${viewPaths.SIGN_IN}?error=invitation_already_used`
                )
                return
            }

            if (new Date(invitation.expiresAt) <= new Date()) {
                // Invitation expired
                console.error("Invitation expired:", invitation.expiresAt)
                replace(
                    `${basePath}/${viewPaths.SIGN_IN}?error=invitation_expired`
                )
                return
            }
        }
    }, [
        shouldValidateInvitation,
        invitationPending,
        invitationId,
        invitation,
        basePath,
        viewPaths,
        replace
    ])

    useEffect(() => {
        if (path && !getAuthViewByPath(viewPaths, path)) {
            console.error(`Invalid auth view: ${path}`)
            replace(`${basePath}/${viewPaths.SIGN_IN}${window.location.search}`)
        }
    }, [path, viewPaths, basePath, replace])

    view = view || getAuthViewByPath(viewPaths, path) || "SIGN_IN"

    // Redirect to appropriate view based on enabled features
    useEffect(() => {
        // Don't redirect until we've checked for invitations
        if (!invitationChecked) return
        if (shouldValidateInvitation && invitationPending) return

        let isInvalidView = false

        if (
            view === "MAGIC_LINK" &&
            (!magicLink || (!credentials && !emailOTP))
        ) {
            isInvalidView = true
        }

        if (
            view === "EMAIL_OTP" &&
            (!emailOTP || (!credentials && !magicLink))
        ) {
            isInvalidView = true
        }

        // Allow sign-up if:
        // 1. Sign-up is enabled, OR
        // 2. Sign-up is disabled but there's a valid invitation
        if (view === "SIGN_UP" && !signUpEnabled) {
            if (!invitationId || !isValidInvitation) {
                isInvalidView = true
            }
        }

        if (
            !credentials &&
            [
                "SIGN_UP",
                "FORGOT_PASSWORD",
                "RESET_PASSWORD",
                "TWO_FACTOR",
                "RECOVER_ACCOUNT"
            ].includes(view)
        ) {
            isInvalidView = true
        }

        if (
            ["TWO_FACTOR", "RECOVER_ACCOUNT"].includes(view) &&
            !twoFactorEnabled
        ) {
            isInvalidView = true
        }

        if (isInvalidView) {
            replace(`${basePath}/${viewPaths.SIGN_IN}${window.location.search}`)
        }
    }, [
        basePath,
        view,
        viewPaths,
        credentials,
        replace,
        emailOTP,
        signUpEnabled,
        magicLink,
        twoFactorEnabled,
        invitationChecked,
        invitationId,
        isValidInvitation,
        shouldValidateInvitation,
        invitationPending
    ])

    if (view === "SIGN_OUT") return <SignOut />
    if (view === "CALLBACK") return <AuthCallback redirectTo={redirectTo} />

    if (view === "SIGN_IN") {
        return credentials ? (
            <SignInForm
                className={className}
                classNames={classNames}
                localization={localization}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        ) : magicLink ? (
            <MagicLinkForm
                className={className}
                classNames={classNames}
                callbackURL={callbackURL}
                localization={localization}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        ) : emailOTP ? (
            <EmailOTPForm
                className={className}
                classNames={classNames}
                callbackURL={callbackURL}
                localization={localization}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        ) : null
    }

    if (view === "TWO_FACTOR") {
        return (
            <TwoFactorForm
                className={className}
                classNames={classNames}
                localization={localization}
                otpSeparators={otpSeparators}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        )
    }

    if (view === "RECOVER_ACCOUNT") {
        return (
            <RecoverAccountForm
                className={className}
                classNames={classNames}
                localization={localization}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        )
    }

    if (view === "MAGIC_LINK") {
        return (
            <MagicLinkForm
                className={className}
                classNames={classNames}
                callbackURL={callbackURL}
                localization={localization}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        )
    }

    if (view === "EMAIL_OTP") {
        return (
            <EmailOTPForm
                className={className}
                classNames={classNames}
                callbackURL={callbackURL}
                localization={localization}
                redirectTo={redirectTo}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        )
    }

    if (view === "FORGOT_PASSWORD") {
        return (
            <ForgotPasswordForm
                className={className}
                classNames={classNames}
                localization={localization}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
            />
        )
    }

    if (view === "RESET_PASSWORD") {
        return (
            <ResetPasswordForm
                className={className}
                classNames={classNames}
                localization={localization}
            />
        )
    }

    if (view === "SIGN_UP") {
        // Allow sign-up if enabled OR if there's a valid invitation
        const allowSignUp = signUpEnabled || (invitationId && isValidInvitation)

        // Show loading if we're still validating invitation
        if (shouldValidateInvitation && invitationPending) {
            return null // Let the parent component handle loading state
        }

        return (
            allowSignUp && (
                <SignUpForm
                    className={className}
                    classNames={classNames}
                    localization={localization}
                    redirectTo={redirectTo}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                />
            )
        )
    }
}
