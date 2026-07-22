import content, { bioText } from "@/data/content"
import { getAllPosts } from "@/lib/blog"
import { getAllProjects } from "@/lib/project"
import { SITE_URL } from "@/lib/site"

// Markdown twin of the home page, served at /index.md. Reachable directly or via
// content negotiation in proxy.ts (a request to / with `Accept: text/markdown`,
// or /?format=md, is rewritten here). Mirrors the prose/links the HTML renders.
//
// Static content (server data + MDX), so prerender at build time like rss.xml.
export const dynamic = "force-static"

export function GET() {
  const { profile, contact } = content

  // Section of markdown links; omitted entirely when there are no items.
  const section = (title: string, lines: string[]) =>
    lines.length ? `\n## ${title}\n\n${lines.join("\n")}\n` : ""

  const bio = profile.bio.map((p) => bioText(p)).join("\n\n")

  const socials = contact.socials.map((s) => `- [${s.label}](${s.href})`)

  const writing = getAllPosts().map(
    (p) =>
      `- [${p.metadata.title}](${SITE_URL}/blog/${p.slug}): ${p.metadata.description}`
  )
  const projects = getAllProjects().map(
    (p) =>
      `- [${p.metadata.title}](${SITE_URL}/project/${p.slug}): ${p.metadata.subtitle}`
  )

  const body = `# ${profile.name}

> ${profile.role}

${bio}

## Pages

- [Home](${SITE_URL}/): Profile, experience, stack, and contact.
- [About](${SITE_URL}/about): About me, work history, and education.
- [Blog](${SITE_URL}/blog): Writing on engineering and product.
- [Projects](${SITE_URL}/project): Things I've built.
${section("Writing", writing)}${section("Projects", projects)}${section("Connect", socials)}
## Optional

- [llms.txt](${SITE_URL}/llms.txt): LLM-friendly site map.
- [Sitemap](${SITE_URL}/sitemap.xml)
`

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  })
}
