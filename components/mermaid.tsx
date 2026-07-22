"use client"

/**
 * Client island that renders a Mermaid diagram.
 *
 * Mermaid needs a DOM to measure and lay out nodes, so this can't run in an
 * RSC like the rest of the MDX pipeline — it's a thin client island (see
 * CLAUDE.md). The `mermaid` bundle is dynamically imported inside the effect so
 * it only ships to posts that actually contain a diagram, not every page.
 *
 * `securityLevel: "strict"` makes Mermaid sanitize its own output with
 * DOMPurify (scripts/event handlers stripped) before we attach it. The emitted
 * SVG carries inline styles only, which the CSP already allows via
 * `style-src 'unsafe-inline'`. We assign the sanitized markup through a ref
 * rather than dangerouslySetInnerHTML to keep the unsafe surface explicit and
 * local.
 */
import { useEffect, useId, useRef } from "react"

import { useTheme } from "next-themes"

export function Mermaid({ chart }: { chart: string }) {
  const { resolvedTheme } = useTheme()
  const ref = useRef<HTMLDivElement>(null)
  // useId() contains colons, which aren't valid in a Mermaid/DOM element id.
  const id = useId().replace(/[^a-zA-Z0-9-]/g, "")

  useEffect(() => {
    let cancelled = false

    async function render() {
      const host = ref.current
      if (!host) return
      try {
        const mermaid = (await import("mermaid")).default
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          // Match the active site theme so diagrams read in light and dark.
          theme: resolvedTheme === "dark" ? "dark" : "default",
          fontFamily: "inherit",
        })
        const { svg } = await mermaid.render(`mermaid-${id}`, chart)
        if (!cancelled && ref.current) ref.current.innerHTML = svg
      } catch {
        // A malformed diagram shouldn't blank the page — fall back to source.
        if (!cancelled && ref.current) {
          const pre = document.createElement("pre")
          pre.className =
            "my-6 overflow-x-auto rounded-xl border border-border p-4 text-sm text-muted-foreground"
          pre.textContent = chart
          ref.current.replaceChildren(pre)
        }
      }
    }

    render()
    return () => {
      cancelled = true
    }
  }, [chart, resolvedTheme, id])

  return (
    <div
      ref={ref}
      className="my-6 flex justify-center [&_svg]:h-auto [&_svg]:max-w-full"
    />
  )
}
