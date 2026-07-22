import type { Profile } from "./types"

export const profile: Profile = {
  name: "Sayeed Joy",
  role: "Software Engineer",
  avatar: "/photos/joy.webp",
  bio: [
    [
      "I like building things that people actually use. From polished user experiences to scalable backend systems, I work across the stack and am currently building ",
      {
        type: "link",
        text: "Link Arena",
        href: "https://linkarena.app/",
        logo: "/linkarena.ico",
      },
    ],
  ],
  verified: true,
}
