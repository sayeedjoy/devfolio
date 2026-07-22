import Link from "next/link"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

// Custom 404 rendered whenever `notFound()` is called (unknown blog/project
// slugs, missing tags) or an unmatched URL is hit. Without this file Next would
// serve its bare default 404 with none of the site chrome.
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="py-16">
          <p className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
            404
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Page not found
          </h1>
          <p className="mt-3 text-balance text-muted-foreground">
            The page you’re looking for doesn’t exist or may have moved.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block font-mono text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            ← Back home
          </Link>
        </div>

        <Footer minimal />
      </main>
    </>
  )
}
