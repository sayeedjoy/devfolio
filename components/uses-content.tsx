"use client"

import { useState } from "react"

import type { UsesData } from "@/data/uses"
import { cn } from "@/lib/utils"

/**
 * Square thumbnail that falls back to the item's first letter when the image is
 * missing (e.g. before the matching file is dropped into /public/images/uses).
 * `<img>` with onError is why this whole tree is a client island.
 */
function Thumb({
  src,
  name,
  className,
  rounded = "rounded-md",
}: {
  src: string
  name: string
  className?: string
  rounded?: string
}) {
  const [failed, setFailed] = useState(false)

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden text-muted-foreground",
        rounded,
        className
      )}
      aria-hidden={failed}
    >
      {failed ? (
        <span className="text-sm font-semibold">{name.charAt(0)}</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          loading="lazy"
          className="size-full object-cover"
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
      {/* Hero workspace photo. */}
      <figure className="mb-12">
        <Thumb
          src={data.hero.image}
          name="Workspace"
          rounded="rounded-xl"
          className="aspect-video w-full"
        />
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {data.hero.caption}
        </figcaption>
      </figure>

      {/* Everyday — hardware, 2-column grid of card rows. */}
      <section className="mb-12">
        <SectionHeading>Everyday</SectionHeading>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {data.hardware.map((item) => (
            <li
              key={item.name}
              className="flex items-center gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-border hover:bg-muted/50"
            >
              <Thumb src={item.image} name={item.name} className="size-11" />
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
        <ul className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4 md:grid-cols-5">
          {data.software.map((app) => (
            <li
              key={app.name}
              className="flex flex-col items-center gap-2 text-center"
            >
              <Thumb
                src={app.icon}
                name={app.name}
                rounded="rounded-xl"
                className="size-14"
              />
              <span className="text-xs text-muted-foreground">{app.name}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted-foreground italic">
          {data.softwareNote}
        </p>
      </section>

      {/* Coding — editor setup blurb with inline app icons. */}
      <section>
        <SectionHeading>Coding</SectionHeading>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {data.coding.note.map((segment, index) =>
            typeof segment === "string" ? (
              segment
            ) : (
              <span
                key={index}
                className="inline-flex items-center gap-1 align-baseline font-medium text-foreground"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={segment.icon}
                  alt=""
                  aria-hidden="true"
                  className="inline size-[1cap]"
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
