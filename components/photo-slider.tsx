"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

// Per-photo tilt (desktop only) for the loosely scattered, hand-placed feel.
// Applied at sm+ so the mobile slider stays upright and clean.
const TILTS = [
  "sm:-rotate-3",
  "sm:rotate-2",
  "sm:-rotate-2",
  "sm:rotate-3",
  "sm:-rotate-1",
]

type Photo = { src: string; caption?: string }

/**
 * Horizontal photo row with a different frame per breakpoint:
 * - Mobile: large frameless, full-bleed rounded photos in a snap slider that
 *   auto-advances.
 * - Desktop: white "polaroid" matte cards, scattered and static.
 *
 * Receives only non-sensitive photo data (src + caption) so the rest of the
 * dataset stays server-side.
 */
export function PhotoSlider({ photos }: { photos: Photo[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el || photos.length < 2) return

    const isMobile = window.matchMedia("(max-width: 639px)")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")

    let timer: ReturnType<typeof setInterval> | undefined
    let paused = false

    const advance = () => {
      if (paused) return
      const first = el.firstElementChild as HTMLElement | null
      if (!first) return
      const gap = parseFloat(getComputedStyle(el).columnGap) || 16
      const slide = first.offsetWidth + gap
      const maxScroll = el.scrollWidth - el.clientWidth
      // Loop back to the start once we reach the end.
      const next = el.scrollLeft + slide > maxScroll + 4 ? 0 : el.scrollLeft + slide
      el.scrollTo({ left: next, behavior: "smooth" })
    }

    const start = () => {
      clearTimer()
      if (isMobile.matches && !reduce.matches) {
        timer = setInterval(advance, 2800)
      }
    }
    const clearTimer = () => {
      if (timer) clearInterval(timer)
      timer = undefined
    }

    // Pause while the user is actively touching/dragging the row.
    const pause = () => {
      paused = true
    }
    const resume = () => {
      paused = false
    }

    start()
    isMobile.addEventListener("change", start)
    el.addEventListener("pointerdown", pause)
    window.addEventListener("pointerup", resume)
    el.addEventListener("touchstart", pause, { passive: true })
    window.addEventListener("touchend", resume)

    return () => {
      clearTimer()
      isMobile.removeEventListener("change", start)
      el.removeEventListener("pointerdown", pause)
      window.removeEventListener("pointerup", resume)
      el.removeEventListener("touchstart", pause)
      window.removeEventListener("touchend", resume)
    }
  }, [photos.length])

  return (
    <div
      ref={scrollerRef}
      className="mt-8 -mx-6 flex snap-x snap-mandatory items-center gap-4 overflow-x-auto px-6 py-4 [scrollbar-width:none] sm:mx-0 sm:snap-none sm:justify-center sm:gap-5 sm:overflow-visible sm:px-0 sm:py-0 [&::-webkit-scrollbar]:hidden"
    >
      {photos.map((photo, i) => (
        <figure
          key={i}
          className={cn(
            "group relative shrink-0 snap-center bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-10",
            // Mobile: large, frameless, full-bleed rounded card.
            "w-[80vw] max-w-[22rem] rounded-3xl ring-1 ring-white/15",
            // Desktop: white polaroid matte (bottom-heavy), scattered + lift on hover.
            "sm:w-52 sm:max-w-none sm:rounded-lg sm:p-2.5 sm:pb-8 sm:ring-black/10 sm:hover:-translate-y-2 sm:hover:rotate-0",
            TILTS[i % TILTS.length]
          )}
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-[inherit] sm:rounded-sm">
            <Image
              src={photo.src}
              alt={photo.caption ?? ""}
              fill
              quality={100}
              // Mobile photos fill ~80vw, so request that width; desktop matte
              // holds a ~208px print. next/image adds the 2×/3× srcset on top,
              // keeping every photo crisp and full-resolution on HiDPI screens.
              sizes="(min-width: 640px) 208px, 80vw"
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            />
          </div>
        </figure>
      ))}
    </div>
  )
}
