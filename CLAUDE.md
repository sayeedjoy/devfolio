# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`DevFolio` — a personal portfolio and blog, open-sourced as a reusable template. Next.js 16 (App Router) + React 19 + Tailwind v4 + shadcn/ui. Minimal and content-first: a narrow centered column (`max-w-2xl`), light/dark via `next-themes`.

Routes: `/`, `/about`, `/uses`, `/blog`, `/blog/[slug]`, `/blog/tag/[tag]`, `/project`, `/project/[slug]`, plus the machine-readable routes below.

## Next.js version warning

This is Next.js **16**, which has breaking changes from the versions in your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next-specific code, and heed deprecation notices rather than assuming APIs from memory. `.agents/skills/next-best-practices/` holds topic-scoped notes (RSC boundaries, async APIs, metadata, route handlers, caching).

## Commands

This project uses **pnpm**.

- `pnpm dev` — dev server (Turbopack), pinned to `-H localhost -p 1408`
- `pnpm build` — production build
- `pnpm start` — production server, binds `-H 0.0.0.0 -p ${PORT:-3000}` for deployment
- `pnpm lint` — ESLint (`eslint-config-next`)
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm format` — Prettier write over `**/*.{ts,tsx}`

There is no test suite. Standard verification is `pnpm typecheck && pnpm build`.

## Content model

Site content is split one file per section under `data/` (`profile`, `work`, `experience`, `education`, `stack`, `ventures`, `personal`, `contact`, `uses`). `data/content.ts` composes those slices into a single typed default export and re-exports `data/types.ts`, so `@/data/content` stays the one import surface for the app.

Add sections or fields by editing `data/*.ts` and `data/types.ts` — don't hardcode content in components.

`work.ts` and `experience.ts` are two different shapes of the same work history (detailed multi-position entries vs. a compact list) consumed by different components; updating one does not update the other.

## Server-only boundary

`data/content.ts`, `lib/blog.ts`, and `lib/project.ts` are server-only: import them only from Server Components, Server Actions, or route handlers. Never import them into a `"use client"` file, and never surface their values through `NEXT_PUBLIC_*` env vars or a public API route. `lib/blog.ts` and `lib/project.ts` use Node `fs`; `data/content.ts` keeps the raw dataset out of the client JS bundle.

The email is held to a stricter standard: it is exposed only through `getContactEmail()` in `app/actions.ts`, returned to the browser on an explicit user gesture (the `C` hotkey → clipboard). Don't put it into props or rendered HTML.

The public README intentionally no longer documents this boundary, but the code still depends on it.

## MDX content pipeline

Posts live in `content/blog/*.mdx` and `content/project/*.mdx`. `lib/blog.ts` and `lib/project.ts` read them with `fs` + `gray-matter`, validate frontmatter (a missing `title`, `description`, or `date` throws and fails the build), compute reading time, and wrap the directory read in React `cache()` so a single request parses it once across `generateStaticParams`, `generateMetadata`, and the page. Posts marked `draft: true` are hidden in production and visible in dev.

Rendering happens in `components/mdx.tsx` via `next-mdx-remote`. Plugin order matters: `lib/rehype-mermaid.ts` must run **before** `rehype-pretty-code`, since it lifts ` ```mermaid ` blocks into a custom `<mermaid>` element so Shiki never mangles the diagram source; the client component `components/mermaid.tsx` renders it.

## Machine-readable surface

The site is built to be consumed by crawlers and agents, not only browsers:

- Every content page has a markdown twin at `<route>/index.md` (e.g. `app/blog/[slug]/index.md/route.ts`).
- `/llms.txt`, `/openapi.json`, `/rss.xml`, `/sitemap.xml`, `/robots.txt`, and `.well-known/{api-catalog,oauth-authorization-server,oauth-protected-resource}`.
- `next.config.ts` advertises the api-catalog and llms.txt through a `Link` header on every response.

Adding a page means updating `app/sitemap.ts` and `app/llms.txt/route.ts`, and giving it an `index.md` twin.

## Site URL

`lib/site.ts` resolves the canonical origin as `SITE_URL` → Vercel host → localhost, and **throws during a production build** when none resolves, so localhost URLs are never published to crawlers and feeds. It is a plain (non-`NEXT_PUBLIC_`) env var by design.

## Components & conventions

- `app/page.tsx` stacks section components inside a `max-w-2xl` centered `<main>`. Sections are Server Components by default.
- Interactivity lives in thin client islands (`theme-provider`, `email-copy-hotkey`, `live-clock`, `project-preview`, `contact-form`, `mermaid`, and a few others). Keep them thin and pass only minimal, non-sensitive props.
- `components/hover-preview.tsx` — reusable `<HoverPreview src="/projects/hover/x.webp">` wrapper. Wrap any row and it parks a screenshot in the free page gutter on hover/focus, falling back to a card over the column when neither gutter fits, and rendering nothing on coarse pointers or without a `src`. The card takes each image's own aspect ratio (read on first load, cached per path), so binding a screenshot is just a path — portrait and landscape shots both fit uncropped. Project screenshots live in `public/projects/hover/`; bound from `Venture.preview`, `ExperienceItem.preview`, `ExperienceItemType.preview` (company level only — nesting one per position would open two cards), and the `preview` frontmatter field on project MDX.
- `components/ui/` — shadcn. Add with `npx shadcn@latest add <name>`. `components.json` uses style `base-nova`, lucide icons, and registers extra registries (`@ncdai`, `@soundcn`, `@kibo-ui`).
- Stack icons: `lib/stackicon.ts` maps stack names → icon components (`@dev.icons/react` plus local SVGs in `components/custom-icons.tsx`). `MY_STACKS` is the full registry; `HOME_STACKS` selects and orders what renders on the home page. Every `HOME_STACKS` entry must be a key of `MY_STACKS`.
- The theme toggle plays a click sound: `components/theme-provider.tsx` → `lib/sound-engine.ts` (Web Audio, cached decoded buffers) with the sample inlined as a data URI in `lib/switch-005.ts`.
- Import alias `@/*` maps to the repo root.

## Styling

Colors come from CSS-variable tokens in `app/globals.css` (`bg-background`, `text-foreground`, accent tokens). Don't hardcode hex values — both light and dark must read correctly. Fonts are Geist and Geist Mono via `next/font/google`, exposed as `--font-sans` / `--font-mono`.

## Security headers & CSP

`next.config.ts` applies a CSP plus `X-Frame-Options: DENY`, nosniff, Referrer-Policy, and Permissions-Policy to every route. `script-src` relaxes `'unsafe-eval'` only in dev (React/Turbopack need it); production stays stricter, with `connect-src 'self'`, `frame-ancestors 'none'`, and `object-src 'none'`. Adding external scripts, fonts, or network calls requires updating these directives or they will be blocked.

`images.remotePatterns` allows `res.cloudinary.com` for blog covers, and `qualities: [75, 100]` is set because Next 16 coerces any `quality` above its default allowlist down to 75.

## Code style

Prettier: no semicolons, double quotes, 2-space tabs, 80 cols, with `prettier-plugin-tailwindcss` sorting classes (`.prettierrc`; `cn` and `cva` are registered as class-bearing functions). Match the existing commented, explanatory style in `lib/` and the config files.
