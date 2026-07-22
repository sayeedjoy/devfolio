import { Section, SectionLabel } from "@/components/section"
import content from "@/data/content"

const STACK_OFFSETS = [
  "-rotate-6 -translate-x-6",
  "rotate-3 translate-x-2",
  "rotate-[8deg] translate-x-10",
]

export function StuffIDo() {
  return (
    <Section>
      <SectionLabel>Stuff I Do</SectionLabel>
      <p className="text-xl leading-snug font-medium text-balance sm:text-2xl">
        {content.stuffIDo}
      </p>

      {/* CSS-only 3D card stack — no extra dependency */}
      <div
        className="mt-8 flex h-44 items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        <div className="relative" style={{ transformStyle: "preserve-3d" }}>
          {STACK_OFFSETS.map((offset, i) => (
            <div
              key={i}
              className={`absolute h-40 w-64 rounded-xl border border-border bg-muted shadow-xl ${offset}`}
              style={{
                transform: `translateZ(${i * 18}px)`,
                left: "-8rem",
                top: "-5rem",
              }}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}
