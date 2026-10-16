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

// DevTools supports text styling, not page layout. Each log is one plain row;
// numbered headings and blank lines do the structuring, nothing else.
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
  "font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;line-height:1.6"
const S = {
  plain: MONO,
  bold: `${MONO};font-weight:700`,
  muted: `${MONO};color:#808080`,
  accent: `${MONO};color:${SUNSET[0]}`,
  quote: `${MONO};font-style:italic`,
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

function blank() {
  log([" ", S.plain])
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
  blank()
  log([tagline, S.bold])
  log([
    `${name} · ${facts.find(([label]) => label === "Role")?.[1] ?? ""} · ${host}`,
    S.muted,
  ])
  blank()
  log([summary, S.plain])
  log([aside, S.muted])
}

function printProjects({ projects }: ConsoleGreetingProps) {
  const nameW = width(projects.map((p) => p.name))
  const descW = width(projects.map((p) => p.description))
  for (const p of projects) {
    log(
      [p.name.padEnd(nameW), S.bold],
      [p.description.padEnd(descW), S.muted],
      [p.href, S.plain]
    )
  }
}

function printWins({ wins }: ConsoleGreetingProps) {
  // "Codeforces — 250+ Problems" splits into a bold name and its result.
  const rows = wins.map((w) => w.split(" — ") as [string, string?])
  const w = width(rows.map(([name]) => name))
  for (const [name, result = ""] of rows) {
    log([name.padEnd(w), S.bold], [result, S.plain])
  }
}

function printPosts({ posts }: ConsoleGreetingProps) {
  if (!posts.length) log(["No posts published yet.", S.muted])
  for (const p of posts) {
    log([`${p.date}  `, S.muted], [`${p.title}\n`, S.bold], [p.url, S.plain])
  }
}

function printTestimonial({ testimonial: t }: ConsoleGreetingProps) {
  log(
    [`${wrap(`“${t.quote}”`, 80).join("\n")}\n`, S.quote],
    [`— ${t.author}`, S.bold],
    [` / ${t.role} · ${t.org}`, S.muted]
  )
}

function printStack({ stack }: ConsoleGreetingProps) {
  log([stack.flatMap((group) => group.items).join(" · "), S.plain])
}

function printLinks({ links, handle }: ConsoleGreetingProps) {
  const w = width([...links.map((l) => l.label), "email"])
  for (const l of links) {
    log([l.label.toLowerCase().padEnd(w), S.accent], [l.href, S.plain])
  }
  log(
    ["email".padEnd(w), S.accent],
    [`${handle}.email()`, S.plain],
    ["  copies my address", S.muted]
  )
}

type Printer = (p: ConsoleGreetingProps) => void

// Heading, the command that prints it alone (if any), and its body.
const SECTIONS: [title: string, command: string | null, print: Printer][] = [
  ["Projects", "projects", printProjects],
  ["Achievements", "wins", printWins],
  ["Stack", null, printStack],
  ["Latest posts", "posts", printPosts],
  ["Recommendation", null, printTestimonial],
  ["Links", "links", printLinks],
]

/** "01 — PROJECTS", its rows, then the command that reprints it. */
function printSection(props: ConsoleGreetingProps, index: number) {
  const [title, , print] = SECTIONS[index]
  blank()
  log([
    `${String(index + 1).padStart(2, "0")} — ${title.toUpperCase()}`,
    S.accent,
  ])
  print(props)
}

function printGreeting(props: ConsoleGreetingProps) {
  const { handle, siteUrl } = props
  printCard(props)
  SECTIONS.forEach((_, i) => printSection(props, i))
  blank()
  log(
    ["Want the full portfolio? Type ", S.bold],
    [`${handle}.help()`, S.accent]
  )
  log(["AI-readable portfolio: ", S.muted], [`${siteUrl}/llms.txt`, S.plain])
}

/** The `<handle>.*()` commands, installed on `window`. */
function createCommands(props: ConsoleGreetingProps) {
  const run = (command: string) => () => {
    printSection(
      props,
      SECTIONS.findIndex(([, c]) => c === command)
    )
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
          [`${props.handle}.${c}`.padEnd(w), S.accent],
          [`${desc}\n`, S.muted],
        ])
      )
    },
    about: () => printCard(props),
    projects: run("projects"),
    wins: run("wins"),
    posts: run("posts"),
    links: run("links"),
    // Typing the command is the explicit gesture: the address is fetched from
    // the Server Action only now, never shipped in props.
    email: () => {
      void getContactEmail().then(async (email) => {
        try {
          await navigator.clipboard.writeText(email)
          log(["Copied to clipboard ✓", S.accent])
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
