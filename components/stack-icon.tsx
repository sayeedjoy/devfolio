import { MY_STACKS } from "@/lib/stackicon"
import { cn } from "@/lib/utils"

export function StackIcon({
  name,
  className,
  size = 16,
}: {
  name: string
  className?: string
  size?: number
}) {
  const Icon = MY_STACKS[name]
  if (!Icon) return null

  return (
    <Icon size={size} aria-label={name} className={cn("shrink-0", className)} />
  )
}
