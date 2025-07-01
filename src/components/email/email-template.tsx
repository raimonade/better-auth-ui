import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Tailwind,
    Text
} from "@react-email/components"
import type { ReactNode } from "react"

import { cn } from "../../lib/utils"

// --- Common Constants ---
export const brandColor = "#2b7fff"
export const companyName = "Better Auth"

// --- Common Helper Functions ---
export const formatDate = (dateString: string): string => {
    try {
        const date = new Date(`${dateString}T00:00:00Z`) // Assume UTC if no timezone
        if (Number.isNaN(date.getTime())) {
            return dateString // Return original if invalid
        }
        return date.toLocaleDateString("en-CA") // YYYY-MM-DD format
    } catch (e) {
        console.error("Error formatting date:", dateString, e)
        return dateString // Return original on error
    }
}

export interface EmailTemplateClassNames {
    body?: string
    button?: string
    container?: string
    image?: string
    content?: string
    footer?: string
    heading?: string
    hr?: string
    link?: string
}

export interface EmailTemplateProps {
    classNames?: EmailTemplateClassNames
    action?: string
    /** @default process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL */
    baseUrl?: string
    content: ReactNode
    heading: ReactNode
    /** @default `${baseUrl}/apple-touch-icon.png` */
    imageUrl?: string
    preview?: string
    /** @default process.env.SITE_NAME || process.env.NEXT_PUBLIC_SITE_NAME */
    siteName?: string
    url?: string
    /** @default "modern" */
    variant?: "modern" | "vercel"
    userName?: string
    includeCtaButton?: boolean
}

