"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Monitor, Moon, Sun, X } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

type NavLink = { label: string; href: string }

// Custom hamburger glyph (uneven stacked bars) used for the mobile menu toggle.
function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <path fill="currentColor" d="M16 18v2H5v-2zm5-7v2H3v-2zm-2-7v2H8V4z" />
    </svg>
  )
}

// Light / Dark / System switcher for the mobile menu — mobile users have no
// keyboard, so the desktop `D` hotkey isn't reachable. `next-themes` persists
// the choice; "system" follows the OS preference live.
const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Theme is only known on the client; render the control after mount so the
  // active state doesn't mismatch the server-rendered HTML.
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      role="group"
      aria-label="Theme"
      className="mt-2 flex gap-1 border-t border-border pt-3"
    >
      {THEME_OPTIONS.map((option) => {
        const Icon = option.icon
        const active = mounted && theme === option.value

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => setTheme(option.value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs transition-colors",
              active
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-3.5" />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

// Client island: the toggle needs state, so it lives outside the server-rendered
// Navbar. Links are non-sensitive and passed in as plain props.
export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const rootRef = useRef<HTMLDivElement>(null)

  // Close the menu whenever the route changes (e.g. browser back/forward).
  // Adjusting state during render off a tracked previous value is React's
  // recommended pattern over a setState-in-effect.
  const [lastPathname, setLastPathname] = useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setOpen(false)
  }

  // Lock body scroll and allow Escape to dismiss while the menu is open.
  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    // Dismiss when a tap/click lands outside the toggle button and panel.
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="sm:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative z-40 -mr-2 inline-flex items-center justify-center p-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        {open ? <X className="size-4" /> : <MenuIcon className="size-4" />}
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-full z-40 border-b border-border bg-background/95 backdrop-blur-sm">
          <ul className="mx-auto flex max-w-2xl flex-col gap-1 px-6 py-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <ThemeSwitcher />
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  )
}
