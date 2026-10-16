import type { ConsoleGreetingProps } from "@/components/console-greeting"
import content from "@/data/content"
import { getAllPosts } from "@/lib/blog"
import { SITE_URL } from "@/lib/site"
import { HOME_STACK_GROUPS } from "@/lib/stackicon"

// Server-only: reads data/content.ts and the blog. Assembles the plain props
// for the <ConsoleGreeting /> client island. Everything here already renders
// somewhere on the site; the email is deliberately absent (the console's
// email() command fetches it on demand through the Server Action).

export function getConsoleGreetingProps(): ConsoleGreetingProps {
  const { profile, about, capabilities, experience, education } = content
  const { stat, testimonial } = capabilities

  const facts: [string, string][] = [
    ["Role", profile.role],
    ["Building", content.ventures.map((v) => v.name).join(", ")],
    ["Shipped", `${stat.value} ${stat.label.toLowerCase()}`],
    ...experience.items
      .slice(0, 1)
      .map((e): [string, string] => [
        "Previously",
        `${e.role}, ${e.company} (${e.range})`,
      ]),
    ...education
      .slice(0, 1)
      .map((school): [string, string] => [
        "Studied",
        `${school.positions[0]?.title ?? ""}, ${school.companyName}`,
      ]),
    ["Focus", about.whatIDo.join(" · ")],
    ["Off-hours", about.interests.join(" · ")],
  ]

  return {
    ...content.consoleGreeting,
    host: new URL(SITE_URL).host,
    siteUrl: SITE_URL,
    name: profile.name,
    summary: profile.summary,
    facts,
    stack: HOME_STACK_GROUPS,
    projects: content.ventures.map(({ name, description, href }) => ({
      name,
      description,
      href,
    })),
    wins: content.achievements.map((a) => a.title),
    posts: getAllPosts()
      .slice(0, 2)
      .map((p) => ({
        title: p.metadata.title,
        date: p.metadata.date,
        url: `${SITE_URL}/blog/${p.slug}`,
      })),
    testimonial: {
      quote: `${testimonial.quote}${testimonial.highlight}.`,
      author: testimonial.author,
      role: testimonial.role,
      org: testimonial.brand,
    },
    links: profile.socials.map(({ label, href }) => ({ label, href })),
  }
}
