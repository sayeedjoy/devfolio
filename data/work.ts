import type { ExperienceItemType } from "./types"

export const work: ExperienceItemType[] = [
  {
    id: "rumor-scanner",
    companyName: "Rumor Scanner",
    companyLogo: "/rs.jpg",
    positions: [
      {
        id: "rumor-scanner-cto",
        title: "Co-Founder & CTO",
        employmentPeriod: { start: "2020", end: "2021" },
        employmentType: "Full-time",
        description:
          "Built the tech for Bangladesh's largest fact-checking agency. Developed a custom CMS, public-facing website, and internal tools to manage the end-to-end fact-checking process.",
        skills: ["Next.js", "Node.js", "PostgreSQL", "CMS"],
      },
    ],
  },
]
