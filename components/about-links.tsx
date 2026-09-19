"use client"

import * as React from "react"
import { ArrowUpRight, Check, GlobeIcon, MailIcon } from "lucide-react"

import { getContactEmail } from "@/app/actions"
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/social-icons"
import type { AboutLink, LinkIcon } from "@/data/content"

const ICONS: Record<LinkIcon, React.ComponentType<{ className?: string }>> = {
  email: MailIcon,
  x: XIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  website: GlobeIcon,
}

const ROW =
  "group -mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-foreground/[0.03]"

function RowBody({
  link,
  value,
  trailing,
}: {
  link: AboutLink
  value: string
  trailing: React.ReactNode
}) {
  const Icon = ICONS[link.icon]
  return (
    <>
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span className="text-sm font-medium text-foreground">{link.label}</span>
      <span className="ml-auto truncate text-sm text-muted-foreground">
        {value}
      </span>
      {trailing}
    </>
  )
}

const Arrow = (
  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
)

/**
 * The email row never renders the address. It asks the server action for it on
 * click and writes it straight to the clipboard — same contract as the `C`
 * hotkey, so the address stays out of the HTML and the client bundle.
 */
function EmailRow({ link }: { link: AboutLink }) {
  const [copied, setCopied] = React.useState(false)

  async function onClick() {
    try {
      const email = await getContactEmail()
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable; ignore.
    }
  }

  return (
    <button type="button" onClick={onClick} className={ROW}>
      <RowBody
        link={link}
        value={copied ? "copied" : link.value}
        trailing={
          copied ? (
            <Check className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            Arrow
          )
        }
      />
    </button>
  )
}

/**
 * Contact rail at the foot of /about. Takes plain, public link data as props —
 * never the email itself.
 */
export function AboutLinks({ links }: { links: AboutLink[] }) {
  return (
    <div className="flex flex-col">
      {links.map((link) =>
        link.href ? (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={ROW}
          >
            <RowBody link={link} value={link.value} trailing={Arrow} />
          </a>
        ) : (
          <EmailRow key={link.label} link={link} />
        )
      )}
    </div>
  )
}
