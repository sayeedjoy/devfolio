import { Section, SectionIntro, SectionLabel } from "@/components/section"
import { StackIcon } from "@/components/stack-icon"
import { HOME_STACKS } from "@/lib/stackicon"

export function Stack() {
  return (
    <Section>
      <SectionLabel>Stack</SectionLabel>

      <SectionIntro className="mb-4">Tools and tech I build with.</SectionIntro>

      <ul className="flex flex-wrap gap-2">
        {HOME_STACKS.map((name) => (
          <li
            key={name}
            className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors dark:border-foreground/15 dark:bg-foreground/[0.06] dark:hover:bg-foreground/[0.1]"
          >
            <StackIcon name={name} size={16} />
            {name}
          </li>
        ))}
      </ul>
    </Section>
  )
}
