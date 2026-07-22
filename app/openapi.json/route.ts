import content from "@/data/content"
import { SITE_URL } from "@/lib/site"

// Machine-readable OpenAPI 3.1 description of this site's agent-facing,
// non-UI endpoints (markdown twins, llms.txt, feeds, discovery documents).
// Linked from /.well-known/api-catalog (RFC 9727). Served at /openapi.json.
//
// Static document, so prerender at build time like rss.xml.
export const dynamic = "force-static"

export function GET() {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: `${content.profile.name} — Site API`,
      version: "1.0.0",
      description:
        "Read-only, machine-readable representations of this personal site: " +
        "markdown twins of content pages, an LLM-friendly site map, and feeds.",
    },
    servers: [{ url: SITE_URL }],
    paths: {
      "/index.md": {
        get: {
          summary: "Home page as Markdown",
          description:
            "Markdown representation of the home page. Also reachable at / " +
            "with `Accept: text/markdown` or via `/?format=md`.",
          responses: {
            "200": {
              description: "Markdown document",
              content: { "text/markdown": {} },
            },
          },
        },
      },
      "/blog/{slug}/index.md": {
        get: {
          summary: "Blog post as Markdown",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Markdown document",
              content: { "text/markdown": {} },
            },
            "404": { description: "Unknown post" },
          },
        },
      },
      "/project/{slug}/index.md": {
        get: {
          summary: "Project as Markdown",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Markdown document",
              content: { "text/markdown": {} },
            },
            "404": { description: "Unknown project" },
          },
        },
      },
      "/llms.txt": {
        get: {
          summary: "LLM-friendly site map",
          responses: {
            "200": {
              description: "Markdown document",
              content: { "text/markdown": {} },
            },
          },
        },
      },
      "/rss.xml": {
        get: {
          summary: "Blog RSS feed",
          responses: {
            "200": {
              description: "RSS feed",
              content: { "application/xml": {} },
            },
          },
        },
      },
      "/sitemap.xml": {
        get: {
          summary: "Sitemap",
          responses: {
            "200": {
              description: "XML sitemap",
              content: { "application/xml": {} },
            },
          },
        },
      },
    },
  }

  return new Response(JSON.stringify(spec, null, 2), {
    headers: {
      "Content-Type": "application/openapi+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  })
}
