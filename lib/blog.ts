/**
 * Server-only blog data layer.
 *
 * Reads MDX post files from `content/blog/` at build time, parses their
 * frontmatter, and exposes typed query helpers. Like `data/content.ts`, this
 * uses Node `fs` and must ONLY be imported by Server Components, Server Actions,
 * or route handlers — never from a file marked `"use client"`. Blog posts are
 * public by design, but keeping the import discipline avoids accidentally
 * pulling `fs` into a client bundle.
 */
import fs from "fs"
import path from "path"
import { cache } from "react"

import matter from "gray-matter"

export interface PostMetadata {
  title: string
  description: string
  /** ISO yyyy-mm-dd publish date */
  date: string
  /** ISO yyyy-mm-dd last-updated date */
  updatedAt?: string
  tags?: string[]
  /** OG image path under /public, e.g. "/blog/foo/cover.png" */
  image?: string
  /** drafts are hidden in production, visible in dev */
  draft?: boolean
}

export interface Post {
  metadata: PostMetadata
  /** filename without the .mdx extension */
  slug: string
  /** raw MDX body (frontmatter stripped) */
  content: string
  /** computed reading time in minutes */
  readMinutes: number
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

/** ~200 wpm; always at least 1 minute. */
function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

/** YAML parses unquoted ISO dates into Date objects — normalize to yyyy-mm-dd. */
function toISODate(value: unknown): string | undefined {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === "string" && value) return value
  return undefined
}

/** Validate required fields and normalize dates, failing the build loudly. */
function normalizeMetadata(
  slug: string,
  data: Record<string, unknown>
): PostMetadata {
  for (const field of ["title", "description"] as const) {
    if (typeof data[field] !== "string" || !data[field]) {
      throw new Error(
        `Blog post "${slug}.mdx" is missing required frontmatter field "${field}".`
      )
    }
  }

  const date = toISODate(data.date)
  if (!date) {
    throw new Error(
      `Blog post "${slug}.mdx" is missing required frontmatter field "date".`
    )
  }

  return {
    title: data.title as string,
    description: data.description as string,
    date,
    updatedAt: toISODate(data.updatedAt),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : undefined,
    image: typeof data.image === "string" ? data.image : undefined,
    draft: data.draft === true,
  }
}

function parsePost(file: string): Post {
  const slug = file.replace(/\.mdx$/, "")
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8")
  const { data, content } = matter(raw)
  return {
    metadata: normalizeMetadata(slug, data),
    slug,
    content,
    readMinutes: readingTime(content),
  }
}

/**
 * All posts, newest first. Drafts are excluded in production builds and
 * included during development so they can be previewed locally.
 *
 * Wrapped in React's `cache()` so the directory read + frontmatter parse runs
 * once per request even though a single page render calls it several times
 * (generateStaticParams, generateMetadata, the page, and the dependent helpers
 * below all funnel through here).
 */
export const getAllPosts = cache((): Post[] => {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map(parsePost)
    .filter(
      (post) => process.env.NODE_ENV !== "production" || !post.metadata.draft
    )
    .sort(
      (a, b) =>
        new Date(b.metadata.date).getTime() -
        new Date(a.metadata.date).getTime()
    )
})

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug)
}

/** The N most recent posts (for the homepage Writing section). */
export function getRecentPosts(limit = 5): Post[] {
  return getAllPosts().slice(0, limit)
}

/** De-duplicated tags with post counts, sorted by frequency then name. */
export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const post of getAllPosts()) {
    for (const tag of post.metadata.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) => post.metadata.tags?.includes(tag))
}
