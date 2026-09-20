/**
 * SINGLE SOURCE OF TRUTH for all portfolio content.
 *
 * The content is split one-file-per-section (see the sibling modules in this
 * folder); this file composes those slices into the typed default export and
 * re-exports the shared types/helpers so `@/data/content` stays the one import
 * surface for the rest of the app.
 *
 * PRIVACY: this file — and every module it imports — is imported ONLY by Server
 * Components (and the email Server Action). It must NEVER be imported into a
 * file marked `"use client"`, and its values must NEVER be exposed via
 * `NEXT_PUBLIC_*` env vars or a public API route. That keeps the raw dataset out
 * of the client JS bundle, so it can't be read from the browser dev tools'
 * Sources/Network tabs.
 *
 * To make it yours: edit the placeholder values in the section files. Keep the
 * import rule.
 */

import { about } from "./about"
import { achievements } from "./achievements"
import { capabilities } from "./capabilities"
import { contact } from "./contact"
import { education } from "./education"
import { experience } from "./experience"
import { personal } from "./personal"
import { profile } from "./profile"
import { stack } from "./stack"
import type { SiteContent } from "./types"
import { ventures } from "./ventures"
import { work } from "./work"

// Re-export the shared types and helpers so existing imports such as
// `import content, { bioText, type Venture } from "@/data/content"` keep working.
export * from "./types"

const content: SiteContent = {
  estYear: "SAYEED JOY",
  profile,
  email: "hello@sayeedjoy.com",
  experience,
  work,
  education,
  stuffIDo:
    "Apps, SaaS, APIs, open source, writing, and more. I love building things that people find useful and delightful.",
  stack,
  ventures,
  achievements,
  personal,
  contact,
  about,
  capabilities,
}

export default content
