import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { PostList } from "@/components/post-list"
import { getAllPosts } from "@/lib/blog"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing on engineering, design, and building things.",
  alternates: { canonical: `${SITE_URL}/blog` },
}

export default function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-2 text-muted-foreground">
            Writing on engineering, design, and building things.
          </p>
        </header>

        <PostList posts={posts} />

        <Footer minimal />
      </main>
    </>
  )
}
