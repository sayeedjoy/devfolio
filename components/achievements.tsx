import { AchievementBlock } from "@/components/achievement-block"
import { Section, SectionLabel } from "@/components/section"
import content from "@/data/content"

export function Achievements() {
  if (!content.achievements.length) return null

  return (
    <Section>
      <SectionLabel>Achievements</SectionLabel>
      <div className="grid gap-3 sm:grid-cols-2">
        {content.achievements.map((achievement) => (
          <AchievementBlock key={achievement.title} achievement={achievement} />
        ))}
      </div>
    </Section>
  )
}
