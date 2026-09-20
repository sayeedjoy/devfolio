"use client"

import { useState } from "react"

import type { UsesData } from "@/data/uses"
import { cn } from "@/lib/utils"

/**
 * Thumbnail tile that falls back to the item's first letter when the image is
 * missing (e.g. before the matching file is dropped into /public). `<img>` with
 * onError is why this whole tree is a client island.
 *
 * `fit` matters: photos that should fill their frame use `object-cover`, while
 * product shots and app icons — which arrive in every aspect ratio — use
 * `object-contain` so nothing is cropped.
 *
 * Pass `alt` only when the image carries meaning on its own. Omitting it marks
 * the tile decorative (the adjacent label already names it), so screen readers
 * don't announce the same product twice.
 */
function Thumb({
  src,
  name,
  alt,
  className,
  imgClassName,
  rounded = "rounded-md",
  fit = "object-cover",
  priority = false,
}: {
  src: string
  name: string
  alt?: string
  className?: string
  imgClassName?: string
  rounded?: string
  fit?: "object-cover" | "object-contain"
  /** set for the above-the-fold hero so the LCP image isn't lazy-loaded */
  priority?: boolean
}) {
  const [failed, setFailed] = useState(false)
  const decorative = alt === undefined

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden text-muted-foreground",
        rounded,
        // The letter placeholder needs a surface of its own, otherwise a broken
        // image reads as a stray character floating in the layout.
        failed && "bg-muted",
        className
      )}
      {...(decorative
        ? { "aria-hidden": true }
        : failed
          ? { role: "img", "aria-label": alt }
          : {})}
    >
      {failed ? (
        <span className="text-sm font-semibold">{name.charAt(0)}</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={decorative ? "" : alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          className={cn("size-full", fit, imgClassName)}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
      {children}
    </h2>
  )
}

export function UsesContent({ data }: { data: UsesData }) {
  return (
    <div>
      {/* Hero workspace photo. 4:3 matches the source shot, so the frame crops
          nothing; `object-cover` only guards against a replacement image that
          comes in at another ratio. */}
      <figure className="mb-12">
        <Thumb
          src={data.hero.image}
          name="Workspace"
          alt={data.hero.caption}
          rounded="rounded-xl"
          className="aspect-[4/3] w-full"
          priority
        />
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {data.hero.caption}
        </figcaption>
      </figure>

      {/* Everyday — hardware, 2-column grid of card rows. Product shots come in
          mixed ratios (16:9 GPU renders, portrait phones) and mixed backgrounds
          (some transparent, some baked white), so they sit contained on a white
          tile rather than cropped square. */}
      <section className="mb-12">
        <SectionHeading>Everyday</SectionHeading>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {data.hardware.map((item) => (
            <li
              key={item.name}
              className="flex items-center gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-border hover:bg-muted/50"
            >
              <Thumb
                src={item.image}
                name={item.name}
                fit="object-contain"
                className="size-11 bg-white p-1 ring-1 ring-border"
              />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {item.name}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {item.description}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Software — uniform icon grid. */}
      <section className="mb-12">
        <SectionHeading>Software</SectionHeading>
        <ul className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
          {data.software.map((app) => (
            <li
              key={app.name}
              className="flex flex-col items-center gap-2 text-center"
            >
              <Thumb
                src={app.icon}
                name={app.name}
                rounded="rounded-xl"
                fit="object-contain"
                className="size-14 bg-muted p-2.5 ring-1 ring-border"
                // Single-colour white artwork disappears on the light tile, so
                // flip it to dark there and leave it alone in dark mode.
                imgClassName={app.mono ? "invert dark:invert-0" : undefined}
              />
              <span className="text-xs text-muted-foreground">{app.name}</span>
            </li>
          ))}
        </ul>
        {data.softwareNote ? (
          <p className="mt-6 text-sm text-muted-foreground italic">
            {data.softwareNote}
          </p>
        ) : null}
      </section>

      {/* Coding — editor setup blurb with inline app icons. `items-baseline`
          keeps each icon+label chip sitting on the surrounding prose baseline
          instead of hanging off the flex box's bottom edge. */}
      <section>
        <SectionHeading>Coding</SectionHeading>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {data.coding.note.map((segment, index) =>
            typeof segment === "string" ? (
              segment
            ) : (
              <span
                key={index}
                className="inline-flex items-baseline gap-1 font-medium whitespace-nowrap text-foreground"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={segment.icon}
                  alt=""
                  aria-hidden="true"
                  className="size-[1.1em] shrink-0 self-center"
                />
                {segment.label}
              </span>
            )
          )}
        </p>
      </section>
    </div>
  )
}
