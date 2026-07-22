import { LiveClock } from "@/components/live-clock"
import content from "@/data/content"

export function Footer({ minimal = false }: { minimal?: boolean }) {
  // Server component renders at request/build time, so the year stays current.
  const year = new Date().getFullYear()

  return (
    <footer className="mt-6 py-8">
      <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
        <span className="tracking-wider uppercase">
          © {year} {content.profile.name}
        </span>
        <LiveClock />
      </div>
    </footer>
  )
}
