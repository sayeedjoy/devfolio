# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page personal portfolio (`DevFolio`) built on Next.js 16 (App Router) + React 19 + Tailwind v4 + shadcn/ui. Minimal, content-first, narrow centered column, light/dark themes via `next-themes`. See `SPEC.md` for the full task breakdown and `style.md` for the design language.

## Next.js version warning

This is Next.js **16**, which has breaking changes from earlier versions you may know. Per `AGENTS.md`: read the relevant guide in `node_modules/next/dist/docs/` before writing Next-specific code, and heed deprecation notices. Don't assume APIs/conventions from training data.

## Commands

This project uses **pnpm**.

- `pnpm dev` — dev server (Turbopack), bound to `localhost:1408`
- `pnpm build` — production build
- `pnpm start` — production server, bound to `localhost:1408`
- `pnpm lint` — ESLint (`eslint-config-next`)
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm format` — Prettier write over `**/*.{ts,tsx}`

Both `dev` and `start` are intentionally pinned to `-H localhost -p 1408`. There is no test suite. Standard verification is `pnpm typecheck && pnpm build`.

## The privacy architecture (most important constraint)

All site content lives in **`data/content.ts`** — a single typed default export that is the source of truth for profile, experience, ventures, stack, writing, personal, and contact data.

**Hard rule: `data/content.ts` must only ever be imported by Server Components or Server Actions.** It must never be imported into a file marked `"use client"`, and its values must never be surfaced via `NEXT_PUBLIC_*` env vars or a public API route. This keeps the raw dataset out of the client JS bundle so it can't be read from browser dev tools.

The email is held to an even stricter standard: it is exposed only through the `getContactEmail()` Server Action in `app/actions.ts`, returned to the browser only on an explicit user gesture (the `C` hotkey → clipboard). Don't put the email into static props or rendered HTML.

When adding sections or fields, edit `data/content.ts` (and its TypeScript interfaces) rather than hardcoding content in components.

## Structure & conventions

- `app/page.tsx` composes the page by stacking section components inside a `max-w-2xl` centered `<main>`. Sections are Server Components by default.
- `components/` — section components (server) plus small **client islands** for interactivity: `email-copy-hotkey`, `live-clock`, `project-preview`, `contact-form`, `theme-provider`. Keep client islands thin and pass them only minimal, non-sensitive props.
- `components/ui/` — shadcn components. Add with `npx shadcn@latest add <name>` (config in `components.json`, style `base-nova`, lucide icons).
- Import alias `@/*` maps to the repo root (e.g. `@/components/...`, `@/lib/utils`, `@/data/content`).
- Tech-stack icons: `lib/stackicon.ts` maps stack names → icon components (`@dev.icons/react` plus local SVGs in `components/custom-icons.tsx`). `MY_STACKS` is the full registry; `HOME_STACKS` selects/orders what renders on the page. Every `HOME_STACKS` entry must be a key of `MY_STACKS`.
- Theme: colors come from CSS-variable tokens in `app/globals.css` (`bg-background`/`text-foreground`, accent tokens). Don't hardcode hex values in components — both light and dark must read correctly.

## Security headers

`next.config.ts` applies a CSP and security headers (`X-Frame-Options: DENY`, nosniff, Referrer-Policy, Permissions-Policy) to every route. `script-src` only relaxes `'unsafe-eval'` in dev (React/Turbopack need it); production stays stricter. If you add external scripts, fonts, or connections, update the CSP directives there or they'll be blocked.

## Code style

Prettier config: no semicolons, double quotes (`.prettierrc`). Match the existing commented, explanatory style in `lib/` and config files.
