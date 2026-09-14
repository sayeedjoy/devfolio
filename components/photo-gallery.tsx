import Image from "next/image"

import type { Personal } from "@/data/types"

export function PhotoGallery({ photos }: { photos: Personal["photos"] }) {
  if (!photos.length) return null

  return (
    <ul className="columns-2 gap-2 sm:columns-3">
      {photos.map((photo) => (
        <li key={photo.src} className="group mb-2 break-inside-avoid">
          <Image
            src={photo.src}
            alt={photo.title ?? photo.caption ?? "Personal photograph"}
            width={photo.width}
            height={photo.height}
            quality={100}
            sizes="(min-width: 896px) 278px, (min-width: 640px) calc((100vw - 64px) / 3), calc((100vw - 56px) / 2)"
            className="block h-auto w-full rounded-lg grayscale transition-[filter] duration-300 group-hover:grayscale-0 motion-reduce:transition-none"
          />
        </li>
      ))}
    </ul>
  )
}
