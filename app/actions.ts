"use server"

import content from "@/data/content"

/**
 * Returns the contact email. Kept as a server action so the address is not
 * baked into the client JS bundle — it is only sent to the browser when the
 * user explicitly triggers a copy (e.g. presses `C`).
 */
export async function getContactEmail(): Promise<string> {
  return content.email
}
