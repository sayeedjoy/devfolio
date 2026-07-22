import { cn } from "@/lib/utils"

/** A small tag pill that links to the tag's archive page. Server component. */
export function TagChip({
  tag,
  count,
  className,
}: {
  tag: string
  /** optional post count shown next to the tag (used in the tag cloud) */
  count?: number
  className?: string
}) {
  return (
    <a
      href={`/blog/tag/${encodeURIComponent(tag)}`}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5",
        "font-mono text-xs text-muted-foreground transition-colors",
        "hover:border-foreground/20 hover:text-foreground",
        className
      )}
    >
      {tag}
      {count !== undefined && (
        <span className="text-muted-foreground/60">{count}</span>
      )}
    </a>
  )
}
