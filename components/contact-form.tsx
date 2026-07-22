"use client"

import * as React from "react"

import { getContactEmail } from "@/app/actions"
import { Button } from "@/components/ui/button"

/**
 * Visual chat-style contact form. Submits via `mailto:` only — there is no
 * server endpoint, network request, or secret involved. The recipient address
 * is fetched from the server action at submit time, so it is not embedded in
 * the static bundle.
 */
export function ContactForm() {
  const [sending, setSending] = React.useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSending(true)
    try {
      const form = event.currentTarget
      const data = new FormData(form)
      const name = String(data.get("name") ?? "").trim()
      const email = String(data.get("email") ?? "").trim()
      const message = String(data.get("message") ?? "").trim()

      const to = await getContactEmail()
      const subject = encodeURIComponent(`Hello from ${name || "your site"}`)
      const body = encodeURIComponent(
        `${message}\n\n— ${name}${email ? ` (${email})` : ""}`
      )
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`
    } finally {
      setSending(false)
    }
  }

  const fieldClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"

  return (
    <form onSubmit={onSubmit} className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        <label className="sr-only" htmlFor="contact-name">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          required
          maxLength={120}
          placeholder="Name"
          className={fieldClass}
        />
        <label className="sr-only" htmlFor="contact-email">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          maxLength={254}
          placeholder="Email"
          className={fieldClass}
        />
      </div>
      <label className="sr-only" htmlFor="contact-message">
        Message
      </label>
      <textarea
        id="contact-message"
        name="message"
        required
        maxLength={2000}
        rows={3}
        placeholder="Message"
        className={`${fieldClass} resize-none`}
      />
      <Button type="submit" size="sm" disabled={sending}>
        {sending ? "Opening…" : "Submit"}
      </Button>
    </form>
  )
}
