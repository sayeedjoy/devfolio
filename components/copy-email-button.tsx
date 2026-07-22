"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

import { getContactEmail } from "@/app/actions"
import { Button } from "@/components/ui/button"

export function CopyEmailButton({ className }: { className?: string }) {
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
    <Button
      size="sm"
      variant="secondary"
      onClick={onClick}
      className={className}
    >
      {copied ? (
        <>
          <Check className="size-4" />
          Copied
        </>
      ) : (
        <>
          <Copy className="size-4" />
          Email
        </>
      )}
    </Button>
  )
}
