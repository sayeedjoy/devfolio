import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BackLink } from "@/components/back-link"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { PostList } from "@/components/post-list"
import { getAllTags, getPostsByTag } from "@/lib/blog"
import { SITE_URL } from "@/lib/site"

// Pre-render a page for each known tag; unknown tags 404.
export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  // params.tag is already URL-decoded by the App Router — use it as-is and only
  // re-encode when composing a URL.
  const { tag } = await params
  return {
    title: `#${tag}`,
    description: `Posts tagged "${tag}".`,
    alternates: {
      canonical: `${SITE_URL}/blog/tag/${encodeURIComponent(tag)}`,
    },
  }
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag } = await params
  const posts = getPostsByTag(tag)
  if (posts.length === 0) notFound()

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <BackLink href="/blog" />

        <header className="mt-8 mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">#{tag}</h1>
          <p className="mt-2 text-muted-foreground">
            {posts.length} post{posts.length === 1 ? "" : "s"} tagged{" "}
            <span className="font-mono">{tag}</span>.
          </p>
        </header>

        <PostList posts={posts} />

        <Footer minimal />
      </main>
    </>
  )
}
