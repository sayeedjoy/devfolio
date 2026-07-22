import { Contact } from "@/components/contact"
import { EmailCopyHotkey } from "@/components/email-copy-hotkey"
import { Experience } from "@/components/experience"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { JsonLd } from "@/components/json-ld"
import { Navbar } from "@/components/navbar"
import { Personal } from "@/components/personal"
import { Stack } from "@/components/stack"
import { Ventures } from "@/components/projects"
import { Writing } from "@/components/writing"

export default function Page() {
  return (
    <>
      <JsonLd />
      <Navbar />
      <main className="mx-auto max-w-2xl px-6">
        <Hero />
        <Experience />
        <Stack />
        <Ventures />
        <Writing />
        <Personal />
        <Contact />
        <Footer />
      </main>
      <EmailCopyHotkey />
    </>
  )
}
