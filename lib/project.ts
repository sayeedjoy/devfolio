/**
 * Server-only project data layer.
 *
 * Reads MDX project files from `content/project/` at build time, parses their
 * frontmatter, and exposes typed query helpers. Like `lib/blog.ts`, this uses
 * Node `fs` and must ONLY be imported by Server Components, Server Actions, or
 * route handlers — never from a file marked `"use client"`. Projects are public
 * by design, but keeping the import discipline avoids accidentally pulling `fs`
 * into a client bundle.
 */
import fs from "fs"
import path from "path"
import { cache } from "react"

import matter from "gray-matter"

export interface ProjectMetadata {
  title: string
  /** one-line subtitle shown under the title */
  subtitle: string
  /** ISO yyyy-mm-dd date used for ordering, newest first */
  date: string
  /** square icon path under /public, shown on the /project list, e.g. "/projects/foo.png" */
  icon?: string
  /** feature image path under /public, e.g. "/projects/foo/cover.png" */
  image?: string
  /**
   * Screenshot the hover preview shows on the /project list, e.g.
   * "/previews/foo.png". Optional and purely decorative.
   */
  preview?: string
  /** tech stack names — keys of MY_STACKS render with an icon */
  stack: string[]
  /** public live/demo URL */
  liveUrl?: string
  /** public source-code URL */
  githubUrl?: string
  /** drafts are hidden in production, visible in dev */
  draft?: boolean
}

export interface Project {
  metadata: ProjectMetadata
  /** filename without the .mdx extension */
  slug: string
  /** raw MDX body (frontmatter stripped) */
  content: string
}

const PROJECT_DIR = path.join(process.cwd(), "content", "project")

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
): ProjectMetadata {
  for (const field of ["title", "subtitle"] as const) {
    if (typeof data[field] !== "string" || !data[field]) {
      throw new Error(
        `Project "${slug}.mdx" is missing required frontmatter field "${field}".`
      )
    }
  }

  const date = toISODate(data.date)
  if (!date) {
    throw new Error(
      `Project "${slug}.mdx" is missing required frontmatter field "date".`
    )
  }

  return {
    title: data.title as string,
    subtitle: data.subtitle as string,
    date,
    icon: typeof data.icon === "string" ? data.icon : undefined,
    image: typeof data.image === "string" ? data.image : undefined,
    preview: typeof data.preview === "string" ? data.preview : undefined,
    stack: Array.isArray(data.stack) ? (data.stack as string[]) : [],
    liveUrl: typeof data.liveUrl === "string" ? data.liveUrl : undefined,
    githubUrl: typeof data.githubUrl === "string" ? data.githubUrl : undefined,
    draft: data.draft === true,
  }
}

function parseProject(file: string): Project {
  const slug = file.replace(/\.mdx$/, "")
  const raw = fs.readFileSync(path.join(PROJECT_DIR, file), "utf-8")
  const { data, content } = matter(raw)
  return {
    metadata: normalizeMetadata(slug, data),
    slug,
    content,
  }
}

/**
 * All projects, newest first. Drafts are excluded in production builds and
 * included during development so they can be previewed locally.
 *
 * Wrapped in React's `cache()` so the directory read + frontmatter parse runs
 * once per request even though a single page render calls it several times
 * (generateStaticParams, generateMetadata, the page, and getProjectBySlug all
 * funnel through here).
 */
export const getAllProjects = cache((): Project[] => {
  if (!fs.existsSync(PROJECT_DIR)) return []
  return fs
    .readdirSync(PROJECT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map(parseProject)
    .filter(
      (project) =>
        process.env.NODE_ENV !== "production" || !project.metadata.draft
    )
    .sort(
      (a, b) =>
        new Date(b.metadata.date).getTime() -
        new Date(a.metadata.date).getTime()
    )
})

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((project) => project.slug === slug)
}
