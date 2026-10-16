import type { Metadata } from "next"

import { Achievements } from "@/components/achievements"
import { Contact } from "@/components/contact"
import { EmailCopyHotkey } from "@/components/email-copy-hotkey"
import { Experience } from "@/components/experience"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { homeGraph, JsonLd } from "@/components/json-ld"
import { Navbar } from "@/components/navbar"
import { Personal } from "@/components/personal"
import { Stack } from "@/components/stack"
import { Ventures } from "@/components/projects"
import { Writing } from "@/components/writing"
import { RSS_ALTERNATE } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"

// Title, description and openGraph come from the root layout; the home page
// only adds its own canonical and alternates (markdown twin, RSS).
export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
    types: { ...RSS_ALTERNATE, "text/markdown": `${SITE_URL}/index.md` },
  },
}

export default function Page() {
  return (
    <>
      <JsonLd data={homeGraph()} />
      <Navbar />
      <main className="mx-auto max-w-2xl px-6">
        <Hero />
        <Experience />
        <Stack />
        <Ventures />
        <Achievements />
        <Writing />
        <Personal />
        <Contact />
        <Footer />
      </main>
      <EmailCopyHotkey />
    </>
  )
}
