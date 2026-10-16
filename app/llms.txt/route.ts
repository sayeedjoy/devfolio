import content from "@/data/content"
import { getAllPosts } from "@/lib/blog"
import { getAllProjects } from "@/lib/project"
import { SITE_URL } from "@/lib/site"

// Served at /llms.txt — a concise, LLM-friendly map of the site.
// Spec: https://llmstxt.org
//
// Static content (server data + MDX), so prerender at build time like rss.xml.
export const dynamic = "force-static"

export function GET() {
  const { profile, education, experience, ventures, achievements, stack } =
    content
  const { name } = profile

  // Section of markdown links; omitted entirely when there are no items.
  const section = (title: string, lines: string[]) =>
    lines.length ? `\n## ${title}\n\n${lines.join("\n")}\n` : ""

  // Short, self-contained statements answer engines can quote verbatim.
  const facts = [
    ...experience.items.map(
      (e) => `- Experience: ${e.role} at ${e.company} (${e.range})`
    ),
    ...education.flatMap((school) =>
      school.positions.map(
        (p) =>
          `- Education: ${p.title}, ${school.companyName} (${p.employmentPeriod.start}–${p.employmentPeriod.end ?? "present"})`
      )
    ),
    ...ventures.map(
      (v) => `- Building: [${v.name}](${v.href}), ${v.description}`
    ),
    ...achievements.map((a) => `- Achievement: ${a.title}`),
    `- Stack: ${stack.map((s) => s.name).join(", ")}`,
    `- Profiles: ${profile.socials.map((s) => `[${s.label}](${s.href})`).join(", ")}`,
  ]

  // Deep links point at the `.md` twins so agents get clean markdown, not HTML.
  const writing = getAllPosts().map(
    (p) =>
      `- [${p.metadata.title}](${SITE_URL}/blog/${p.slug}/index.md): ${p.metadata.description}`
  )
  const projects = getAllProjects().map(
    (p) =>
      `- [${p.metadata.title}](${SITE_URL}/project/${p.slug}/index.md): ${p.metadata.subtitle}`
  )

  const body = `# ${name}

> ${profile.summary}
${section(`About ${name}`, facts)}
## Pages

- [Home](${SITE_URL}/index.md): Profile, experience, projects, stack, and contact.
- [About](${SITE_URL}/about): Longer bio, what I do, interests, and links.
- [Blog](${SITE_URL}/blog): Writing on engineering and product.
- [Projects](${SITE_URL}/project): Things I've built.
- [Uses](${SITE_URL}/uses): Hardware, software, and editor setup.
${section("Writing", writing)}${section("Projects", projects)}
## Optional

- [RSS feed](${SITE_URL}/rss.xml)
- [Sitemap](${SITE_URL}/sitemap.xml)
`

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  })
}
