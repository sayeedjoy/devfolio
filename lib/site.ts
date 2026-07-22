/**
 * Site-wide origin used for absolute URLs (metadata, RSS, sitemap).
 *
 * Resolution order (all plain, non-NEXT_PUBLIC env vars so nothing is inlined
 * into the client bundle):
 *   1. SITE_URL — explicit canonical origin (set this in production).
 *   2. Vercel's deployment domain (VERCEL_PROJECT_PRODUCTION_URL / VERCEL_URL).
 *   3. localhost — development only.
 *
 * In a production build with none of the above set we throw, so crawlers and
 * feed readers are never served unusable localhost URLs.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.SITE_URL
  if (explicit) return explicit.replace(/\/$/, "")

  // Vercel exposes the host without a protocol.
  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  if (vercelHost) return `https://${vercelHost.replace(/\/$/, "")}`

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SITE_URL is not set. Set SITE_URL (or deploy on Vercel) so canonical, " +
        "sitemap, and RSS URLs are absolute — otherwise localhost URLs would " +
        "be published to crawlers and feeds."
    )
  }

  return "http://localhost:1408"
}

export const SITE_URL = resolveSiteUrl()
