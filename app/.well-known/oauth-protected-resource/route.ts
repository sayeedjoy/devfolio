import { SITE_URL } from "@/lib/site"

// OAuth 2.0 Protected Resource Metadata per RFC 9728, served at
// /.well-known/oauth-protected-resource. Declares this origin as the protected
// resource and points at the authorization server that would issue tokens for
// it. Published ahead of a live auth server so agents can discover it.
//
// Static document, so prerender at build time like rss.xml.
export const dynamic = "force-static"

export function GET() {
  const metadata = {
    resource: SITE_URL,
    authorization_servers: [SITE_URL],
    bearer_methods_supported: ["header"],
    scopes_supported: ["openid", "profile"],
    resource_documentation: `${SITE_URL}/llms.txt`,
  }

  return new Response(JSON.stringify(metadata, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  })
}
