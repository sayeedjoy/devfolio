/**
 * Data for the /uses page (hardware, software, editor setup).
 *
 * PRIVACY: like the rest of `data/`, this is server-only content. It holds no
 * secrets — every value here is public — but keep the import rule: it is read by
 * the server-rendered `app/uses/page.tsx`, which passes plain, serializable
 * props down to the `UsesContent` client island. Don't import this module into a
 * `"use client"` file directly.
 *
 * To make it yours: replace the reference items below. Drop matching images into
 * `public/images/uses/<image>` and the thumbnails fill in automatically; until
 * then a tidy letter placeholder is shown.
 */

export interface HardwareItem {
  name: string
  description: string
  /** path under /public, e.g. "/images/uses/macbook-pro.png" */
  image: string
}

export interface SoftwareItem {
  name: string
  /** path under /public, e.g. "/images/uses/1password.png" */
  icon: string
  /**
   * Set for single-colour *white* artwork (the "-dark" variants brands ship for
   * dark backgrounds). Those vanish against the light-theme tile, so the grid
   * inverts them in light mode and leaves them untouched in dark mode.
   */
  mono?: boolean
}

/**
 * A piece of the coding blurb: a plain string, or an inline icon+label rendered
 * mid-sentence (icon path under /public, e.g. "/apps/visual-studio-code.svg").
 */
export type CodingSegment = string | { icon: string; label: string }

export interface UsesData {
  hero: { image: string; caption: string }
  hardware: HardwareItem[]
  software: SoftwareItem[]
  coding: { note: CodingSegment[] }
  /** optional muted note shown under the software grid */
  softwareNote?: string
}

const uses: UsesData = {
  hero: {
    image: "/gears/desk.webp",
    caption: "My Desk Setup 2026",
  },

  hardware: [
    {
      name: "Ryzen 9 7900X3D",
      description: "12-core CPU, 4.4–5.6GHz, 140MB cache",
      image:
        "/gears/amd-ryzen-9-7900x3d-44ghz-56ghz-12-core-140mb-11701344951-6a37fa279fe74.webp",
    },
    {
      name: "MSI MAG X870 Tomahawk WiFi",
      description: "Motherboard",
      image:
        "/gears/msi-mag-x870-mag-tomahawk-wifi-pcb-design-6a37fa2757f7d.webp",
    },
    {
      name: "G.Skill Trident Z5 Neo RGB",
      description: "DDR5, 2×16GB",
      image: "/gears/trident-z5-neo-01-500x500-6a37fa263eb29.webp",
    },
    {
      name: "GIGABYTE RTX 5060 Ti Gaming OC",
      description: "16GB GPU",
      image: "/gears/kv-img-6a37fa27364e2.webp",
    },
    {
      name: "Logitech G403 Hero",
      description: "Mouse",
      image: "/gears/g403-hero-500x500.png",
    },
    {
      name: "Monka K75",
      description: "Mechanical keyboard",
      image: "/gears/monka.webp",
    },
    {
      name: "Galaxy S25 Ultra",
      description: "512GB",
      image: "/gears/samsung-galaxy-s25-ultra-sm-s938.jpg",
    },
  ],

  software: [
    { name: "1Password", icon: "/apps/1password-dark.svg", mono: true },
    { name: "Android Studio", icon: "/apps/android-studio.svg" },
    { name: "Notion", icon: "/apps/notion.svg" },
    { name: "VS Code", icon: "/apps/visual-studio-code.svg" },
  ],

  coding: {
    note: [
      "I use ",
      { icon: "/apps/visual-studio-code.svg", label: "VS Code" },
      " with ",
      { icon: "/apps/claude-code.svg", label: "Claude Code" },
      " Max 20x for AI-assisted coding.",
    ],
  },
}

export default uses
