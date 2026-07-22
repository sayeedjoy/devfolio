"use client"

import * as React from "react"

const TIME_ZONE = "Asia/Dhaka"

function format() {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: TIME_ZONE,
    hour12: false,
  })
}

export function LiveClock() {
  // Render nothing time-specific until mounted to avoid hydration mismatch.
  const [time, setTime] = React.useState<string | null>(null)

  React.useEffect(() => {
    // Seed the first value off the effect body to avoid a cascading render.
    const raf = requestAnimationFrame(() => setTime(format()))
    const id = setInterval(() => setTime(format()), 1000)
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(id)
    }
  }, [])

  return (
    <span className="font-mono tabular-nums" suppressHydrationWarning>
      {time ?? "--:--:--"} GMT+6
    </span>
  )
}
