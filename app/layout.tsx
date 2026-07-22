import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import content from "@/data/content"
import { SITE_URL } from "@/lib/site"
import { cn } from "@/lib/utils"

// Concise meta description (kept under ~155 chars for search snippets).
const siteDescription =
  "Software Engineer building for web, mobile, and backend. Co-founder & ex-CTO of Rumor Scanner. Now building Link Arena."

export const metadata: Metadata = {
  // Resolves relative URLs (e.g. frontmatter image paths) in page metadata.
  metadataBase: new URL(SITE_URL),
  // Child pages set a plain string title (e.g. "Uses"); the template renders it
  // as "PAGE NAME - Site Title". The home page falls back to `default`.
  title: {
    default: content.profile.name,
    template: `%s - ${content.profile.name}`,
  },
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: {
    title: {
      default: content.profile.name,
      template: `%s - ${content.profile.name}`,
    },
    description: "building scalable systems",
    type: "website",
    url: "/",
    siteName: content.profile.name,
    locale: "en_US",
    images: [
      {
        url: "/og.webp",
        width: 2400,
        height: 1260,
        alt: `${content.profile.name} — ${content.profile.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${content.profile.name} — ${content.profile.role}`,
    description: siteDescription,
    images: ["/og.webp"],
  },
  robots: { index: true, follow: true },
}

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      {/* suppressHydrationWarning: browser extensions (Grammarly, ColorZilla,
          etc.) inject attributes like `cz-shortcut-listen` onto <body> before
          hydration. The mismatch is external, not from our markup, and this
          only suppresses attribute diffs on <body> itself — not its children. */}
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
