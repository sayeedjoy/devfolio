"use client"

import * as React from "react"

import { getContactEmail } from "@/app/actions"

export interface ConsoleGreetingProps {
  banner: string
  tagline: string
  aside: string
  handle: string
  /** e.g. "example.com" — the `handle@host` profile title */
  host: string
  siteUrl: string
  name: string
  summary: string
  /** label → value rows printed below the banner */
  facts: [label: string, value: string][]
  stack: { label: string; items: string[] }[]
  projects: { name: string; description: string; href: string }[]
  wins: string[]
  posts: { title: string; date: string; url: string }[]
  testimonial: { quote: string; author: string; role: string; org: string }
  links: { label: string; href: string }[]
}

// DevTools supports text styling, not page layout. Each log is a readable row;
// the shared gutter and section rails give the output its own visual identity.
const SUNSET = [
  "#d97706",
  "#ea580c",
  "#dc2626",
  "#e11d48",
  "#db2777",
  "#c026d3",
]
// Consolas is named because Windows has none of the others, and the generic
// fallback can draw the banner's box characters at the wrong width.
const MONO =
  "font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;line-height:1.8"
const S = {
  plain: MONO,
  bold: `${MONO};font-weight:700`,
  muted: `${MONO};color:#808080`,
  key: `${MONO};color:#b56b2a;font-weight:700`,
  prompt: `${MONO};color:${SUNSET[0]};font-weight:700`,
  star: `${MONO};color:${SUNSET[3]}`,
  quote: `${MONO};font-style:italic`,
  heading: `${MONO};color:#d97706;font-weight:700`,
}

type Part = [text: string, style: string]

// One console entry from styled parts (newlines allowed inside a part). Text
// goes through %s rather than into the format string, so a stray "%" in
// content can't be read as a directive.
function log(...parts: Part[]) {
  console.log(
    parts.map(() => "%c%s").join(""),
    ...parts.flatMap(([text, style]) => [style, text])
  )
}

function width(values: string[]) {
  return Math.max(0, ...values.map((v) => v.length)) + 3
}

/** Greedy word wrap for the recommendation. */
function wrap(text: string, max: number) {
  const lines: string[] = []
  let line = ""
  for (const word of text.split(" ")) {
    if (line && line.length + word.length + 1 > max) {
      lines.push(line)
      line = word
    } else {
      line = line ? `${line} ${word}` : word
    }
  }
  return [...lines, line]
}

function row(...parts: Part[]) {
  log(["  │  ", S.muted], ...parts)
}

function section(title: string) {
  log(["  │\n", S.muted], [`  ├── ${title}`, S.heading])
}

/** The sunset wordmark is the signature; everything below stays restrained. */
function printCard(props: ConsoleGreetingProps) {
  const { banner, name, tagline, summary, aside, host, facts } = props
  const art = banner.replace(/^\n/, "").split("\n")
  log(
    ...art.map(
      (line, i): Part => [
        `${line}\n`,
        `${MONO};line-height:1.1;color:${SUNSET[Math.min(i, SUNSET.length - 1)]}`,
      ]
    )
  )
  log(
    ["  ┌── ", S.heading],
    ["JOY / PORTFOLIO", S.bold],
    [`  ·  ${host}`, S.muted]
  )
  row([tagline, S.bold])
  row(
    [name, S.bold],
    [`  /  ${facts.find(([label]) => label === "Role")?.[1] ?? ""}`, S.muted]
  )
  row([summary, S.plain])
  row([aside, S.muted])
}

function printProjects({ projects, handle }: ConsoleGreetingProps) {
  section("Projects")
  const nameW = width(projects.map((p) => p.name))
  const descW = width(projects.map((p) => p.description))
  for (const p of projects) {
    row(
      [p.name.padEnd(nameW), S.bold],
      [p.description.padEnd(descW), S.muted],
      [p.href, S.plain]
    )
  }
  row([`Show projects: ${handle}.projects()`, S.muted])
}

