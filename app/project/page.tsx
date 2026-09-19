import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ProjectList } from "@/components/project-list"
import { getAllProjects } from "@/lib/project"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've designed, built, and shipped.",
  alternates: { canonical: `${SITE_URL}/project` },
}

export default function ProjectIndexPage() {
  const projects = getAllProjects()

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-2 text-muted-foreground">
            {projects.length} project{projects.length === 1 ? "" : "s"}{" "}
            I&apos;ve designed, built, and shipped.
          </p>
        </header>

        <ProjectList projects={projects} />

        <Footer minimal />
      </main>
    </>
  )
}
