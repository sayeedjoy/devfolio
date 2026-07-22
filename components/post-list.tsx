import Link from "next/link"

import { Clock } from "lucide-react"

import type { Post } from "@/lib/blog"

function formatDate(iso: string) {
  // Deterministic, locale-stable MM/DD/YY (avoids SSR/client mismatch).
  const [y, m, d] = iso.split("-")
  return `${m}/${d}/${y.slice(2)}`
}

/**
 * Shared post listing — date · title · read-time rows. Used by the /blog index
 * and tag archive pages, matching the homepage Writing section.
 */
export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <p className="text-muted-foreground">No posts yet — check back soon.</p>
    )
  }

  return (
    <ul className="flex flex-col">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/blog/${post.slug}`}
            className="group -mx-3 flex flex-col gap-2 rounded-lg px-3 py-3 text-sm transition-colors hover:bg-foreground/[0.03] sm:grid sm:grid-cols-[88px_1fr_auto] sm:items-baseline sm:gap-6 sm:py-2.5"
          >
            {/* Mobile: title on top, meta below. Desktop: date · title · time.
                `sm:contents` lets the meta children join the parent grid. */}
            <span className="order-first font-medium text-foreground transition-colors group-hover:text-link sm:order-none sm:col-start-2 sm:text-base">
              {post.metadata.title}
            </span>
            <div className="flex items-center gap-3 text-muted-foreground sm:contents">
              <span className="font-mono text-sm sm:col-start-1 sm:row-start-1">
                {formatDate(post.metadata.date)}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-sm whitespace-nowrap sm:col-start-3 sm:row-start-1">
                <Clock className="size-3.5" />
                {post.readMinutes} m
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
