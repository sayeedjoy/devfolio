"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import type { Venture } from "@/data/content"

export function ProjectPreview({ venture }: { venture: Venture }) {
  const [hovered, setHovered] = React.useState(false)

  // Prefer the internal project detail page; fall back to the external URL.
  const internalHref = venture.slug ? `/project/${venture.slug}` : null

  const hoverHandlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocus: () => setHovered(true),
    onBlur: () => setHovered(false),
  }
  const className =
    "group relative -mx-2 flex items-center gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-foreground/[0.03]"

  const inner = (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl">
        {venture.icon ? (
          <Image
            src={venture.icon}
            alt=""
            width={44}
            height={44}
            className="size-full object-cover"
          />
        ) : (
          <span className="text-sm font-semibold text-muted-foreground">
            {venture.name.charAt(0)}
          </span>
        )}
      </span>

      <span className="flex min-w-0 flex-col">
        <span className="leading-snug font-medium text-foreground">
          {venture.name}
        </span>
        <span className="truncate text-sm leading-snug text-muted-foreground">
          {venture.description}
        </span>
      </span>

      <ArrowUpRight className="ml-auto size-4 shrink-0 self-center text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />

      {/* Floating preview — only when an image exists and on pointer hover */}
      {venture.preview && hovered ? (
        <span className="pointer-events-none absolute -top-2 right-0 z-20 hidden -translate-y-full overflow-hidden rounded-lg border border-border shadow-2xl sm:block">
          <Image
            src={venture.preview}
            alt=""
            width={280}
            height={175}
            className="h-auto w-[280px]"
          />
        </span>
      ) : null}
    </>
  )

  // Internal detail page → client-side navigation, same tab.
  if (internalHref) {
    return (
      <Link href={internalHref} className={className} {...hoverHandlers}>
        {inner}
      </Link>
    )
  }

  // No matching project page → open the external URL in a new tab.
  return (
    <a
      href={venture.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...hoverHandlers}
    >
      {inner}
    </a>
  )
}
