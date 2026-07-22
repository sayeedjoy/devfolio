import { cn } from "@/lib/utils"

function Section({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("py-5", className)} {...props}>
      {children}
    </section>
  )
}

function SectionLabel({
  className,
  children,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "mb-4 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

function SectionIntro({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        // On mobile, keep the subtitle to a single 13px line (force no-wrap).
        // sm+ reverts to the normal balanced, wrapping treatment.
        "mb-5 text-[13px] leading-relaxed text-muted-foreground max-sm:whitespace-nowrap sm:text-base sm:text-balance",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export { Section, SectionIntro, SectionLabel }
