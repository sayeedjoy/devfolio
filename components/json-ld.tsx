import content, { bioText } from "@/data/content"
import { SITE_URL } from "@/lib/site"

// schema.org structured data for the home page. Emitted as a single JSON-LD
// <script> so search engines and AI agents get a machine-readable description
// of who this site is about. Server-rendered (this reads data/content.ts, which
// must never reach the client bundle), but only non-sensitive fields are output.

// Serialize to JSON and neutralize the only sequence that could break out of a
// <script> element ("<", as in "</script>"). All values here are our own static
// content, but escaping keeps the output safe regardless of what is added later.
function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

export function JsonLd() {
  const { profile, contact } = content

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: profile.name,
        jobTitle: profile.role,
        url: SITE_URL,
        image: `${SITE_URL}${profile.avatar}`,
        description: bioText(profile.bio[0]),
        sameAs: contact.socials.map((s) => s.href),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: profile.name,
        inLanguage: "en",
        author: { "@id": `${SITE_URL}/#person` },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  )
}
