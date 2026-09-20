"use client"

import * as React from "react"
import Image from "next/image"
import { createPortal } from "react-dom"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

/**
 * Hover preview — a floating screenshot pinned beside the hovered row.
 *
 * Wrap any row (a project link, an experience entry, …) and give it a `src`:
 * on hover or keyboard focus the screenshot fades in beside the row, parked in
 * the empty page gutter that the narrow `max-w-2xl` column leaves free. When
 * neither gutter is wide enough (narrow laptops) the card floats over the
 * column instead, and on touch/coarse pointers it never renders at all.
 *
 * Binding a preview is opt-in — a row without `src` renders untouched:
 *
 *   <HoverPreview src="/previews/foo.png">
 *     <Link href="/project/foo">…</Link>
 *   </HoverPreview>
 */

type Side = "left" | "right"

type Position = {
  left: number
  top: number
  width: number
  height: number
  /** which gutter won, or "over" when the card had to overlap the column */
  side: Side | "over"
}

/** Breathing room between the row and the card, in px. */
const GAP = 24
/** Distance the card keeps from the viewport edges, in px. */
const EDGE = 16
/** Below this a gutter is too cramped to be worth using. */
const MIN_WIDTH = 200
const DEFAULT_WIDTH = 320
/** Swallows fast cursor sweeps down a list, in ms. */
const OPEN_DELAY = 70

/**
 * Natural width ÷ height per `src`, learned from the first load and shared by
 * every instance. It means a screenshot is bound by path alone — portrait
 * phone shots and wide desktop ones size themselves without per-item config.
 */
const naturalRatios = new Map<string, number>()
const ratioLoads = new Map<string, Promise<number | null>>()

/**
 * Warm the exact file the preview renders as soon as the user shows intent and
 * learn its ratio while the short opening delay runs. These assets are already
 * compressed WebP screenshots, so routing them through the image optimizer
 * only adds a cold-request delay.
 */
