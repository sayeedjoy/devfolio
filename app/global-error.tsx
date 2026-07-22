"use client"

import "./globals.css"

// Last-resort boundary for errors thrown in the root layout itself. It replaces
// the whole document, so it must render its own <html>/<body> and can't rely on
// the layout's fonts or ThemeProvider. Kept deliberately minimal.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="mt-3 text-muted-foreground">
            A critical error occurred. Please reload the page.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-block w-fit font-mono text-sm underline underline-offset-4"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
