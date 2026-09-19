import Image from "next/image"
import {
  CodeIcon,
  DatabaseIcon,
  LineChartIcon,
  PenToolIcon,
  RocketIcon,
  SearchIcon,
} from "lucide-react"

import { ShaderBackground } from "@/components/motion/shader-background"
import content, { type CapabilityIcon, type Capabilities } from "@/data/content"
import { cn } from "@/lib/utils"

const BRING_ICONS: Record<
  CapabilityIcon,
  React.ComponentType<{ className?: string }>
> = {
  design: PenToolIcon,
  database: DatabaseIcon,
  code: CodeIcon,
  ship: RocketIcon,
  research: SearchIcon,
  growth: LineChartIcon,
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
}

/**
 * The "Grain — Pastel" preset behind the stat band. Shader colours are handed
 * to WebGL as literal values, so this is the one spot where hex is unavoidable
 * — it cannot read the CSS-variable tokens. Fixed across themes by design,
 * which is why the band sets a theme-stable dark foreground instead of
 * inheriting one. `ShaderBackground` freezes `speed` under reduced motion.
 */
const STAT_SHADER = {
  colors: ["#ffd6e8", "#c9e4ff", "#fff3c4", "#d9c9ff"],
  colorBack: "#ffffff",
  softness: 0.85,
  speed: 0.3,
}

/**
 * Grain band carrying the headline number, with the checklist beneath it in the
 * same card. The band takes an explicit height rather than stretching to fit
 * its parent: the shader canvas sizes itself from its own box, and a
 * content-height parent left it drawing outside the card.
 */
function StatCard({ stat }: { stat: Capabilities["stat"] }) {
  return (
    <div className="relative min-h-44 overflow-hidden rounded-2xl border border-border text-panel">
      <div aria-hidden="true" className="absolute inset-0">
        <ShaderBackground {...STAT_SHADER} />
      </div>

      <div className="relative flex h-full min-h-44 flex-col justify-end p-5">
        <p className="text-4xl leading-none font-semibold tracking-tight sm:text-5xl">
          {stat.value}
        </p>
        <p className="mt-2 text-sm font-medium">{stat.label}</p>
      </div>
    </div>
  )
}

/** Checklist beside the stat; the column is narrow, so the items stack. */
function BringCard({ bring }: { bring: Capabilities["bring"] }) {
  return (
    <div className="rounded-2xl border border-border bg-muted p-5">
      <p className="text-sm text-muted-foreground">{bring.label}</p>
      <ul className="mt-4 flex flex-col gap-2.5">
        {bring.items.map((item) => {
          const Icon = BRING_ICONS[item.icon]
          return (
            <li
              key={item.text}
              className="flex items-center gap-2.5 text-sm font-medium text-foreground"
            >
              <Icon className="size-4 shrink-0 text-muted-foreground" />
              {item.text}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/**
 * Always-dark panel: the claim on the left, the range on the right. The band
 * above the numerals is a CSS dot screen — a dither texture, so it costs no
 * image and scales with the type.
 */
function PitchCard({ pitch }: { pitch: Capabilities["pitch"] }) {
  return (
    <div className="flex flex-col gap-7 rounded-2xl border border-border bg-panel p-5 text-panel-foreground sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <p className="text-base leading-snug font-semibold text-balance sm:max-w-80">
        {pitch.text}
      </p>

      <div className="sm:shrink-0">
        <div
          aria-hidden="true"
          className="h-5 w-full rounded-xs bg-[radial-gradient(currentColor_0.6px,transparent_0.6px)] [mask-image:linear-gradient(to_bottom,black,transparent)] bg-[length:3px_3px] opacity-45"
        />
        <p className="mt-1 flex items-baseline gap-3 font-mono text-4xl leading-none tracking-tight tabular-nums sm:text-5xl">
          <span>{pitch.from}</span>
          <span aria-hidden="true" className="text-3xl opacity-60">
            &rarr;
          </span>
          <span>{pitch.to}</span>
        </p>
      </div>
    </div>
  )
}

/** Quote card: brand, the quote itself, then the attribution. */
function TestimonialCard({
  testimonial,
}: {
  testimonial: Capabilities["testimonial"]
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-center gap-2">
        {testimonial.brandLogo ? (
          <Image
            src={testimonial.brandLogo}
            alt=""
            width={20}
            height={20}
            className="size-5 rounded-[6px] object-contain"
          />
        ) : (
          <span className="flex size-5 items-center justify-center rounded-[6px] bg-linear-135 from-flare-1 to-flare-2 text-[10px] font-bold text-flare-foreground">
            {testimonial.brand.charAt(0)}
          </span>
        )}
        <span className="text-sm font-semibold text-foreground">
          {testimonial.brand}
        </span>
      </div>

      <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">
        &lsquo;{testimonial.quote}
        <span className="font-semibold text-foreground">
          {testimonial.highlight}
        </span>
        &rsquo;
      </blockquote>

      <div className="mt-5 flex items-center gap-2.5">
        {testimonial.avatar ? (
          <Image
            src={testimonial.avatar}
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-8 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
            {initials(testimonial.author)}
          </span>
        )}
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-medium text-foreground">
            {testimonial.author}
          </span>
          <span className="text-sm text-muted-foreground">
            {testimonial.role}
          </span>
        </span>
      </div>
    </div>
  )
}

/**
 * Vertical stack, inside the page column at every width. Three cards rather
 * than four loose boxes — textured, then dark, then bordered — so the block
 * reads as one object. Each card uses the width by laying out horizontally
 * inside instead of competing for it as columns.
 */
export function CapabilityCards({ className }: { className?: string }) {
  const { stat, bring, pitch, testimonial } = content.capabilities

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Stat and checklist share a row; pitch and quote stack beneath. */}
      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard stat={stat} />
        <BringCard bring={bring} />
      </div>
      <PitchCard pitch={pitch} />
      <TestimonialCard testimonial={testimonial} />
    </div>
  )
}
