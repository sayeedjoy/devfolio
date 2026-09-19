"use client"

import {
  GrainGradient,
  type GrainGradientProps,
} from "@paper-design/shaders-react"
import { useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

/**
 * The only shader used by the site. Keeping this wrapper single-purpose lets
 * the bundler discard every other shader implementation from the package.
 */
export function ShaderBackground({
  className,
  speed,
  ...props
}: GrainGradientProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    prefersReducedMotion,
    () => true
  )

  return (
    <GrainGradient
      {...props}
      speed={reducedMotion ? 0 : speed}
      className={cn("h-full w-full", className)}
    />
  )
}
