/**
 * Shared content types and helpers.
 *
 * PRIVACY: like the rest of `data/`, this module backs the server-only content
 * graph. It only declares types and a pure helper (no secret values), but keep
 * the import rule in mind — content *values* live in the sibling section files
 * and must never reach a `"use client"` module.
 */

// Type-only import: erased at compile time, so it pulls no runtime code from the
// client component and keeps this module off the client bundle's import graph.
import type { ExperienceItemType } from "@/components/work-experience"

export type { ExperienceItemType }

export interface ExperienceItem {
  range: string
  role: string
  company: string
  /** path under /public, e.g. "/logos/foo.png" — shown next to the company */
  logo?: string
  description: string
}

export interface Venture {
  name: string
  description: string
  /** external/live URL — used as the fallback link when `slug` is absent */
  href: string
  /**
   * Slug of the matching MDX project in `content/project/`. When set, the
   * homepage entry links to the internal `/project/<slug>` detail page instead
   * of opening `href` in a new tab.
   */
  slug?: string
  /** path under /public, e.g. "/icons/foo.png" — the square icon on the left */
  icon?: string
  /** path under /public, e.g. "/previews/foo.png" */
  preview?: string
}

export interface StackItem {
  name: string
}

/**
 * A bio is a list of paragraphs; each paragraph is a list of inline segments.
 * Plain strings render as text; objects render as inline chips/links.
 */
export type BioSegment =
  | string
  | { type: "link"; text: string; href: string; logo?: string }
  | { type: "tag"; text: string }

export type BioParagraph = BioSegment[]

/** Flatten a bio paragraph to plain text (for metadata, alt text, etc.). */
export function bioText(paragraph: BioParagraph): string {
  return paragraph
    .map((seg) => (typeof seg === "string" ? seg : seg.text))
    .join("")
}

export interface SocialLink {
  label: string
  href: string
  icon?: "linkedin" | "github"
}

export interface Profile {
  name: string
  role: string
  /** path under /public, e.g. "/avatar.jpg" */
  avatar: string
  /** bio paragraphs; each is a list of inline segments (text/link/tag) */
  bio: BioParagraph[]
  verified: boolean
}

export interface Experience {
  intro: string
  items: ExperienceItem[]
}

export interface Personal {
  intro: string
  // Intrinsic dimensions reserve space for each uncropped photo.
  photos: {
    src: string
    width: number
    height: number
    caption?: string
    title?: string
  }[]
  instagram?: string
  spotify?: string
}

export interface Contact {
  socials: SocialLink[]
  quote: string
}

export interface SiteContent {
  estYear: string
  profile: Profile
  /** consumed server-side / via the getContactEmail server action only */
  email: string
  experience: Experience
  /** Full work history for the dedicated /work page (richer than `experience`). */
  work: ExperienceItemType[]
  /** Education history for the /work page, modeled with the same shape. */
  education: ExperienceItemType[]
  stuffIDo: string
  stack: StackItem[]
  ventures: Venture[]
  personal: Personal
  contact: Contact
}
