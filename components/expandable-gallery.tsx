"use client"

import { AnimatePresence, LayoutGroup, motion } from "motion/react"
import Image from "next/image"
import { useId, useRef, useState } from "react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import type { Personal } from "@/data/types"
import { useOutsideClick } from "@/hooks/use-outside-click"
import { cn } from "@/lib/utils"

// Fanned-out pose for the first three photos while collapsed. Layout, not
// content, so it lives here rather than in data/personal.ts.
const STACK = [
  { rotation: -15, x: -70, y: 10, zIndex: 10 },
  { rotation: -3, x: -5, y: -15, zIndex: 20 },
  { rotation: 12, x: 60, y: 5, zIndex: 30 },
]

// Close to critically damped: the cards glide into place without overshoot.
const transition = {
  type: "spring",
  stiffness: 260,
  damping: 30,
  mass: 1,
} as const

export function ExpandableGallery({ photos }: { photos: Personal["photos"] }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const layoutGroupId = useId()
  const containerRef = useRef<HTMLDivElement>(null)

  useOutsideClick(containerRef, () => {
    if (isExpanded) {
      setIsExpanded(false)
    }
  })

  if (!photos.length) return null

  return (
    <div className="relative flex w-full flex-col items-center overflow-hidden">
      <LayoutGroup id={layoutGroupId}>
        <div className="flex h-10 w-full items-center">
          <AnimatePresence>
            {isExpanded && (
              <motion.button
                key="back-button"
                type="button"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => setIsExpanded(false)}
                className="group z-50 flex items-center gap-2 text-sm text-muted-foreground transition-all hover:text-foreground"
              >
                <div className="rounded-full bg-muted p-1.5 text-foreground transition-colors group-hover:bg-accent">
                  <HugeiconsIcon
                    icon={ArrowLeft01Icon}
                    width={16}
                    height={16}
                  />
                </div>
                <span className="font-medium">Go back</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* No `layout` here: the cards animate themselves, and a container
            layout animation on top stretches the whole block mid-flight. */}
        <div
          ref={containerRef}
          className={cn(
            "relative w-full",
            isExpanded
              ? "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
              : "flex flex-col items-center justify-start"
          )}
        >
          <div
            className={cn(
              "relative",
              isExpanded
                ? "contents"
                : "mb-6 flex h-56 w-full items-center justify-center sm:h-64"
            )}
          >
            {photos.map((photo, index) => {
              const pose = STACK[index]
              if (!pose && !isExpanded) return null

              return (
                <motion.div
                  key={photo.src}
                  layoutId={`card-container-${photo.src}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: !isExpanded ? pose.rotation : 0,
                    x: !isExpanded ? pose.x : 0,
                    y: !isExpanded ? pose.y : 0,
                    zIndex: !isExpanded ? pose.zIndex : 10,
                  }}
                  transition={transition}
                  whileHover={
                    !isExpanded
                      ? {
                          scale: 1.05,
                          y: pose.y - 15,
                          rotate: pose.rotation * 0.8,
                          zIndex: 50,
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          },
                        }
                      : { scale: 1.02 }
                  }
                  className={cn(
                    "cursor-pointer overflow-hidden bg-muted",
                    isExpanded
                      ? "relative aspect-square rounded-2xl border-4 border-background shadow-lg"
                      : "absolute size-36 rounded-[2rem] border-[5px] border-background shadow-xl sm:size-44"
                  )}
                  onClick={() => !isExpanded && setIsExpanded(true)}
                >
                  <motion.div
                    layoutId={`image-inner-${photo.src}`}
                    layout="position"
                    className="relative h-full w-full"
                    transition={transition}
                  >
                    <Image
                      src={photo.src}
                      alt={
                        photo.title ?? photo.caption ?? "Personal photograph"
                      }
                      fill
                      quality={100}
                      sizes="(min-width: 640px) 208px, 50vw"
                      draggable={false}
                      className="pointer-events-none object-cover select-none"
                    />
                  </motion.div>
                </motion.div>
              )
            })}
          </div>

          {/* Removed without an exit fade: a fading button would linger as an
              extra grid cell and hold the grid open a row too tall. */}
          {!isExpanded && photos.length > STACK.length && (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-[opacity,transform] duration-150 ease-out hover:opacity-90 focus-visible:ring-2 focus-visible:ring-foreground/25 focus-visible:outline-none active:scale-[0.96]"
            >
              See all {photos.length}
              <HugeiconsIcon icon={ArrowRight01Icon} width={16} height={16} />
            </button>
          )}
        </div>
      </LayoutGroup>
    </div>
  )
}
