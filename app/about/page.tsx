import type { Metadata } from "next"
import { GraduationCapIcon } from "lucide-react"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import type { ExperienceItemType } from "@/components/work-experience"
import { WorkExperience } from "@/components/work-experience"
import { buttonVariants } from "@/components/ui/button"
import content from "@/data/content"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "About",
  description:
    "Something about me — plus where I've worked, what I've built, and where I studied.",
  alternates: { canonical: `${SITE_URL}/about` },
}

// Education reuses the work-experience shape; give positions a graduation-cap
// icon so they read as study rather than employment.
function withEducationIcon(items: ExperienceItemType[]): ExperienceItemType[] {
  return items.map((item) => ({
    ...item,
    positions: item.positions.map((position) => ({
      ...position,
      icon: position.icon ?? <GraduationCapIcon />,
    })),
  }))
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.12.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.12-1.38c.66-.66 1.08-1.33 1.38-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.12A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-10.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
    </svg>
  )
}

const SOCIAL_ICONS = {
  linkedin: LinkedInIcon,
  github: GitHubIcon,
}

export default function AboutPage() {
  const { work, education, profile, contact, personal } = content
  const educationItems = withEducationIcon(education)

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-10">
        {/* About Me */}
        <section className="mb-12">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight">About Me</h1>
            <p className="mt-2 text-muted-foreground">Who, what, why</p>
          </header>

          <div className="mt-6 space-y-3 text-base leading-relaxed text-muted-foreground">
            {profile.bio.map((line, i) => (
              <p key={i}>
                {line.map((seg, j) =>
                  typeof seg === "string" ? (
                    <span key={j}>{seg}</span>
                  ) : seg.type === "link" ? (
                    <a
                      key={j}
                      href={seg.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-foreground transition-colors hover:text-foreground/70"
                    >
                      {seg.text}
                    </a>
                  ) : (
                    <span key={j} className="font-medium text-foreground">
                      {seg.text}
                    </span>
                  )
                )}
              </p>
            ))}
          </div>

          {/* Social icons */}
          <div className="mt-6 flex flex-wrap gap-1.5">
            {contact.socials.map((social) => {
              const Icon = social.icon ? SOCIAL_ICONS[social.icon] : null
              return (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    size: "sm",
                    variant: "secondary",
                  })}
                >
                  {Icon ? <Icon className="size-4" /> : null}
                  {social.label}
                </a>
              )
            })}
            {personal.instagram ? (
              <a
                href={personal.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ size: "sm", variant: "secondary" })}
              >
                <InstagramIcon className="size-4" />
                Instagram
              </a>
            ) : null}
          </div>
        </section>

        {/* Work — moved here from the old /work page */}
        <section>
          <h2 className="mb-1 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Experience
          </h2>
          <WorkExperience className="bg-transparent px-0" experiences={work} />
        </section>

        <section className="mt-8">
          <h2 className="mb-1 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Education
          </h2>
          <WorkExperience
            className="bg-transparent px-0"
            experiences={educationItems}
          />
        </section>

        <Footer minimal />
      </main>
    </>
  )
}
