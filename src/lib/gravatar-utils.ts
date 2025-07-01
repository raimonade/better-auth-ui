import { sha256 as jsSha256 } from "js-sha256"
import type { GravatarOptions } from "../types/gravatar-options"

/**
 * Generate a Gravatar URL for an email address
 * @param email - Email address
 * @param options - Gravatar options
 * @returns Gravatar URL or null if email is invalid
 */
export function getGravatarUrl(
    email?: string | null,
    options?: GravatarOptions
): string | null {
    if (!email) return null

    try {
        // Normalize email: trim and lowercase
        const normalizedEmail = email.trim().toLowerCase()
        const hash = jsSha256(normalizedEmail)
        const extension = options?.jpg ? ".jpg" : ""
        let url = `https://gravatar.com/avatar/${hash}${extension}`

        const params = new URLSearchParams()

        // Add size parameter
        if (options?.size) {
            params.append(
                "s",
                Math.min(Math.max(options.size, 1), 2048).toString()
            )
        }

        // Add default image parameter
        if (options?.d) {
            params.append("d", options.d)
        }

        // Add force default parameter
        if (options?.forceDefault) {
            params.append("f", "y")
        }

        // Append parameters if any
        const queryString = params.toString()
        if (queryString) {
            url += `?${queryString}`
        }

        return url
    } catch (error) {
        console.error("Error generating Gravatar URL:", error)
        return null
    }
}
