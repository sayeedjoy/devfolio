import type { About } from "./types"

/**
 * Copy for the /about page. Demo values — swap them for your own.
 *
 * `bio` is intentionally separate from `profile.bio`: the home hero wants one
 * tight paragraph, this page wants the long version.
 */
export const about: About = {
  greeting: "Hey I'm Sayeed",
  caption: "That's me",
  bio: [
    [
      "I like to describe myself as an engineer who thinks like a product person.",
    ],
    [
      "Good software isn't only about the code — it's about picking the right problem and shipping something people keep coming back to.",
    ],
    [
      "Over the past few years I've freelanced, worked inside agencies, sat on in-house platform teams and, more recently, been the founding engineer on a couple of small products.",
    ],
    [
      "I've taken several 0-to-1 products to production, survived a few rewrites, maintained design systems, shipped marketing sites, mentored juniors and run internal workshops.",
    ],
  ],
  whatIDo: [
    "Product Engineering",
    "API & Platform Design",
    "SaaS Development",
    "Mobile Apps",
  ],
  interests: [
    "AI",
    "Developer Tooling",
    "Design Systems",
    "Cooking",
    "Real Madrid",
  ],
  links: [
    // No `href`: the email row copies through the server action instead of
    // rendering the address. See the server-only boundary in CLAUDE.md.
    { label: "Email", value: "copy address", icon: "email" },
    {
      label: "X (Twitter)",
      value: "@sayeedjoy",
      href: "https://x.com/sayeedjoy",
      icon: "x",
    },
    {
      label: "GitHub",
      value: "@sayeedjoy",
      href: "https://github.com/sayeedjoy",
      icon: "github",
    },
    {
      label: "LinkedIn",
      value: "/in/sayeedjoy",
      href: "https://linkedin.com/in/sayeedjoy",
      icon: "linkedin",
    },
  ],
}
