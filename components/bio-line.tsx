import Image from "next/image"

import type { BioParagraph } from "@/data/content"

/**
 * Renders one bio paragraph. Shared by the home hero and /about so a segment
 * looks the same in both places.
 *
 * A `link` segment renders as an inline chip — icon then label, on a wash of
 * the accent — rather than as underlined body text, so a product name reads as
 * a thing rather than as a link inside the sentence.
 */
export function BioLine({ segments }: { segments: BioParagraph }) {
  return (
    <p>
      {segments.map((seg, i) => {
        if (typeof seg === "string") return <span key={i}>{seg}</span>

        if (seg.type === "link") {
          return (
            <a
              key={i}
              href={seg.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-0.5 inline-flex items-center gap-1.5 rounded-full bg-chip px-2 py-0.5 align-[-0.35em] text-[0.95em] leading-normal font-medium whitespace-nowrap text-chip-foreground transition-opacity hover:opacity-80"
            >
              {seg.logo ? (
                <Image
                  src={seg.logo}
                  alt=""
                  width={16}
                  height={16}
                  className="size-[1.05em] rounded-full object-cover"
                />
              ) : null}
              {seg.text}
            </a>
          )
        }

        return (
          <span key={i} className="font-medium text-foreground">
            {seg.text}
          </span>
        )
      })}
    </p>
  )
}
