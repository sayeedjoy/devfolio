"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import type { Personal } from "@/data/types"

export function PhotoGallery({ photos }: { photos: Personal["photos"] }) {
  const [arrangedPhotos, setArrangedPhotos] = useState(photos)

  useEffect(() => {
    // Keep the first render identical to the server, then shuffle once per visit.
    const frame = requestAnimationFrame(() => {
      const shuffled = [...photos]
      for (let index = shuffled.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(Math.random() * (index + 1))
        const photo = shuffled[index]
        shuffled[index] = shuffled[swapIndex]
        shuffled[swapIndex] = photo
      }
      setArrangedPhotos(shuffled)
    })

    return () => cancelAnimationFrame(frame)
  }, [photos])

  if (!photos.length) return null

  return (
    <ul className="group/gallery columns-2 gap-2 sm:columns-3">
      {arrangedPhotos.map((photo) => (
        <li key={photo.src} className="mb-2 break-inside-avoid">
          <Image
            src={photo.src}
            alt={photo.title ?? photo.caption ?? "Personal photograph"}
            width={photo.width}
            height={photo.height}
            quality={100}
            sizes="(min-width: 896px) 278px, (min-width: 640px) calc((100vw - 64px) / 3), calc((100vw - 56px) / 2)"
            className="block h-auto w-full rounded-lg grayscale transition-[filter] duration-300 group-hover/gallery:grayscale-0 motion-reduce:transition-none"
          />
        </li>
      ))}
    </ul>
  )
}