export const EmailTemplate = ({
    classNames,
    action,
    baseUrl,
    content,
    heading,
    imageUrl,
    preview,
    siteName,
    variant = "modern",
    url,
    userName = "there",
    includeCtaButton = true
}: EmailTemplateProps) => {
    baseUrl =
        baseUrl || process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL
    imageUrl = imageUrl || `${baseUrl}/apple-touch-icon.png`
    siteName =
        siteName ||
        process.env.SITE_NAME ||
        process.env.NEXT_PUBLIC_SITE_NAME ||
        companyName
    preview =
        preview ||
        (typeof heading === "string" ? heading : "Email from " + siteName)

    if (variant === "modern") {
        return (
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: brandColor
                            }
                        }
                    }
                }}
            >
                <Html lang="en">
                    <Head>
                        <title>{preview}</title>
                        <meta name="x-apple-disable-message-reformatting" />
                        <meta content="light dark" name="color-scheme" />
                        <meta
                            content="light dark"
                            name="supported-color-schemes"
                        />
                    </Head>
                    <Preview>{preview}</Preview>

                    <Body
                        className={cn(
                            "mx-auto my-auto bg-gray-100 font-sans",
                            classNames?.body
                        )}
                    >
                        <Container
                            className={cn(
                                "mx-auto my-[40px] w-full max-w-[700px] rounded border border-solid border-gray-200 bg-white p-[20px] md:p-[32px]",
                                classNames?.container
                            )}
                        >
                            {/* Logo Section */}
                            <Section className="mb-6">
                                <Img
                                    alt={siteName}
                                    className={cn(
                                        "mx-auto h-12 w-auto",
                                        classNames?.image
                                    )}
                                    src={imageUrl}
                                />
                            </Section>

                            <Heading
                                className={cn(
                                    "mx-0 mb-[30px] mt-8 p-0 text-left text-[24px] font-semibold text-black",
                                    classNames?.heading
                                )}
                            >
                                {heading}
                            </Heading>

                            <Text className="text-[14px] leading-[24px] text-black">
                                Hi {userName},
                            </Text>

                            <Text
                                className={cn(
                                    "text-[14px] leading-[24px] text-black",
                                    classNames?.content
                                )}
                            >
                                {content}
                            </Text>

                            {/* CTA Button Section (conditional) */}
                            {includeCtaButton && action && url && (
                                <Section className="my-[32px] text-center">
                                    <Button
                                        href={url}
                                        className={cn(
                                            "rounded-md bg-brand px-5 py-3 text-center text-[14px] font-semibold text-white no-underline",
                                            classNames?.button
                                        )}
                                    >
                                        {action}
                                    </Button>
                                </Section>
                            )}

                            {/* Footer */}
                            <Text className="text-center text-[12px] leading-[24px] text-gray-500">
                                Need help? Visit our support center or contact
                                us directly.
                            </Text>

                            <Hr
                                className={cn(
                                    "mx-0 my-[26px] w-full border border-solid border-gray-300",
                                    classNames?.hr
                                )}
                            />

                            <Text
                                className={cn(
                                    "text-center text-[12px] leading-[24px] text-gray-500",
                                    classNames?.footer
                                )}
                            >
                                © {new Date().getFullYear()} {siteName} | All
                                Rights Reserved
                                {baseUrl && (
                                    <>
                                        {" | "}
                                        <Link
                                            className={cn(
                                                "text-gray-500 no-underline",
                                                classNames?.link
                                            )}
                                            href={baseUrl}
                                        >
                                            {baseUrl
                                                ?.replace("https://", "")
                                                .replace("http://", "")}
                                        </Link>
                                    </>
                                )}
                            </Text>

                            {/* Trick to potentially prevent Gmail clipping */}
                            <Text
                                style={{
                                    fontSize: "1px",
                                    color: "transparent",
                                    height: "1px",
                                    opacity: 0,
                                    lineHeight: "1px"
                                }}
                            >
                                {/* String of zero-width non-joiners */}
                                {Array(20).fill("\u200C").join("")}
                            </Text>
                        </Container>
                    </Body>
                </Html>
            </Tailwind>
        )
    }

    // Legacy "vercel" variant for backward compatibility
    return (
        <Html>
            <Head>
                <meta name="x-apple-disable-message-reformatting" />
                <meta content="light dark" name="color-scheme" />
                <meta content="light dark" name="supported-color-schemes" />

                <style type="text/css">
                    {`
                        :root {
                            color-scheme: light dark;
                            supported-color-schemes: light dark;
                        }
                    `}
                </style>

                <style type="text/css">
                    {`      
                        html, body {
                            background-color: #ffffff;
                            color: #000000;
                        }

                        a {
                            color: #000000;
                        }

                        .border-color {
                            border-color: #eaeaea;
                        }

                        .action-button {
                            background-color: #000000 !important;
                            color: #ffffff !important;
                        }

                        @media (prefers-color-scheme: dark) {
                            html, body {
                                background-color: #000000 !important;
                                color: #ffffff !important;
                            }

                            a {
                                color: #ffffff;
                            }

                            .border-color {
                                border-color: #333333 !important;
                            }

                            .action-button {
                                background-color: rgb(38, 38, 38) !important;
                                color: #ffffff !important;
                            }
                        }
                    `}
                </style>
            </Head>

            {preview && <Preview>{preview}</Preview>}

            <Tailwind>
                <Body
                    className={cn(
                        "mx-auto my-auto px-2 font-sans",
                        classNames?.body
                    )}
                >
                    <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-color border-solid p-[20px]">
                        <Section className="mt-[32px]">
                            <Img
                                alt={siteName}
                                className={cn(
                                    "mx-auto my-0 rounded-full",
                                    classNames?.image
                                )}
                                height="40"
                                src={imageUrl}
                                width="40"
                            />
                        </Section>

                        <Heading
                            className={cn(
                                "mx-0 my-[30px] p-0 text-center font-bold text-[24px]",
                                classNames?.heading
                            )}
                        >
                            {heading}
                        </Heading>

                        <Text
                            className={cn(
                                "text-[14px] leading-[24px]",
                                classNames?.content
                            )}
                        >
                            {content}
                        </Text>

                        {action && url && (
                            <Section className="mt-[32px] mb-[32px] text-center">
                                <Button
                                    className={cn(
                                        "action-button rounded px-5 py-3 text-center font-semibold text-[12px] no-underline",
                                        classNames?.button
                                    )}
                                    href={url}
                                >
                                    {action}
                                </Button>
                            </Section>
                        )}

                        <Hr
                            className={cn(
                                "mx-0 my-[26px] w-full border border-color border-solid",
                                classNames?.hr
                            )}
                        />

                        <Text
                            className={cn(
                                "text-[#666666] text-[12px] leading-[24px]",
                                classNames?.footer
                            )}
                        >
                            {siteName && <>{siteName} </>}

                            {baseUrl && (
                                <Link
                                    className={cn(
                                        "no-underline",
                                        classNames?.link
                                    )}
                                    href={baseUrl}
                                >
                                    {baseUrl
                                        ?.replace("https://", "")
                                        .replace("http://", "")}
                                </Link>
                            )}
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}
