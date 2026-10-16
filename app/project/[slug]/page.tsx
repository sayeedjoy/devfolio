import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

import { ArrowUpRight } from "lucide-react"

import { BackLink } from "@/components/back-link"
import { GithubIcon } from "@/components/custom-icons"
import { Footer } from "@/components/footer"
import { breadcrumbNode, JsonLd, personNode } from "@/components/json-ld"
import { MDX } from "@/components/mdx"
import { Navbar } from "@/components/navbar"
import { StackIcon } from "@/components/stack-icon"
import { Button } from "@/components/ui/button"
import { getAllProjects, getProjectBySlug } from "@/lib/project"
import { absoluteUrl, pageMetadata } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { MY_STACKS } from "@/lib/stackicon"

// Pre-render every (non-draft) project at build time; unknown slugs 404.
export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}

  const { title, subtitle, preview } = project.metadata

  // `image` is the project's square logo, which crops badly in a large card;
  // the `preview` screenshot is landscape, else the site OG image is used.
  return pageMetadata({
    title,
    description: subtitle,
    path: `/project/${project.slug}`,
    image: preview,
    markdown: true,
  })
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const { title, subtitle, image, stack, liveUrl, githubUrl, date, preview } =
    project.metadata
  const url = `${SITE_URL}/project/${project.slug}`

  return (
    <>
      <JsonLd
        data={{
          "@graph": [
            {
              "@type": "CreativeWork",
              "@id": `${url}#project`,
              name: title,
              description: subtitle,
              url,
              sameAs: liveUrl,
              dateCreated: date,
              image: preview ? absoluteUrl(preview) : undefined,
              keywords: stack,
              inLanguage: "en",
              author: personNode(),
            },
            breadcrumbNode([
              ["Home", "/"],
              ["Projects", "/project"],
              [title, `/project/${project.slug}`],
            ]),
          ],
        }}
      />
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <BackLink href="/project" />

        <article className="mt-8">
          <header className="mb-8">
            {/* Title + subtitle on the left, feature image on the right. */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-semibold tracking-tight text-balance">
                  {title}
                </h1>
                <p className="mt-3 text-balance text-muted-foreground">
                  {subtitle}
                </p>
              </div>

              {image && (
                <Image
                  src={image}
                  alt={title}
                  width={1200}
                  height={600}
                  sizes="(max-width: 640px) 100vw, 240px"
                  className="h-auto w-full rounded-xl object-cover sm:w-60"
                  priority
                />
              )}
            </div>

            {/* Tech stack */}
            {stack.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {stack.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground"
                  >
                    {MY_STACKS[name] && <StackIcon name={name} size={16} />}
                    {name}
                  </span>
                ))}
              </div>
            )}

            {/* Live demo + GitHub code buttons, horizontally */}
            {(liveUrl || githubUrl) && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {liveUrl && (
                  <Button
                    nativeButton={false}
                    render={
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    Live Demo
                    <ArrowUpRight />
                  </Button>
                )}
                {githubUrl && (
                  <Button
                    variant="outline"
                    nativeButton={false}
                    render={
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    <GithubIcon />
                    GitHub Code
                  </Button>
                )}
              </div>
            )}
          </header>

          {/* Description */}
          <div className="text-base">
            <MDX code={project.content} />
          </div>
        </article>

        <Footer minimal />
      </main>
    </>
  )
}
