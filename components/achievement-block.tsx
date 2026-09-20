import Image from "next/image"

import type { Achievement } from "@/data/content"
import { cn } from "@/lib/utils"

/**
 * One achievement card: a full-bleed image on top, then title and a short line
 * of context.
 *
 * The media area is a fixed 16/9 and every image `object-cover`s it, so mixed
 * source ratios (wide banners, near-square logos) all fill the card edge to
 * edge and the grid stays even — at the cost of cropping the tallest ones.
 * Falls back to the title's initial when no image is bound. `h-full` keeps
 * cards flush in the grid row they share.
 */
export function AchievementBlock({
  achievement,
  className,
}: {
  achievement: Achievement
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border border-border/60",
        className
      )}
    >
      <span className="relative flex aspect-video w-full items-center justify-center border-b border-border/60 bg-foreground/[0.04]">
        {achievement.image ? (
          <Image
            src={achievement.image}
            alt=""
            fill
            sizes="(min-width: 640px) 20rem, 100vw"
            className="object-cover"
          />
        ) : (
          <span className="text-xl font-semibold text-muted-foreground">
            {achievement.title.charAt(0)}
          </span>
        )}
      </span>

      <span className="flex min-w-0 flex-col gap-1 px-4 py-4">
        <span className="leading-snug font-medium text-foreground">
          {achievement.title}
        </span>
        <span className="text-sm leading-snug text-muted-foreground">
          {achievement.description}
        </span>
      </span>
    </div>
  )
}
