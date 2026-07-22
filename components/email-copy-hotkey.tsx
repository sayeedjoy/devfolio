"use client"

import * as React from "react"

import { getContactEmail } from "@/app/actions"

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

/**
 * Listens for the `C` key and copies the contact email to the clipboard.
 * The email is fetched from a Server Action on demand, so it is never part of
 * the static client bundle. Renders a small transient confirmation.
 */
export function EmailCopyHotkey() {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined

    async function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key.toLowerCase() !== "c") return
      if (isTypingTarget(event.target)) return
      // Don't hijack an active text selection copy.
      if (window.getSelection()?.toString()) return

      try {
        const email = await getContactEmail()
        await navigator.clipboard.writeText(email)
        setCopied(true)
        timeout = setTimeout(() => setCopied(false), 2000)
      } catch {
        // Clipboard may be unavailable (insecure context); fail silently.
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      if (timeout) clearTimeout(timeout)
    }
  }, [])

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2"
    >
      {copied ? (
        <span className="rounded-full bg-foreground px-3 py-1.5 font-mono text-xs text-background shadow-lg">
          Email copied ✓
        </span>
      ) : null}
    </div>
  )
}
