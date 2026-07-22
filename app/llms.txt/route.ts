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
  const { name, role } = content.profile

  // Section of markdown links; omitted entirely when there are no items.
  const section = (title: string, lines: string[]) =>
    lines.length ? `\n## ${title}\n\n${lines.join("\n")}\n` : ""

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

> ${role} building products across web, mobile, and backend. Co-founder & ex-CTO of Rumor Scanner. Now building Link Arena.

## Pages

- [Home](${SITE_URL}/): Profile, experience, stack, and contact.
- [About](${SITE_URL}/about): About me, work history, and education.
- [Blog](${SITE_URL}/blog): Writing on engineering and product.
- [Projects](${SITE_URL}/project): Things I've built.
${section("Writing", writing)}${section("Projects", projects)}
## Optional

- [Sitemap](${SITE_URL}/sitemap.xml)
`

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  })
}
