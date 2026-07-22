import Link from "next/link"

import { CornerDownLeft } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Shared back-navigation link — a return glyph plus uppercase mono label.
 * Used at the top of detail/archive pages (projects, blog posts, tags).
 */
export function BackLink({
  href,
  label = "Back",
  className,
}: {
  href: string
  label?: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground",
        className
      )}
    >
      <CornerDownLeft className="size-3.5" />
      {label}
    </Link>
  )
}
