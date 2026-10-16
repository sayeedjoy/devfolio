import type { ConsoleGreeting } from "./types"

/**
 * Copy for the DevTools console greeting (`<ConsoleGreeting />`). Everything
 * else it prints — the fact card, projects, wins, posts, testimonial, links —
 * is read from the other slices, so this holds only what exists nowhere else.
 *
 * `banner` is figlet "ANSI Regular" art (generate your own at
 * https://patorjk.com/software/taag/). Solid blocks stay crisp at console font
 * sizes, where outlined fonts smear. Each row takes the next gradient colour.
 * `handle` becomes the global the commands hang off, e.g. `joy.help()`.
 */
export const consoleGreeting: ConsoleGreeting = {
  banner: String.raw`
     ██  ██████  ██    ██
     ██ ██    ██  ██  ██
     ██ ██    ██   ████
██   ██ ██    ██    ██
 █████   ██████     ██`,
  tagline: "I get products into production in weeks, not months.",
  aside: "You found the back door. Make yourself at home.",
  handle: "joy",
}
