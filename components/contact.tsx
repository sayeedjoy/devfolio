import { CopyEmailButton } from "@/components/copy-email-button"
import { GitHubIcon, LinkedInIcon } from "@/components/social-icons"
import { Section, SectionLabel } from "@/components/section"
import { buttonVariants } from "@/components/ui/button"
import content from "@/data/content"

const SOCIAL_ICONS = {
  linkedin: LinkedInIcon,
  github: GitHubIcon,
}

function Bubble({
  from,
  children,
}: {
  from: "visitor" | "me"
  children: React.ReactNode
}) {
  // Fixed (non-percentage) cap so a bubble wraps at the same point on every
  // screen size, rather than scaling with the viewport.
  if (from === "visitor") {
    return (
      <div className="flex justify-end">
        <p className="max-w-xs rounded-2xl rounded-br-md bg-bubble px-3.5 py-2 text-sm text-bubble-foreground">
          {children}
        </p>
      </div>
    )
  }
  return (
    <div className="flex justify-start">
      <div className="max-w-xs rounded-2xl rounded-bl-md bg-muted px-3.5 py-2 text-sm text-foreground">
        {children}
      </div>
    </div>
  )
}

export function Contact() {
  return (
    <Section id="contact">
      <SectionLabel>Contact</SectionLabel>
      <div className="space-y-2.5">
        <Bubble from="visitor">how do i actually reach you?</Bubble>
        <Bubble from="me">
          easiest is email — or pick whatever&apos;s below.
          <div className="mt-2.5 flex gap-1.5">
            <CopyEmailButton />
            {content.contact.socials.map((social) => {
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
          </div>
        </Bubble>
      </div>
    </Section>
  )
}
