import { ADMIN_ERROR_CODES } from "./admin-error-codes"
import { ANONYMOUS_ERROR_CODES } from "./anonymous-error-codes"
import { API_KEY_ERROR_CODES } from "./api-key-error-codes"
import { BASE_ERROR_CODES } from "./base-error-codes"
import { EMAIL_OTP_ERROR_CODES } from "./email-otp-error-codes"
import { GENERIC_OAUTH_ERROR_CODES } from "./generic-oauth-error-codes"
import { HAVEIBEENPWNED_ERROR_CODES } from "./haveibeenpwned-error-codes"
import { MULTI_SESSION_ERROR_CODES } from "./multi-session-error-codes"
import { ORGANIZATION_ERROR_CODES } from "./organization-error-codes"
import { PASSKEY_ERROR_CODES } from "./passkey-error-codes"
import { PHONE_NUMBER_ERROR_CODES } from "./phone-number-error-codes"
import { STRIPE_ERROR_CODES } from "./stripe-localization"
import { TWO_FACTOR_ERROR_CODES } from "./two-factor-error-codes"
import { USERNAME_ERROR_CODES } from "./username-error-codes"

export const authLocalization = {
    /** @default "Account" */
    ACCOUNT: "Account",

    /** @default "Accounts" */
    ACCOUNTS: "Accounts",

    /** @default "Manage your currently signed in accounts." */
    ACCOUNTS_DESCRIPTION: "Switch between your currently signed in accounts.",

    /** @default "Sign in to an additional account." */
    ACCOUNTS_INSTRUCTIONS: "Sign in to an additional account.",

    /** @default "Add Account" */
    ADD_ACCOUNT: "Add Account",

    /** @default "Add Passkey" */
    ADD_PASSKEY: "Add Passkey",

    /** @default "Already have an account?" */
    ALREADY_HAVE_AN_ACCOUNT: "Already have an account?",

    /** @default "Avatar" */
    AVATAR: "Avatar",

    /** @default "Click on the avatar to upload a custom one from your files." */
    AVATAR_DESCRIPTION:
        "Click on the avatar to upload a custom one from your files.",

    /** @default "An avatar is optional but strongly recommended." */
    AVATAR_INSTRUCTIONS: "An avatar is optional but strongly recommended.",

    /** @default "Backup code is required" */
    BACKUP_CODE_REQUIRED: "Backup code is required",

    /** @default "Backup Codes" */
    BACKUP_CODES: "Backup Codes",

    /** @default "Save these backup codes in a secure place. You can use them to access your account if you lose your two-factor authentication method." */
    BACKUP_CODES_DESCRIPTION:
        "Save these backup codes in a secure place. You can use them to access your account if you lose your two-factor authentication method.",

    /** @default "Backup Code." */
    BACKUP_CODE_PLACEHOLDER: "Backup Code",

    /** @default "Backup Code" */
    BACKUP_CODE: "Backup Code",

    /** @default "Cancel" */
    CANCEL: "Cancel",

    /** @default "Change Password" */
    CHANGE_PASSWORD: "Change Password",

    /** @default "Enter your current password and a new password." */
    CHANGE_PASSWORD_DESCRIPTION:
        "Enter your current password and a new password.",

    /** @default "Please use 8 characters at minimum." */
    CHANGE_PASSWORD_INSTRUCTIONS: "Please use 8 characters at minimum.",

    /** @default "Your password has been changed." */
    CHANGE_PASSWORD_SUCCESS: "Your password has been changed.",

    /** @default "Confirm Password" */
    CONFIRM_PASSWORD: "Confirm Password",

    /** @default "Confirm Password" */
    CONFIRM_PASSWORD_PLACEHOLDER: "Confirm Password",

    /** @default "Confirm password is required" */
    CONFIRM_PASSWORD_REQUIRED: "Confirm password is required",

    /** @default "Continue with Authenticator" */
    CONTINUE_WITH_AUTHENTICATOR: "Continue with Authenticator",

    /** @default "Copied to clipboard" */
    COPIED_TO_CLIPBOARD: "Copied to clipboard",

    /** @default "Copy to clipboard" */
    COPY_TO_CLIPBOARD: "Copy to clipboard",

    /** @default "Copy all codes" */
    COPY_ALL_CODES: "Copy all codes",

    /** @default "Continue" */
    CONTINUE: "Continue",

    /** @default "Current Password" */
    CURRENT_PASSWORD: "Current Password",

    /** @default "Current Password" */
    CURRENT_PASSWORD_PLACEHOLDER: "Current Password",

    /** @default "Current Session" */
    CURRENT_SESSION: "Current Session",

    /** @default "Delete" */
    DELETE: "Delete",

    /** @default "Delete Avatar" */
    DELETE_AVATAR: "Delete Avatar",

    /** @default "Delete Account" */
    DELETE_ACCOUNT: "Delete Account",

    /** @default "Permanently remove your account and all of its contents. This action is not reversible, so please continue with caution." */
    DELETE_ACCOUNT_DESCRIPTION:
        "Permanently remove your account and all of its contents. This action is not reversible, so please continue with caution.",

    /** @default "Please confirm the deletion of your account. This action is not reversible, so please continue with caution." */
    DELETE_ACCOUNT_INSTRUCTIONS:
        "Please confirm the deletion of your account. This action is not reversible, so please continue with caution.",

    /** @default "Please check your email to verify the deletion of your account." */
    DELETE_ACCOUNT_VERIFY:
        "Please check your email to verify the deletion of your account.",

    /** @default "Your account has been deleted." */
    DELETE_ACCOUNT_SUCCESS: "Your account has been deleted.",

    /** @default "Disable Two-Factor" */
    DISABLE_TWO_FACTOR: "Disable Two-Factor",

    /** @default "Choose a provider to login to your account" */
    DISABLED_CREDENTIALS_DESCRIPTION:
        "Choose a provider to login to your account",

    /** @default "Don't have an account?" */
    DONT_HAVE_AN_ACCOUNT: "Don't have an account?",

    /** @default "Done" */
    DONE: "Done",

    /** @default "Email" */
    EMAIL: "Email",

    /** @default "Enter the email address you want to use to log in." */
    EMAIL_DESCRIPTION: "Enter the email address you want to use to log in.",

    /** @default "Please enter a valid email address." */
    EMAIL_INSTRUCTIONS: "Please enter a valid email address.",

    /** @default "Email is the same" */
    EMAIL_IS_THE_SAME: "Email is the same",

    /** @default "m@example.com" */
    EMAIL_PLACEHOLDER: "m@example.com",

    /** @default "Email address is required" */
    EMAIL_REQUIRED: "Email address is required",

    /** @default "Please check your email to verify the change." */
    EMAIL_VERIFY_CHANGE: "Please check your email to verify the change.",

    /** @default "Please check your email for the verification link." */
    EMAIL_VERIFICATION: "Please check your email for the verification link.",

    /** @default "Enable Two-Factor" */
    ENABLE_TWO_FACTOR: "Enable Two-Factor",

    /** @default "is invalid" */
    IS_INVALID: "is invalid",

    /** @default "is required" */
    IS_REQUIRED: "is required",

    /** @default "is the same" */
    IS_THE_SAME: "is the same",

    /** @default "Forgot authenticator?" */
    FORGOT_AUTHENTICATOR: "Forgot authenticator?",

    /** @default "Forgot Password" */
    FORGOT_PASSWORD: "Forgot Password",

    /** @default "Send reset link" */
    FORGOT_PASSWORD_ACTION: "Send reset link",

    /** @default "Enter your email to reset your password" */
    FORGOT_PASSWORD_DESCRIPTION: "Enter your email to reset your password",

    /** @default "Check your email for the password reset link." */
    FORGOT_PASSWORD_EMAIL: "Check your email for the password reset link.",

    /** @default "Forgot your password?" */
    FORGOT_PASSWORD_LINK: "Forgot your password?",

    /** @default "Link" */
    LINK: "Link",

    /** @default "Magic Link" */
    MAGIC_LINK: "Magic Link",

    /** @default "Send magic link" */
    MAGIC_LINK_ACTION: "Send magic link",

    /** @default "Enter your email to receive a magic link" */
    MAGIC_LINK_DESCRIPTION: "Enter your email to receive a magic link",

    /** @default "Check your email for the magic link" */
    MAGIC_LINK_EMAIL: "Check your email for the magic link",

    /** @default "Email Code" */
    EMAIL_OTP: "Email Code",

    /** @default "Send code" */
    EMAIL_OTP_SEND_ACTION: "Send code",

    /** @default "Verify code" */
    EMAIL_OTP_VERIFY_ACTION: "Verify code",

    /** @default "Enter your email to receive a code" */
    EMAIL_OTP_DESCRIPTION: "Enter your email to receive a code",

    /** @default "Please check your email for the verification code." */
    EMAIL_OTP_VERIFICATION_SENT:
        "Please check your email for the verification code.",

    /** @default "Name" */
    NAME: "Name",

    /** @default "Please enter your full name, or a display name." */
    NAME_DESCRIPTION: "Please enter your full name, or a display name.",

    /** @default "Please use 32 characters at maximum." */
    NAME_INSTRUCTIONS: "Please use 32 characters at maximum.",

    /** @default "Name" */
    NAME_PLACEHOLDER: "Name",

    /** @default "New Password" */
    NEW_PASSWORD: "New Password",

    /** @default "New Password" */
    NEW_PASSWORD_PLACEHOLDER: "New Password",

    /** @default "New password is required" */
    NEW_PASSWORD_REQUIRED: "New password is required",

    /** @default "One-Time Password" */
    ONE_TIME_PASSWORD: "One-Time Password",

    /** @default "Or continue with" */
    OR_CONTINUE_WITH: "Or continue with",

    /** @default "Passkey" */
    PASSKEY: "Passkey",

    /** @default "Passkeys" */
    PASSKEYS: "Passkeys",

    /** @default "Manage your passkeys for secure access." */
    PASSKEYS_DESCRIPTION: "Manage your passkeys for secure access.",

    /** @default "Securely access your account without a password." */
    PASSKEYS_INSTRUCTIONS: "Securely access your account without a password.",

    /** @default "Personal Account" */
    PERSONAL_ACCOUNT: "Personal Account",

    /** @default "API Keys" */
    API_KEYS: "API Keys",

    /** @default "Manage your API keys for secure access." */
    API_KEYS_DESCRIPTION: "Manage your API keys for secure access.",

    /** @default "Generate API keys to access your account programmatically." */
    API_KEYS_INSTRUCTIONS:
        "Generate API keys to access your account programmatically.",

    /** @default "Create API Key" */
    CREATE_API_KEY: "Create API Key",

    /** @default "Enter a unique name for your API key to differentiate it from other keys." */
    CREATE_API_KEY_DESCRIPTION:
        "Enter a unique name for your API key to differentiate it from other keys.",

    /** @default "New API Key" */
    API_KEY_NAME_PLACEHOLDER: "New API Key",

    /** @default "API Key Created" */
    API_KEY_CREATED: "API Key Created",

    /** @default "Please copy your API key and store it in a safe place. For security reasons we cannot show it again." */
    CREATE_API_KEY_SUCCESS:
        "Please copy your API key and store it in a safe place. For security reasons we cannot show it again.",

    /** @default "Never Expires" */
    NEVER_EXPIRES: "Never Expires",

    /** @default "Expires" */
    EXPIRES: "Expires",

    /** @default "No Expiration" */
    NO_EXPIRATION: "No Expiration",

    /** @default "Create Organization" */
    CREATE_ORGANIZATION: "Create Organization",

    /** @default "Organization" */
    ORGANIZATION: "Organization",

    /** @default "Name" */
    ORGANIZATION_NAME: "Name",

    /** @default "Acme Inc." */
    ORGANIZATION_NAME_PLACEHOLDER: "Acme Inc.",

    /** @default "This is your organization's visible name." */
    ORGANIZATION_NAME_DESCRIPTION: "This is your organization's visible name.",

    /** @default "Please use 32 characters at maximum." */
    ORGANIZATION_NAME_INSTRUCTIONS: "Please use 32 characters at maximum.",

    /** @default "Slug URL" */
    ORGANIZATION_SLUG: "Slug URL",

    /** @default "This is your organization's URL namespace." */
    ORGANIZATION_SLUG_DESCRIPTION: "This is your organization's URL namespace.",

    /** @default "Please use 48 characters at maximum." */
    ORGANIZATION_SLUG_INSTRUCTIONS: "Please use 48 characters at maximum.",

    /** @default "acme-inc" */
    ORGANIZATION_SLUG_PLACEHOLDER: "acme-inc",

    /** @default "Organization created successfully" */
    CREATE_ORGANIZATION_SUCCESS: "Organization created successfully",

    /** @default "Password" */
    PASSWORD: "Password",

    /** @default "Password" */
    PASSWORD_PLACEHOLDER: "Password",

    /** @default "Password is required" */
    PASSWORD_REQUIRED: "Password is required",

    /** @default "Passwords do not match" */
    PASSWORDS_DO_NOT_MATCH: "Passwords do not match",

    /** @default "Providers" */
    PROVIDERS: "Providers",

    /** @default "Connect your account with a third-party service." */
    PROVIDERS_DESCRIPTION: "Connect your account with a third-party service.",

    /** @default "Recover Account" */
    RECOVER_ACCOUNT: "Recover Account",

    /** @default "Recover account" */
    RECOVER_ACCOUNT_ACTION: "Recover account",

    /** @default "Please enter a backup code to access your account" */
    RECOVER_ACCOUNT_DESCRIPTION:
        "Please enter a backup code to access your account",

    /** @default "Remember me" */
    REMEMBER_ME: "Remember me",

    /** @default "Resend code" */
    RESEND_CODE: "Resend code",

    /** @default "Resend verification email" */
    RESEND_VERIFICATION_EMAIL: "Resend Verification Email",

    /** @default "Reset Password" */
    RESET_PASSWORD: "Reset Password",

    /** @default "Save new password" */
    RESET_PASSWORD_ACTION: "Save new password",

    /** @default "Enter your new password below" */
    RESET_PASSWORD_DESCRIPTION: "Enter your new password below",

    /** @default "Password reset successfully" */
    RESET_PASSWORD_SUCCESS: "Password reset successfully",

    /** @default "Request failed" */
    REQUEST_FAILED: "Request failed",

    /** @default "Revoke" */
    REVOKE: "Revoke",

    /** @default "Delete API Key" */
    DELETE_API_KEY: "Delete API Key",

    /** @default "Are you sure you want to delete this API key?" */
    DELETE_API_KEY_CONFIRM: "Are you sure you want to delete this API key?",

    /** @default "API Key" */
    API_KEY: "API Key",

    /** @default "Sign In" */
    SIGN_IN: "Sign In",

    /** @default "Login" */
    SIGN_IN_ACTION: "Login",

    /** @default "Enter your email below to login to your account" */
    SIGN_IN_DESCRIPTION: "Enter your email below to login to your account",

    /** @default "Enter your username or email below to login to your account" */
    SIGN_IN_USERNAME_DESCRIPTION:
        "Enter your username or email to login to your account",

    /** @default "Sign in with" */
    SIGN_IN_WITH: "Sign in with",

    /** @default "Sign Out" */
    SIGN_OUT: "Sign Out",

    /** @default "Sign Up" */
    SIGN_UP: "Sign Up",

    /** @default "Create an account" */
    SIGN_UP_ACTION: "Create an account",

    /** @default "Enter your information to create an account" */
    SIGN_UP_DESCRIPTION: "Enter your information to create an account",

    /** @default "Check your email for the verification link." */
    SIGN_UP_EMAIL: "Check your email for the verification link.",

    /** @default "Sessions" */
    SESSIONS: "Sessions",

    /** @default "Manage your active sessions and revoke access." */
    SESSIONS_DESCRIPTION: "Manage your active sessions and revoke access.",

    /** @default "Set Password" */
    SET_PASSWORD: "Set Password",

    /** @default "Click the button below to receive an email to set up a password for your account." */
    SET_PASSWORD_DESCRIPTION:
        "Click the button below to receive an email to set up a password for your account.",

    /** @default "Settings" */
    SETTINGS: "Settings",

    /** @default "Save" */
    SAVE: "Save",

    /** @default "Security" */
    SECURITY: "Security",

    /** @default "Switch Account" */
    SWITCH_ACCOUNT: "Switch Account",

    /** @default "Trust this device" */
    TRUST_DEVICE: "Trust this device",

    /** @default "Two-Factor" */
    TWO_FACTOR: "Two-Factor",

    /** @default "Verify code" */
    TWO_FACTOR_ACTION: "Verify code",

    /** @default "Please enter your one-time password to continue" */
    TWO_FACTOR_DESCRIPTION: "Please enter your one-time password to continue",

    /** @default "Add an extra layer of security to your account." */
    TWO_FACTOR_CARD_DESCRIPTION:
        "Add an extra layer of security to your account.",

    /** @default "Please enter your password to disable 2FA." */
    TWO_FACTOR_DISABLE_INSTRUCTIONS:
        "Please enter your password to disable 2FA.",

    /** @default "Please enter your password to enable 2FA" */
    TWO_FACTOR_ENABLE_INSTRUCTIONS: "Please enter your password to enable 2FA.",

    /** @default "Two-factor authentication has been enabled" */
    TWO_FACTOR_ENABLED: "Two-factor authentication has been enabled",

    /** @default "Two-Factor Authentication has been disabled" */
    TWO_FACTOR_DISABLED: "Two-Factor Authentication has been disabled",

    /** @default "Two-Factor Authentication" */
    TWO_FACTOR_PROMPT: "Two-Factor Authentication",

    /** @default "Scan the QR Code with your Authenticator" */
    TWO_FACTOR_TOTP_LABEL: "Scan the QR Code with your Authenticator",

    /** @default "Send verification code" */
    SEND_VERIFICATION_CODE: "Send verification code",

    /** @default "Unlink" */
    UNLINK: "Unlink",

    /** @default "Updated successfully" */
    UPDATED_SUCCESSFULLY: "updated successfully",

    /** @default "Username" */
    USERNAME: "Username",

    /** @default "Enter the username you want to use to log in." */
    USERNAME_DESCRIPTION: "Enter the username you want to use to log in.",

    /** @default "Please use 32 characters at maximum." */
    USERNAME_INSTRUCTIONS: "Please use 32 characters at maximum.",

    /** @default "Username" */
    USERNAME_PLACEHOLDER: "Username",

    /** @default "Username or email" */
    SIGN_IN_USERNAME_PLACEHOLDER: "Username or email",

    /** @default "Verify Your Email" */
    VERIFY_YOUR_EMAIL: "Verify Your Email",

    /** @default "Please verify your email address. Check your inbox for the verification email. If you haven't received the email, click the button below to resend." */
    VERIFY_YOUR_EMAIL_DESCRIPTION:
        "Please verify your email address. Check your inbox for the verification email. If you haven't received the email, click the button below to resend.",

    /** @default "Go back" */
    GO_BACK: "Go back",

    /** @default "Your session is not fresh. Please sign in again." */
    SESSION_NOT_FRESH: "Your session is not fresh. Please sign in again.",

    /** @default "Upload Avatar" */
    UPLOAD_AVATAR: "Upload Avatar",

    /** @default "Logo" */
    LOGO: "Logo",

    /** @default "Click on the logo to upload a custom one from your files." */
    LOGO_DESCRIPTION:
        "Click on the logo to upload a custom one from your files.",

    /** @default "A logo is optional but strongly recommended." */
    LOGO_INSTRUCTIONS: "A logo is optional but strongly recommended.",

    /** @default "Upload" */
    UPLOAD: "Upload",

    /** @default "Upload Logo" */
    UPLOAD_LOGO: "Upload Logo",

    /** @default "Delete Logo" */
    DELETE_LOGO: "Delete Logo",

    /** @default "Privacy Policy" */
    PRIVACY_POLICY: "Privacy Policy",

    /** @default "Terms of Service" */
    TERMS_OF_SERVICE: "Terms of Service",

    /** @default "By continuing, you agree to the" */
    BY_CONTINUING_YOU_AGREE: "By continuing, you agree to the",

    /** @default "User" */
    USER: "User",

    /** @default "Organizations" */
    ORGANIZATIONS: "Organizations",

    /** @default "Manage your organizations and memberships." */
    ORGANIZATIONS_DESCRIPTION: "Manage your organizations and memberships.",

    /** @default "Create an organization to collaborate with other users." */
    ORGANIZATIONS_INSTRUCTIONS:
        "Create an organization to collaborate with other users.",

    /** @default "Leave Organization" */
    LEAVE_ORGANIZATION: "Leave Organization",

    /** @default "Are you sure you want to leave this organization?" */
    LEAVE_ORGANIZATION_CONFIRM:
        "Are you sure you want to leave this organization?",

    /** @default "You have successfully left the organization." */
    LEAVE_ORGANIZATION_SUCCESS: "You have successfully left the organization.",

    /** @default "Manage Organization" */
    MANAGE_ORGANIZATION: "Manage Organization",

    /** @default "Remove Member" */
    REMOVE_MEMBER: "Remove Member",

    /** @default "Are you sure you want to remove this member from the organization?" */
    REMOVE_MEMBER_CONFIRM:
        "Are you sure you want to remove this member from the organization?",

    /** @default "Member removed successfully" */
    REMOVE_MEMBER_SUCCESS: "Member removed successfully",

    /** @default "Invite Member" */
    INVITE_MEMBER: "Invite Member",

    /** @default "Members" */
    MEMBERS: "Members",

    /** @default "Add or remove members and manage their roles." */
    MEMBERS_DESCRIPTION: "Add or remove members and manage their roles.",

    /** @default "Invite new members to your organization." */
    MEMBERS_INSTRUCTIONS: "Invite new members to your organization.",

    /** @default "Send an invitation to add a new member to your organization." */
    INVITE_MEMBER_DESCRIPTION:
        "Send an invitation to add a new member to your organization.",

    /** @default "Role" */
    ROLE: "Role",

    /** @default "Select a role" */
    SELECT_ROLE: "Select a role",

    /** @default "Admin" */
    ADMIN: "Admin",

    /** @default "Member" */
    MEMBER: "Member",

    /** @default "Guest" */
    GUEST: "Guest",

    /** @default "Owner" */
    OWNER: "Owner",

    /** @default "Update the role for this member" */
    UPDATE_ROLE_DESCRIPTION: "Update the role for this member",

    /** @default "Update Role" */
    UPDATE_ROLE: "Update Role",

    /** @default "Member role updated successfully" */
    MEMBER_ROLE_UPDATED: "Member role updated successfully",

    /** @default "Send Invitation" */
    SEND_INVITATION: "Send Invitation",

    /** @default "Invitation sent successfully" */
    SEND_INVITATION_SUCCESS: "Invitation sent successfully",

    /** @default "Pending Invitations" */
    PENDING_INVITATIONS: "Pending Invitations",

    /** @default "Manage pending invitations to your organization." */
    PENDING_INVITATIONS_DESCRIPTION:
        "Manage pending invitations to your organization.",

    /** @default "Cancel Invitation" */
    CANCEL_INVITATION: "Cancel Invitation",

    /** @default "Invitation cancelled successfully" */
    INVITATION_CANCELLED: "Invitation cancelled successfully",

    /** @default "Accept Invitation" */
    ACCEPT_INVITATION: "Accept Invitation",

    /** @default "You have been invited to join an organization." */
    ACCEPT_INVITATION_DESCRIPTION:
        "You have been invited to join an organization.",

    /** @default "Invitation accepted successfully" */
    INVITATION_ACCEPTED: "Invitation accepted successfully",

    /** @default "Invitation rejected successfully" */
    INVITATION_REJECTED: "Invitation rejected successfully",

    /** @default "Accept" */
    ACCEPT: "Accept",

    /** @default "Reject" */
    REJECT: "Reject",

    /** @default "This invitation has expired" */
    INVITATION_EXPIRED: "This invitation has expired",

    /** @default "Delete Organization" */
    DELETE_ORGANIZATION: "Delete Organization",

    /** @default "Permanently remove your organization and all of its contents. This action is not reversible — please continue with caution." */
    DELETE_ORGANIZATION_DESCRIPTION:
        "Permanently remove your organization and all of its contents. This action is not reversible — please continue with caution.",

    /** @default "Organization deleted successfully" */
    DELETE_ORGANIZATION_SUCCESS: "Organization deleted successfully",

    /** @default "Enter the organization slug to continue:" */
    DELETE_ORGANIZATION_INSTRUCTIONS:
        "Enter the organization slug to continue:",

    /** @default "Organization slug is required" */
    SLUG_REQUIRED: "Organization slug is required",

    /** @default "The slug does not match" */
    SLUG_DOES_NOT_MATCH: "The slug does not match",

    /** @default "Teams" */
    TEAMS: "Teams",

    /** @default "Team" */
    TEAM: "Team",

    /** @default "Create Team" */
    CREATE_TEAM: "Create Team",

    /** @default "Team Name" */
    TEAM_NAME: "Team Name",

    /** @default "Development Team" */
    TEAM_NAME_PLACEHOLDER: "Development Team",

    /** @default "This is your team's visible name." */
    TEAM_NAME_DESCRIPTION: "This is your team's visible name.",

    /** @default "Please use 32 characters at maximum." */
    TEAM_NAME_INSTRUCTIONS: "Please use 32 characters at maximum.",

    /** @default "Team created successfully" */
    CREATE_TEAM_SUCCESS: "Team created successfully",

    /** @default "Manage teams within your organization." */
    TEAMS_DESCRIPTION: "Manage teams within your organization.",

    /** @default "Create teams to organize members within your organization." */
    TEAMS_INSTRUCTIONS:
        "Create teams to organize members within your organization.",

    /** @default "Update Team" */
    UPDATE_TEAM: "Update Team",

    /** @default "Update the name of this team." */
    UPDATE_TEAM_DESCRIPTION: "Update the name of this team.",

    /** @default "Team updated successfully" */
    UPDATE_TEAM_SUCCESS: "Team updated successfully",

    /** @default "Delete Team" */
    DELETE_TEAM: "Delete Team",

    /** @default "Are you sure you want to delete this team?" */
    DELETE_TEAM_CONFIRM: "Are you sure you want to delete this team?",

    /** @default "Permanently remove this team and all of its members. This action is not reversible." */
    DELETE_TEAM_DESCRIPTION:
        "Permanently remove this team and all of its members. This action is not reversible.",

    /** @default "Team deleted successfully" */
    DELETE_TEAM_SUCCESS: "Team deleted successfully",

    /** @default "Team Members" */
    TEAM_MEMBERS: "Team Members",

    /** @default "Manage members within this team." */
    TEAM_MEMBERS_DESCRIPTION: "Manage members within this team.",

    /** @default "Add members to this team." */
    TEAM_MEMBERS_INSTRUCTIONS: "Add members to this team.",

    /** @default "Add to Team" */
    ADD_TO_TEAM: "Add to Team",

    /** @default "Remove from Team" */
    REMOVE_FROM_TEAM: "Remove from Team",

    /** @default "Select a team" */
    SELECT_TEAM: "Select a team",

    /** @default "Select Team" */
    SELECT_TEAM_LABEL: "Select Team",

    /** @default "Are you sure you want to remove this member from the team?" */
    REMOVE_TEAM_MEMBER_CONFIRM:
        "Are you sure you want to remove this member from the team?",

    /** @default "Member removed from team successfully" */
    REMOVE_TEAM_MEMBER_SUCCESS: "Member removed from team successfully",

    /** @default "Member added to team successfully" */
    ADD_TEAM_MEMBER_SUCCESS: "Member added to team successfully",

    /** @default "Optional" */
    OPTIONAL: "Optional",

    /** @default "No team" */
    NO_TEAM: "No team",

    /** @default "Enter email address" */
    ENTER_EMAIL_ADDRESS: "Enter email address",

    /** @default "Email Address" */
    EMAIL_ADDRESS: "Email Address",

    /** @default "Invitation sent successfully" */
    INVITATION_SENT_SUCCESSFULLY: "Invitation sent successfully",

    /** @default "Failed to send invitation" */
    FAILED_TO_SEND_INVITATION: "Failed to send invitation",

    /** @default "Member removed successfully" */
    MEMBER_REMOVED_SUCCESSFULLY: "Member removed successfully",

    /** @default "Failed to remove member" */
    FAILED_TO_REMOVE_MEMBER: "Failed to remove member",

    /** @default "Invite Member to Team" */
    INVITE_MEMBER_TO_TEAM: "Invite Member to Team",

    /** @default "Remove from Organization" */
    REMOVE_FROM_ORGANIZATION: "Remove from Organization",

    /** @default "Sending" */
    SENDING: "Sending",

    /** @default "Search members..." */
    SEARCH_MEMBERS: "Search members...",

    /** @default "Search users..." */
    SEARCH_USERS: "Search users...",

    /** @default "Add to Organization" */
    ADD_TO_ORGANIZATION: "Add to Organization",

    /** @default "Move to Team" */
    MOVE_TO_TEAM: "Move to Team",

    /** @default "Move to Organization" */
    MOVE_TO_ORGANIZATION: "Move to Organization",

    /** @default "Select Organization" */
    SELECT_ORGANIZATION: "Select Organization",

    /** @default "Member moved successfully" */
    MEMBER_MOVED_SUCCESSFULLY: "Member moved successfully",

    /** @default "Failed to move member" */
    FAILED_TO_MOVE_MEMBER: "Failed to move member",

    /** @default "Add Member" */
    ADD_MEMBER: "Add Member",

    /** @default "Search and add existing members to this team" */
    ADD_MEMBER_TO_TEAM_DESCRIPTION:
        "Search and add existing members to this team",

    /** @default "Search and add users to this organization" */
    ADD_MEMBER_TO_ORG_DESCRIPTION: "Search and add users to this organization",

    /** @default "No members found" */
    NO_MEMBERS_FOUND: "No members found",

    /** @default "No users found" */
    NO_USERS_FOUND: "No users found",

    /** @default "Available Members" */
    AVAILABLE_MEMBERS: "Available Members",

    /** @default "Available Users" */
    AVAILABLE_USERS: "Available Users",

    /** @default "Invitation not found" */
    INVITATION_NOT_FOUND: "Invitation not found",

    /** @default "Sign Up to Accept" */
    SIGN_UP_TO_ACCEPT: "Sign Up to Accept",

    /** @default "Sign In to Accept" */
    SIGN_IN_TO_ACCEPT: "Sign In to Accept",

    /** @default "You need to create an account to accept this invitation." */
    SIGN_UP_TO_ACCEPT_INVITATION_DESCRIPTION:
        "You need to create an account to accept this invitation.",

    /** @default "You need to sign in to accept this invitation." */
    SIGN_IN_TO_ACCEPT_INVITATION_DESCRIPTION:
        "You need to sign in to accept this invitation.",

    /** @default "Account created successfully!" */
    ACCOUNT_CREATED_SUCCESSFULLY: "Account created successfully!",

    /** @default "Account created and invitation accepted successfully!" */
    ACCOUNT_CREATED_AND_INVITATION_ACCEPTED:
        "Account created and invitation accepted successfully!",

    /** @default "Organization Invitation" */
    ORGANIZATION_INVITATION: "Organization Invitation",

    /** @default "Organization details will be shown after creating your account" */
    INVITATION_DETAILS_AFTER_SIGNUP:
        "Organization details will be shown after creating your account",

    /** @default "Invalid or expired invitation" */
    INVALID_INVITATION: "Invalid or expired invitation",

    /** @default "Email must match the invitation email" */
    EMAIL_MUST_MATCH_INVITATION: "Email must match the invitation email",

    /** @default "Invalid invitation. Please check your invitation link." */
    INVALID_INVITATION_LINK:
        "Invalid invitation. Please check your invitation link.",

    /** @default "Invitation not found" */
    INVITATION_NOT_FOUND_ERROR: "Invitation not found",

    /** @default "Sign-ups are invitation-only. Please use an invitation link to create an account." */
    SIGN_UP_REQUIRES_INVITATION:
        "Sign-ups are invitation-only. Please use an invitation link to create an account.",

    /** @default "This invitation has already been used or cancelled." */
    INVITATION_ALREADY_USED:
        "This invitation has already been used or cancelled.",

    /** @default "Access Denied" */
    ACCESS_DENIED: "Access Denied",

    /** @default "Validating invitation..." */
    VALIDATING_INVITATION: "Validating invitation...",

    /** @default "Redirecting to sign in..." */
    REDIRECTING_TO_SIGN_IN: "Redirecting to sign in...",

    ...BASE_ERROR_CODES,
    ...ADMIN_ERROR_CODES,
    ...ANONYMOUS_ERROR_CODES,
    ...API_KEY_ERROR_CODES,
    ...EMAIL_OTP_ERROR_CODES,
    ...GENERIC_OAUTH_ERROR_CODES,
    ...HAVEIBEENPWNED_ERROR_CODES,
    ...MULTI_SESSION_ERROR_CODES,
    ...ORGANIZATION_ERROR_CODES,
    ...PASSKEY_ERROR_CODES,
    ...PHONE_NUMBER_ERROR_CODES,
    ...STRIPE_ERROR_CODES,
    ...TWO_FACTOR_ERROR_CODES,
    ...USERNAME_ERROR_CODES
}

export type AuthLocalization = Partial<typeof authLocalization>
