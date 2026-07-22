import Link from "next/link"

import content from "@/data/content"
import { MobileNav } from "@/components/mobile-nav"

// Hrefs are absolute (prefixed with "/") so section anchors resolve from any
// route, including /blog and individual post pages.
const NAV_LINKS = [
  { label: "/ABOUT", href: "/about" },
  { label: "/PROJECT", href: "/project" },
  { label: "/USES", href: "/uses" },
  { label: "/BLOG", href: "/blog" },
]

export function Navbar() {
  return (
    <header className="relative z-40 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-2xl items-center justify-between px-6 pt-8 pb-4 font-mono text-xs tracking-wider">
        <Link
          href="/"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {content.estYear}
        </Link>
        {/* Desktop: inline links. Mobile: hamburger menu (client island). */}
        <ul className="hidden gap-3 sm:flex sm:gap-4">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <MobileNav links={NAV_LINKS} />
      </nav>
    </header>
  )
}
