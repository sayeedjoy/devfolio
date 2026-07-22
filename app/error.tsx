"use client"

import { useEffect } from "react"
import Link from "next/link"

// Route-segment error boundary. Catches render/runtime errors thrown below the
// root layout and offers a recovery path instead of a blank screen. Must be a
// Client Component (it receives `reset` and runs in the browser).
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface the error to the console (and any wired-up reporting) in dev/prod.
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="py-16">
        <p className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
          Error
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-3 text-balance text-muted-foreground">
          An unexpected error occurred while rendering this page.
        </p>
        <div className="mt-6 flex items-center gap-4 font-mono text-sm">
          <button
            type="button"
            onClick={reset}
            className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            ← Back home
          </Link>
        </div>
      </div>
    </main>
  )
}
