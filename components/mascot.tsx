"use client"

// page-mascot ships without a "use client" directive, and it tracks the pointer
// with hooks, so it needs this boundary before a Server Component can render it.
export { Mascot } from "page-mascot"
