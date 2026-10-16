import content from "@/data/content"
import { SITE_URL } from "@/lib/site"

// schema.org structured data. Each page emits one JSON-LD <script> so search
// engines and AI agents get a machine-readable description of who this site is
// about and what each page is. Server-rendered (this reads data/content.ts,
// which must never reach the client bundle), but only non-sensitive fields are
// output — the email is deliberately absent.

// Serialize to JSON and neutralize the only sequence that could break out of a
// <script> element ("<", as in "</script>"). All values here are our own static
// content, but escaping keeps the output safe regardless of what is added later.
function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: safeJsonLd({ "@context": "https://schema.org", ...data }),
      }}
    />
  )
}

const PERSON_ID = `${SITE_URL}/#person`
const WEBSITE_ID = `${SITE_URL}/#website`

/**
 * The full Person node. Each page repeats it rather than referencing it by
 * @id alone, because a crawler only resolves @id within the page it parsed.
 */
export function personNode() {
  const { profile, contact, personal, stack, about, education, achievements } =
    content
  const sameAs = [...profile.socials, ...contact.socials].map((s) => s.href)
  if (personal.instagram) sameAs.push(personal.instagram)

  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.name,
    jobTitle: profile.role,
    url: SITE_URL,
    image: `${SITE_URL}${profile.avatar}`,
    description: profile.summary,
    sameAs: [...new Set(sameAs)],
    knowsAbout: [...about.whatIDo, ...stack.map((s) => s.name)],
    alumniOf: education.map((e) => ({
      "@type": "CollegeOrUniversity",
      name: e.companyName,
    })),
    award: achievements.map((a) => a.title),
  }
}

/** Home › … trail; each entry is [name, path]. */
export function breadcrumbNode(trail: [name: string, path: string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${SITE_URL}${path}`,
    })),
  }
}

/** Home page graph: the profile page, the person it is about, and the site. */
export function homeGraph() {
  const { profile } = content
  return {
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        name: `${profile.name} — ${profile.role}`,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: { "@id": PERSON_ID },
      },
      personNode(),
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: profile.name,
        inLanguage: "en",
        author: { "@id": PERSON_ID },
      },
    ],
  }
}
