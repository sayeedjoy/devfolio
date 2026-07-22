import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/site"

// AI crawlers named explicitly so the policy is auditable at a glance. They are
// currently allowed — this site publishes /llms.txt to be LLM-friendly. To opt a
// bot out, move its name into AI_BOTS_DENIED below.
const AI_BOTS_ALLOWED = [
  "GPTBot", // OpenAI — training
  "OAI-SearchBot", // OpenAI — search index
  "ChatGPT-User", // OpenAI — ChatGPT browsing on user request
  "ClaudeBot", // Anthropic — training
  "Claude-User", // Anthropic — Claude browsing on user request
  "anthropic-ai", // Anthropic — legacy token
  "PerplexityBot", // Perplexity — search index
  "Perplexity-User", // Perplexity — fetch on user request
  "Google-Extended", // Google — Gemini/Vertex training (separate from Googlebot)
  "Applebot-Extended", // Apple — Apple Intelligence training
  "CCBot", // Common Crawl
  "Meta-ExternalAgent", // Meta — AI training/agent
]

// Bots to block site-wide. Empty by default; add a user-agent string to deny it.
const AI_BOTS_DENIED: string[] = [
  // "Bytespider",
]

// Served at /robots.txt.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_BOTS_ALLOWED.map((userAgent) => ({ userAgent, allow: "/" })),
      ...AI_BOTS_DENIED.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