function loadNaturalRatio(src: string) {
  const cached = naturalRatios.get(src)
  if (cached) return Promise.resolve(cached)

  const pending = ratioLoads.get(src)
  if (pending) return pending

  const load = new Promise<number | null>((resolve) => {
    const image = new window.Image()
    image.onload = () => {
      if (!image.naturalWidth || !image.naturalHeight) {
        resolve(null)
        return
      }

      const value = image.naturalWidth / image.naturalHeight
      naturalRatios.set(src, value)
      resolve(value)
    }
    image.onerror = () => resolve(null)
    image.src = src
  })

  ratioLoads.set(src, load)
  return load
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Pick the card's viewport-fixed box: preferred gutter first, then the other
 * one, then a fallback that floats above (or below) the row itself.
 */
function computePosition(
  rect: DOMRect,
  { maxWidth, ratio, prefer }: { maxWidth: number; ratio: number; prefer: Side }
): Position {
  const vw = document.documentElement.clientWidth
  const vh = document.documentElement.clientHeight

  // Width drives height through the ratio, unless that overflows the viewport.
  const fit = (width: number) => {
    const maxHeight = vh - EDGE * 2
    const height = width / ratio
    return height > maxHeight
      ? { width: maxHeight * ratio, height: maxHeight }
      : { width, height }
  }

  const gutters: [Side, number][] = [
    ["left", rect.left - EDGE - GAP],
    ["right", vw - rect.right - EDGE - GAP],
  ]
  if (prefer === "right") gutters.reverse()

  for (const [side, space] of gutters) {
    if (space < MIN_WIDTH) continue
    const { width, height } = fit(Math.min(maxWidth, space))
    return {
      side,
      width,
      height,
      left: side === "left" ? rect.left - GAP - width : rect.right + GAP,
      // Vertically centered on the row, but never off-screen.
      top: clamp(
        rect.top + rect.height / 2 - height / 2,
        EDGE,
        vh - EDGE - height
      ),
    }
  }

  // No usable gutter — overlap the column, preferring the space above the row.
  const { width, height } = fit(Math.min(maxWidth, vw - EDGE * 2))
  const above = rect.top - GAP / 2 - height
  return {
    side: "over",
    width,
    height,
    left: clamp(rect.right - width, EDGE, vw - EDGE - width),
    top:
      above >= EDGE
        ? above
        : clamp(rect.bottom + GAP / 2, EDGE, vh - EDGE - height),
  }
}

export type HoverPreviewProps = {
  /** screenshot path under /public — without it the children render as-is */
  src?: string
  /** decorative by default: the row itself already names the thing */
  alt?: string
  /** card width in px; shrinks automatically to fit a narrow gutter */
  width?: number
  /** fallback width ÷ height, used only until the image reports its own */
  ratio?: number
  /** gutter to try first — the other one is used when this one is cramped */
  side?: Side
  /** how the image fills the card; "contain" suits framed/transparent shots */
  fit?: "cover" | "contain"
  /** classes for the wrapper element that hosts the hover target */
  className?: string
  children: React.ReactNode
}

export function HoverPreview({
  src,
  alt = "",
  width = DEFAULT_WIDTH,
  ratio = 16 / 10,
  side = "left",
  fit = "cover",
  className,
  children,
}: HoverPreviewProps) {
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  // The anchor's live box is the state; the card's own box is derived from it,
  // so learning the image ratio re-sizes the card in the very same render.
  const [rect, setRect] = React.useState<DOMRect | null>(null)
  const [naturalRatio, setNaturalRatio] = React.useState<number | null>(() =>
    src ? (naturalRatios.get(src) ?? null) : null
  )
  const [enabled, setEnabled] = React.useState(false)
  const reduceMotion = useReducedMotion()
  const isOpen = rect !== null

  const position = React.useMemo(
    () =>
      rect
        ? computePosition(rect, {
            maxWidth: width,
            ratio: naturalRatio ?? ratio,
            prefer: side,
          })
        : null,
    [naturalRatio, ratio, rect, side, width]
  )

  // A pointer affordance: only mount it where hovering is a real gesture.
  // Resolving this in an effect also keeps the portal out of the SSR markup.
  React.useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)")
    const sync = () => setEnabled(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  const place = React.useCallback(() => {
    const box = anchorRef.current?.getBoundingClientRect()
    if (box) setRect(box)
  }, [])

  const open = React.useCallback(() => {
    if (!src || !enabled) return
    void loadNaturalRatio(src)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(place, OPEN_DELAY)
  }, [enabled, place, src])

  const close = React.useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    setRect(null)
  }, [])

  React.useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  // Keep the card glued to its row while the page moves underneath it.
  React.useEffect(() => {
    if (!isOpen) return
    const reposition = () => place()
    window.addEventListener("scroll", reposition, {
      passive: true,
      capture: true,
    })
    window.addEventListener("resize", reposition)
    return () => {
      window.removeEventListener("scroll", reposition, { capture: true })
      window.removeEventListener("resize", reposition)
    }
  }, [isOpen, place])

  if (!src) return <>{children}</>

  return (
    <div
      ref={anchorRef}
      className={className}
      onPointerEnter={(event) => {
        // Touch "hover" fires on tap and would flash the card mid-navigation.
        if (event.pointerType === "touch") return
        open()
      }}
      onPointerLeave={close}
      onFocusCapture={open}
      onBlurCapture={close}
    >
      {children}

      {enabled
        ? createPortal(
            <AnimatePresence>
              {position ? (
                <motion.div
                  key="hover-preview"
                  data-slot="hover-preview"
                  aria-hidden
                  className="pointer-events-none fixed z-50 overflow-hidden rounded-xl border border-border bg-muted shadow-2xl"
                  style={{
                    left: position.left,
                    top: position.top,
                    width: position.width,
                    height: position.height,
                  }}
                  initial={
                    reduceMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          scale: 0.96,
                          // Slides in from the row it belongs to.
                          x: position.side === "left" ? 8 : -8,
                          y: position.side === "over" ? 8 : 0,
                        }
                  }
                  // Held invisible until the image reports its ratio, so the
                  // card never fades in at the wrong size and then snaps.
                  animate={{
                    opacity: naturalRatio === null ? 0 : 1,
                    scale: 1,
                    x: 0,
                    y: 0,
                  }}
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          scale: 0.98,
                          transition: { duration: 0.12 },
                        }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0.15 }
                      : {
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                          mass: 0.6,
                        }
                  }
                >
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    unoptimized
                    sizes={`${Math.round(position.width)}px`}
                    onLoad={(event) => {
                      const { naturalWidth, naturalHeight } =
                        event.currentTarget
                      if (!naturalWidth || !naturalHeight) return
                      const value = naturalWidth / naturalHeight
                      naturalRatios.set(src, value)
                      setNaturalRatio(value)
                    }}
                    className={cn(
                      "object-top",
                      fit === "cover" ? "object-cover" : "object-contain"
                    )}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </div>
  )
}
