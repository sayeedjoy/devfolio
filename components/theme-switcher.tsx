"use client"

import type { JSX } from "react"
import { useSyncExternalStore } from "react"
import { AnimatePresence, motion } from "motion/react"
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { playSound } from "@/lib/sound-engine"
import { switch005Sound } from "@/lib/switch-005"

// Same click the `D` hotkey plays (components/theme-provider.tsx).
// Fire-and-forget: a play failure (e.g. no user gesture yet) shouldn't block
// the theme change.
function playSwitchSound() {
  void playSound(switch005Sound.dataUri, { volume: 0.5 }).catch(() => {})
}

// Theme is only known on the client; render the controls after mount so the
// active state doesn't mismatch the server-rendered HTML.
function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

function ThemeOption({
  icon,
  value,
  isActive,
  onClick,
}: {
  icon: JSX.Element
  value: string
  isActive?: boolean
  onClick: (value: string) => void
}) {
  return (
    <button
      data-active={isActive}
      className="relative flex size-8 items-center justify-center rounded-full text-muted-foreground transition-[color] hover:text-foreground data-[active=true]:text-foreground [&_svg]:size-4"
      role="radio"
      aria-checked={isActive}
      aria-label={`Switch to ${value} theme`}
      onClick={() => onClick(value)}
    >
      {icon}

      {isActive && (
        <motion.span
          layoutId="theme-option"
          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
          className="absolute inset-0 rounded-full border"
        />
      )}
    </button>
  )
}

const THEME_OPTIONS = [
  {
    icon: <MonitorIcon />,
    value: "system",
  },
  {
    icon: <SunIcon />,
    value: "light",
  },
  {
    icon: <MoonIcon />,
    value: "dark",
  },
]

// Full three-way control (system / light / dark). Used in the mobile menu,
// where there's room for the segmented pill and no `D` hotkey to fall back on.
function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const isMounted = useIsMounted()

  if (!isMounted) {
    return <div className="flex h-8 w-24" />
  }

  return (
    <motion.div
      key={String(isMounted)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center overflow-clip rounded-full bg-background inset-ring-1 inset-ring-border"
      role="radiogroup"
    >
      {THEME_OPTIONS.map((option) => (
        <ThemeOption
          key={option.value}
          icon={option.icon}
          value={option.value}
          isActive={theme === option.value}
          onClick={(value) => {
            playSwitchSound()
            setTheme(value)
          }}
        />
      ))}
    </motion.div>
  )
}

// Compact single-icon variant for the desktop navbar: it shows the theme
// currently in effect and flips to the other one. "system" resolves to whichever
// the OS asked for, so the first click just pins that choice's opposite.
function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const isMounted = useIsMounted()

  if (!isMounted) {
    return <div className="size-8" />
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className={
        "relative flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-4 " +
        (className ?? "")
      }
      onClick={() => {
        playSwitchSound()
        setTheme(isDark ? "light" : "dark")
      }}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={isDark ? "dark" : "light"}
          initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {isDark ? <MoonIcon /> : <SunIcon />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export { ThemeSwitcher, ThemeToggle }
