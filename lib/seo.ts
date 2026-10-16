import type { Metadata } from "next"

import content from "@/data/content"
import { SITE_URL } from "@/lib/site"

// Server-only: reads data/content.ts. Import from Server Components only.

/** Absolute URL for a /public path; already-absolute URLs pass through. */
export function absoluteUrl(src: string): string {
  return /^https?:\/\//.test(src) ? src : `${SITE_URL}${src}`
}

/** Site-wide Open Graph fields every page should carry. */
export const OG_DEFAULTS = {
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
}

export const RSS_ALTERNATE = { "application/rss+xml": `${SITE_URL}/rss.xml` }

/**
 * Metadata for a page below the root. Next replaces `openGraph` and
 * `alternates` whole when a page sets them, so without this every page that
 * sets its own canonical silently drops the root's siteName, locale, fallback
 * image and RSS link — and a page that sets none inherits the home page's
 * og:url. `twitter` is deliberately left out: the root sets only `card`, and
 * Next fills title/description/images from this page's openGraph.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  markdown,
  article,
}: {
  title: string
  description: string
  /** canonical path, e.g. "/blog/my-post" */
  path: string
  /** /public path or absolute URL; falls back to the site OG image */
  image?: string
  /** the page has a markdown twin at `<path>/index.md` */
  markdown?: boolean
  /** marks the page og:type "article" with these fields */
  article?: { publishedTime?: string; modifiedTime?: string; tags?: string[] }
}): Metadata {
  const url = `${SITE_URL}${path}`
  return {
    title,
    description,
    alternates: {
      canonical: url,
      types: {
        ...RSS_ALTERNATE,
        ...(markdown && { "text/markdown": `${url}/index.md` }),
      },
    },
    openGraph: {
      ...OG_DEFAULTS,
      ...(article ? { type: "article", ...article } : { type: "website" }),
      title,
      description,
      url,
      ...(image && { images: [{ url: absoluteUrl(image), alt: title }] }),
    },
  }
}
