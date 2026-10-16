import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import dayjs from "dayjs"
import { Clock } from "lucide-react"

import { BackLink } from "@/components/back-link"
import { Footer } from "@/components/footer"
import { MDX } from "@/components/mdx"
import { Navbar } from "@/components/navbar"
import { breadcrumbNode, JsonLd, personNode } from "@/components/json-ld"
import { TagChip } from "@/components/tag-chip"
import content from "@/data/content"
import { getAllPosts, getPostBySlug } from "@/lib/blog"
import { absoluteUrl, pageMetadata } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"

// Pre-render every (non-draft) post at build time; unknown slugs 404.
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const { title, description, date, updatedAt, image, tags } = post.metadata

  return pageMetadata({
    title,
    description,
    path: `/blog/${post.slug}`,
    image,
    markdown: true,
    article: { publishedTime: date, modifiedTime: updatedAt ?? date, tags },
  })
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const { title, description, date, updatedAt, tags, image } = post.metadata
  const url = `${SITE_URL}/blog/${post.slug}`

  return (
    <>
      <JsonLd
        data={{
          "@graph": [
            {
              "@type": "BlogPosting",
              "@id": `${url}#article`,
              headline: title,
              description,
              url,
              mainEntityOfPage: url,
              datePublished: date,
              dateModified: updatedAt ?? date,
              image: image ? absoluteUrl(image) : undefined,
              keywords: tags,
              inLanguage: "en",
              author: personNode(),
            },
            breadcrumbNode([
              ["Home", "/"],
              ["Blog", "/blog"],
              [title, `/blog/${post.slug}`],
            ]),
          ],
        }}
      />
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <BackLink href="/blog" />

        <article className="mt-8">
          <header className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-balance">
              {title}
            </h1>
            <p className="mt-3 text-balance text-muted-foreground">
              {description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted-foreground">
              {/* Visible byline: names the author for readers and answer
                  engines, matching the BlogPosting author above. */}
              <Link
                href="/about"
                rel="author"
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                by {content.profile.name}
              </Link>
              <time dateTime={date}>{dayjs(date).format("MMM D, YYYY")}</time>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {post.readMinutes} min read
              </span>
              {updatedAt && updatedAt !== date && (
                <span>updated {dayjs(updatedAt).format("MMM D, YYYY")}</span>
              )}
            </div>

            {tags && tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <TagChip key={tag} tag={tag} />
                ))}
              </div>
            )}
          </header>

          {image && (
            <Image
              src={image}
              alt={title}
              width={1200}
              height={630}
              sizes="(min-width: 768px) 42rem, 100vw"
              priority
              className="mb-8 h-auto w-full rounded-xl border border-border object-cover"
            />
          )}

          <div className="text-base">
            <MDX code={post.content} />
          </div>
        </article>

        <Footer minimal />
      </main>
    </>
  )
}
