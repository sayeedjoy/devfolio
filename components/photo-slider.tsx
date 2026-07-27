"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

type Photo = { src: string; caption?: string; title?: string }

// Marquee speed, in CSS pixels per second. Slow enough to read a caption in
// passing, fast enough that the row never looks frozen.
const SPEED_MOBILE = 22
const SPEED_DESKTOP = 34

// How long the auto-scroll stays out of the way after the visitor drags,
// flicks, or wheels the row themselves.
const RESUME_DELAY_MS = 1600

// The loop only works if one copy of the list is at least as wide as the
// viewport — otherwise the row can't scroll far enough to reach the rewind
// point and the browser clamps it, which reads as "the slider is broken".
// A card is at most 320px + 16px gap, so 12 items covers a 4K screen; short
// galleries repeat themselves to get there.
const MIN_ITEMS_PER_COPY = 12

/**
 * Full-bleed photo marquee.
 *
 * The track holds two identical copies of the list, so scrolling past the
 * width of the first copy can be rewound by exactly that width without any
 * visible seam — an infinite loop with no clones to manage.
 *
 * Motion is driven by `scrollLeft` rather than a CSS transform on purpose:
 * the row stays a real scroll container, so touch swiping, trackpad flicks,
 * and keyboard scrolling all keep working while the animation runs.
 *
 * Receives only non-sensitive photo data (src + caption/title) so the rest of
 * the dataset stays server-side.
 */
export function PhotoSlider({ photos }: { photos: Photo[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const el = scrollerRef.current
    const track = trackRef.current
    if (!el || !track || photos.length < 2) return

    const desktop = window.matchMedia("(min-width: 640px)")

    let raf = 0
    let last = 0
    // Sub-pixel position we own; `scrollLeft` is rounded by some browsers, so
    // accumulating directly on it would stall at these speeds.
    let offset = 0
    let holdUntil = 0
    // Set while we write `scrollLeft` ourselves, so the scroll handler can
    // tell our own motion apart from the visitor's.
    let syncing = false

    // Each item carries its gap as a right margin, so one copy of the list
    // measures exactly one loop period.
    let loop = 0

    const measure = () => {
      // Never ask for more scroll than the container can actually give, or the
      // browser clamps `scrollLeft` and the row stalls at the far end. On a
      // correctly sized track these are equal and the rewind is invisible.
      loop = Math.min(track.offsetWidth, el.scrollWidth - el.clientWidth)
      if (loop > 0) offset = offset % loop
    }

    measure()

    const step = (now: number) => {
      raf = requestAnimationFrame(step)
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0
      last = now

      if (now < holdUntil || loop <= 0) return

      const speed = desktop.matches ? SPEED_DESKTOP : SPEED_MOBILE
      offset = (offset + speed * dt) % loop
      syncing = true
      el.scrollLeft = offset
    }

    const onScroll = () => {
      if (syncing) {
        syncing = false
        return
      }
      // A manual scroll: adopt its position, and rewind once it crosses into
      // the second copy so the visitor can keep swiping forever too.
      if (loop > 0 && el.scrollLeft >= loop) {
        syncing = true
        el.scrollLeft -= loop
      }
      offset = loop > 0 ? el.scrollLeft % loop : el.scrollLeft
    }

    const hold = () => {
      holdUntil = Number.POSITIVE_INFINITY
    }
    const release = () => {
      holdUntil = performance.now() + RESUME_DELAY_MS
    }
    const nudge = () => {
      holdUntil = performance.now() + RESUME_DELAY_MS
    }
    // Watch both: the track sets the loop period, the scroller sets the
    // clamp. A breakpoint change moves either one.
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    ro.observe(el)

    el.addEventListener("scroll", onScroll, { passive: true })
    el.addEventListener("wheel", nudge, { passive: true })
    el.addEventListener("pointerdown", hold)
    el.addEventListener("touchstart", hold, { passive: true })
    window.addEventListener("pointerup", release)
    // Touch scrolling cancels the pointer stream rather than ending it, so
    // without this the row would stay held forever after a swipe.
    window.addEventListener("pointercancel", release)
    window.addEventListener("touchend", release)
    window.addEventListener("touchcancel", release)

    raf = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener("scroll", onScroll)
      el.removeEventListener("wheel", nudge)
      el.removeEventListener("pointerdown", hold)
      el.removeEventListener("touchstart", hold)
      window.removeEventListener("pointerup", release)
      window.removeEventListener("pointercancel", release)
      window.removeEventListener("touchend", release)
      window.removeEventListener("touchcancel", release)
    }
  }, [photos.length])

  // One copy of the row, padded out to MIN_ITEMS_PER_COPY so it always spans
  // the viewport. The same files repeat, so this costs DOM nodes, not
  // requests — but a gallery with more photos repeats itself less.
  const repeat = Math.max(1, Math.ceil(MIN_ITEMS_PER_COPY / photos.length))
  const row = Array.from({ length: repeat }, () => photos).flat()

  // Two copies of that row. The second is a decorative stand-in for the first,
  // so it stays out of the accessibility tree.
  const copies = photos.length > 1 ? [0, 1] : [0]

  return (
    <div
      ref={scrollerRef}
      // Break out of the max-w-2xl column and run the row edge to edge, the
      // way the section reads on a wide screen. `html { overflow-x: clip }`
      // in globals.css keeps the 100vw width from adding a page scrollbar.
      className="relative left-1/2 mt-8 w-screen -translate-x-1/2 [scrollbar-width:none] overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex w-max px-4 sm:px-6">
        {copies.map((copy) => (
          <ul
            key={copy}
            ref={copy === 0 ? trackRef : undefined}
            aria-hidden={copy > 0 || undefined}
            className="flex"
          >
            {row.map((photo, i) => (
              <li key={i} className="mr-3 shrink-0 sm:mr-4">
                <figure
                  className={cn(
                    "group relative overflow-hidden rounded-2xl bg-muted ring-1 ring-black/5 dark:ring-white/10",
                    "aspect-[4/3] w-[78vw] max-w-[21rem] sm:w-72 lg:w-80"
                  )}
                >
                  <Image
                    src={photo.src}
                    alt={copy > 0 ? "" : (photo.title ?? photo.caption ?? "")}
                    fill
                    quality={100}
                    // ~78vw on mobile, a fixed print on sm+. next/image layers
                    // the 2×/3× srcset on top so HiDPI screens stay crisp.
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 288px, 78vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />

                  {photo.title ? (
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pt-10 pb-3.5 text-sm leading-snug font-semibold text-white sm:pt-12 sm:pb-4">
                      <span className="line-clamp-2">{photo.title}</span>
                    </figcaption>
                  ) : null}
                </figure>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
