import Image from "next/image"
import Link from "next/link"

import { ArrowUpRight } from "lucide-react"

import type { Project } from "@/lib/project"
import { HoverPreview } from "@/components/hover-preview"

/**
 * Shared project listing — icon · title · subtitle rows. Mirrors the homepage
 * Projects section, each row linking into the detail page.
 */
export function ProjectList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="text-muted-foreground">
        No projects yet — check back soon.
      </p>
    )
  }

  return (
    <ul className="flex flex-col">
      {projects.map((project) => {
        const { title, subtitle, icon, preview } = project.metadata
        return (
          <li key={project.slug}>
            <HoverPreview src={preview} className="-mx-2">
              <Link
                href={`/project/${project.slug}`}
                className="group flex items-center gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-foreground/[0.03]"
              >
                <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl">
                  {icon ? (
                    <Image
                      src={icon}
                      alt=""
                      width={44}
                      height={44}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-muted-foreground">
                      {title.charAt(0)}
                    </span>
                  )}
                </span>

                <span className="flex min-w-0 flex-col">
                  <span className="leading-snug font-medium text-foreground transition-colors group-hover:text-link">
                    {title}
                  </span>
                  <span className="truncate text-sm leading-snug text-muted-foreground">
                    {subtitle}
                  </span>
                </span>

                <ArrowUpRight className="ml-auto size-4 shrink-0 self-center text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </HoverPreview>
          </li>
        )
      })}
    </ul>
  )
}
