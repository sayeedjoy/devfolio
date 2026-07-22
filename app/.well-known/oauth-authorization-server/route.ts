import { SITE_URL } from "@/lib/site"

// OAuth 2.0 Authorization Server Metadata per RFC 8414, served at
// /.well-known/oauth-authorization-server. This site has no live OAuth server
// yet; the document is published so agent tooling can discover the issuer and
// the endpoints it would use once auth goes live.
//
// Static document, so prerender at build time like rss.xml.
export const dynamic = "force-static"

export function GET() {
  const metadata = {
    issuer: SITE_URL,
    authorization_endpoint: `${SITE_URL}/oauth/authorize`,
    token_endpoint: `${SITE_URL}/oauth/token`,
    registration_endpoint: `${SITE_URL}/oauth/register`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none"],
    scopes_supported: ["openid", "profile"],
  }

  return new Response(JSON.stringify(metadata, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  })
}
