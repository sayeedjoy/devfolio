import { ProjectPreview } from "@/components/project-preview"
import { Section, SectionLabel } from "@/components/section"
import content from "@/data/content"

export function Ventures() {
  return (
    <Section>
      <SectionLabel>Projects</SectionLabel>
      <div className="flex flex-col gap-1">
        {content.ventures.map((venture) => (
          <ProjectPreview key={venture.name} venture={venture} />
        ))}
      </div>
    </Section>
  )
}
