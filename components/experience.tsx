import Image from "next/image"

import { HoverPreview } from "@/components/hover-preview"
import { Section, SectionIntro, SectionLabel } from "@/components/section"
import content from "@/data/content"

export function Experience() {
  const { experience } = content
  return (
    <Section id="work">
      <SectionLabel>Experience</SectionLabel>
      <SectionIntro>{experience.intro}</SectionIntro>
      <div className="space-y-5">
        {experience.items.map((item, i) => (
          <HoverPreview key={i} src={item.preview}>
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-[120px_1fr] sm:gap-6">
              <div className="pt-0.5 font-mono text-xs tracking-wide text-muted-foreground">
                {item.range}
              </div>
              <div className="min-w-0">
                <h3 className="flex flex-wrap items-center gap-1.5 font-medium">
                  {item.role}{" "}
                  <span className="font-normal text-muted-foreground">at</span>
                  {item.logo ? (
                    <Image
                      src={item.logo}
                      alt={item.company}
                      width={20}
                      height={20}
                      className="size-5 rounded object-cover"
                    />
                  ) : null}
                  {item.company}
                </h3>
                <p className="mt-1 max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          </HoverPreview>
        ))}
      </div>
    </Section>
  )
}
