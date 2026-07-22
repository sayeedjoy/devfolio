import { getAllPosts, getPostBySlug } from "@/lib/blog"

// Markdown twin of /blog/[slug], served at /blog/[slug]/index.md. Reachable two
// ways: directly, or via content negotiation in middleware.ts (a request to
// /blog/[slug] with `Accept: text/markdown` is rewritten here).
export const dynamicParams = false

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) {
    return new Response("Not found", { status: 404 })
  }

  const { title, description, date, updatedAt, tags } = post.metadata
  const header = [
    `# ${title}`,
    description && `\n> ${description}`,
    `\n_Published ${date}${updatedAt ? ` · Updated ${updatedAt}` : ""}_`,
    tags?.length && `\nTags: ${tags.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n")

  return new Response(`${header}\n\n${post.content.trim()}\n`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  })
}
