import type { Profile } from "./types"

export const profile: Profile = {
  name: "Sayeed Joy",
  role: "Software Engineer",
  avatar: "/photos/joy.webp",
  bio: [
    [
      "I enjoy turning complex ideas into software that feels simple and dependable. Most of my work is in enterprise platforms and SaaS, and right now I’m bringing that experience to ",
      {
        type: "link",
        text: "Link Arena",
        href: "https://linkarena.app/",
        logo: "/linkarena.ico",
      },
      ".",
    ],
  ],
  verified: true,
  socials: [
    { label: "X", href: "https://x.com/sayeedjoy", icon: "x" },
    { label: "GitHub", href: "https://github.com/sayeedjoy", icon: "github" },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/sayeedjoy",
      icon: "linkedin",
    },
  ],
}
