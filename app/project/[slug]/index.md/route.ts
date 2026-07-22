import { getAllProjects, getProjectBySlug } from "@/lib/project"

// Markdown twin of /project/[slug], served at /project/[slug]/index.md. See the
// blog equivalent and middleware.ts for the content-negotiation entry point.
export const dynamicParams = false

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) {
    return new Response("Not found", { status: 404 })
  }

  const { title, subtitle, date, liveUrl, githubUrl } = project.metadata
  const links = [
    liveUrl && `[Live](${liveUrl})`,
    githubUrl && `[Source](${githubUrl})`,
  ].filter(Boolean)
  const header = [
    `# ${title}`,
    subtitle && `\n> ${subtitle}`,
    `\n_${date}_`,
    links.length && `\n${links.join(" · ")}`,
  ]
    .filter(Boolean)
    .join("\n")

  return new Response(`${header}\n\n${project.content.trim()}\n`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  })
}