function printWins({ wins, handle }: ConsoleGreetingProps) {
  // "Codeforces — 250+ Problems" splits into a bold name and its result.
  const rows = wins.map((w) => w.split(" — ") as [string, string?])
  const w = width(rows.map(([name]) => name))
  section("Achievements")
  for (const [name, result = ""] of rows) {
    row(["✦  ", S.star], [name.padEnd(w), S.bold], [result, S.plain])
  }
  row([`Show achievements: ${handle}.wins()`, S.muted])
}

function printPosts({ posts, handle }: ConsoleGreetingProps) {
  section("Latest blog posts")
  if (!posts.length) row(["No posts published yet.", S.muted])
  for (const p of posts) {
    row([`${p.date}  `, S.muted], [p.title, S.bold])
    row([p.url, S.plain])
  }
  row([`Show posts: ${handle}.posts()`, S.muted])
}

function printTestimonial({ testimonial: t }: ConsoleGreetingProps) {
  section("Recommendation")
  for (const line of wrap(`“${t.quote}”`, 92)) row([line, S.quote])
  row([`— ${t.author}`, S.bold], [` / ${t.role} · ${t.org}`, S.muted])
}

function printStack({ stack }: ConsoleGreetingProps) {
  section("Tech stack")
  const labelW = width(stack.map((group) => group.label))
  for (const group of stack) {
    row([group.label.padEnd(labelW), S.key], [group.items.join(" · "), S.plain])
  }
}

function printLinks({ links, handle }: ConsoleGreetingProps) {
  const w = width(links.map((l) => l.label))
  section("Contact & links")
  for (const l of links) row([l.label.padEnd(w), S.key], [l.href, S.plain])
  row(
    ["Email".padEnd(w), S.key],
    [`${handle}.email()`, S.prompt],
    ["  copy my address", S.muted]
  )
}

function printGreeting(props: ConsoleGreetingProps) {
  const { handle, siteUrl } = props
  printCard(props)
  printProjects(props)
  printWins(props)
  printStack(props)
  printPosts(props)
  printTestimonial(props)
  printLinks(props)
  log(
    ["  │\n  └── ", S.heading],
    ["Console commands", S.bold],
    [` · Type ${handle}.help() to see all commands.`, S.muted]
  )
  log(
    ["       AI-readable portfolio: ", S.muted],
    [`${siteUrl}/llms.txt`, S.plain]
  )
}

/** The `<handle>.*()` commands, installed on `window`. */
function createCommands(props: ConsoleGreetingProps) {
  const run = (print: (p: ConsoleGreetingProps) => void) => () => {
    print(props)
  }

  return {
    help: () => {
      const rows: [string, string][] = [
        ["about()", "my profile and background"],
        ["projects()", "what I'm building, with links"],
        ["wins()", "milestones and achievements"],
        ["posts()", "latest writing"],
        ["links()", "where to find me"],
        ["email()", "copy my email to the clipboard"],
      ]
      const w = width(rows.map(([c]) => `${props.handle}.${c}`))
      log(
        ...rows.flatMap(([c, desc]): Part[] => [
          [`${props.handle}.${c}`.padEnd(w), S.prompt],
          [`${desc}\n`, S.muted],
        ])
      )
    },
    about: run(printCard),
    projects: run(printProjects),
    wins: run(printWins),
    posts: run(printPosts),
    links: run(printLinks),
    // Typing the command is the explicit gesture: the address is fetched from
    // the Server Action only now, never shipped in props.
    email: () => {
      void getContactEmail().then(async (email) => {
        try {
          await navigator.clipboard.writeText(email)
          log(["Copied to clipboard ✓", S.prompt])
        } catch {
          // DevTools holds focus, so the page often can't write the clipboard.
          log([email, S.bold])
        }
      })
    },
  }
}

// Module-level so StrictMode's double effect in dev still prints once.
let printed = false

/** Prints a styled greeting to the DevTools console once per page load. */
export function ConsoleGreeting(props: ConsoleGreetingProps) {
  React.useEffect(() => {
    if (printed) return
    printed = true
    printGreeting(props)
    Object.assign(window, { [props.handle]: createCommands(props) })
  }, [props])

  return null
}
