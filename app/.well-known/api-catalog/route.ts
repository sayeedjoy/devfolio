import { SITE_URL } from "@/lib/site"

// API catalog per RFC 9727, served at /.well-known/api-catalog. The body is a
// linkset (RFC 9264) whose entries point agents at the OpenAPI description for
// this site's machine-readable endpoints.
//
// Static document, so prerender at build time like rss.xml.
export const dynamic = "force-static"

export function GET() {
  const linkset = {
    linkset: [
      {
        anchor: `${SITE_URL}/`,
        "service-desc": [
          {
            href: `${SITE_URL}/openapi.json`,
            type: "application/openapi+json",
            title: "OpenAPI 3.1 description",
          },
        ],
        "service-doc": [
          {
            href: `${SITE_URL}/llms.txt`,
            type: "text/markdown",
            title: "LLM-friendly site map",
          },
        ],
      },
    ],
  }

  return new Response(JSON.stringify(linkset, null, 2), {
    headers: {
      "Content-Type": "application/linkset+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  })
}
