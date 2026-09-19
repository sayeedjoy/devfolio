import type { Metadata } from "next"
import Image from "next/image"

import { AboutLinks } from "@/components/about-links"
import { BioLine } from "@/components/bio-line"
import { BackLink } from "@/components/back-link"
import { CapabilityCards } from "@/components/capability-cards"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Section, SectionLabel } from "@/components/section"
import content from "@/data/content"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "About",
  description:
    "Something about me — what I do, what I'm into, and how to reach me.",
  alternates: { canonical: `${SITE_URL}/about` },
}

/** One of the two narrow lists that sit beside the bio. */
function Rail({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <h2 className="mb-3 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </h2>
      <ul className="space-y-2 text-base text-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default function AboutPage() {
  const { profile, about } = content

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 pb-10">
        <header className="mt-4 flex items-start gap-3.5">
          <Image
            src="/photos/joy-1.webp"
            alt={profile.name}
            width={44}
            height={44}
            priority
            className="size-11 rounded-full object-cover"
          />
          <div>
            <h1 className="text-lg leading-snug font-semibold tracking-tight">
              {about.greeting}
            </h1>
            <BackLink href="/" label={about.caption} className="mt-0.5" />
          </div>
        </header>

        {/* Bio on the left, the two rails on the right. */}
        <div className="mt-8 grid gap-10 sm:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] sm:gap-10">
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            {about.bio.map((line, i) => (
              <BioLine key={i} segments={line} />
            ))}
          </div>
          <div className="space-y-8">
            <Rail label="What I do" items={about.whatIDo} />
            <Rail label="Interests" items={about.interests} />
          </div>
        </div>

        <Section className="pt-12">
          <CapabilityCards />
        </Section>

        <Section className="pt-8">
          <SectionLabel>Elsewhere</SectionLabel>
          <AboutLinks links={about.links} />
        </Section>

        <Footer minimal />
      </main>
    </>
  )
}
