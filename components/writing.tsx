import Link from "next/link"

import { ArrowRight } from "lucide-react"

import { PostList } from "@/components/post-list"
import { Section, SectionLabel } from "@/components/section"
import { getRecentPosts } from "@/lib/blog"

export function Writing() {
  const posts = getRecentPosts(3)

  return (
    <Section id="thoughts">
      <div className="mb-4 flex items-center justify-between">
        <SectionLabel className="mb-0">Writing</SectionLabel>
        <Link
          href="/blog"
          className="group inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <PostList posts={posts} />
    </Section>
  )
}
