import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { UsesContent } from "@/components/uses-content"
import uses from "@/data/uses"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Uses",
  description:
    "The hardware, software, browser extensions, and editor setup I use every day.",
  alternates: { canonical: `${SITE_URL}/uses` },
}

// Server component: reads the server-only `data/uses.ts` and passes plain,
// serializable props into the `UsesContent` client island (which owns the tab
// filter state and image fallbacks). `data/uses.ts` never reaches the client
// import graph this way.
export default function UsesPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            What do I use?
          </h1>
        </header>

        <UsesContent data={uses} />

        <Footer minimal />
      </main>
    </>
  )
}
