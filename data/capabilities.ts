import type { Capabilities } from "./types"

/**
 * Copy for the three-up pitch block (`<CapabilityCards />`).
 *
 * `quote` and `highlight` are one sentence split in two: the card renders the
 * highlight in the emphasised weight, so the split is where the emphasis
 * starts, not a sentence boundary.
 */
export const capabilities: Capabilities = {
  stat: { value: "10+", label: "Products shipped" },
  bring: {
    label: "What I bring:",
    items: [
      { text: "Product Design", icon: "design" },
      { text: "Database Architecture", icon: "database" },
      { text: "Software Development", icon: "code" },
    ],
  },
  pitch: {
    text: "I help you get your product into production in weeks, not months. I'm all about speed, craft and having fun doing it.",
    from: "0",
    to: "100",
  },
  testimonial: {
    brand: "Southeast University",
    brandLogo: "/projects/seu.png",
    quote:
      "One of the most outstanding students I have taught, with real practical depth in web applications, DevOps and agentic AI. Across the projects and hackathons I supervised, he ",
    highlight:
      "approached hard problems thoughtfully and stayed focused under pressure",
    author: "Abid Ahmad",
    role: "Lecturer, CSE",
    avatar: "/photos/abid-ahmad.webp",
  },
}
