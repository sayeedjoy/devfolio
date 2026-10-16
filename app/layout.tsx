import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import content from "@/data/content"
import { OG_DEFAULTS, RSS_ALTERNATE } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { cn } from "@/lib/utils"

// Home title names the role too, so the entity and the query match.
const siteTitle = `${content.profile.name} — ${content.profile.role}`

export const metadata: Metadata = {
  // Resolves relative URLs (e.g. frontmatter image paths) in page metadata.
  metadataBase: new URL(SITE_URL),
  // Child pages set a plain string title (e.g. "Uses"); the template renders it
  // as "PAGE NAME - Site Title". The home page falls back to `default`.
  title: {
    default: siteTitle,
    template: `%s - ${content.profile.name}`,
  },
  description: content.profile.summary,
  // No canonical here: it would be inherited by not-found and any page that
  // forgets its own. The home page sets "/"; others go through pageMetadata().
  alternates: { types: RSS_ALTERNATE },
  openGraph: {
    ...OG_DEFAULTS,
    title: {
      default: siteTitle,
      template: `%s - ${content.profile.name}`,
    },
    description: content.profile.summary,
    type: "website",
    url: "/",
  },
  // Card type only: Next fills title/description/images from each page's own
  // openGraph, so the home card never leaks onto other pages.
  twitter: { card: "summary_large_image" },
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
