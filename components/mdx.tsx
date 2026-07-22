/**
 * Server-side MDX renderer for blog posts.
 *
 * Runs entirely on the server (RSC): markdown/MDX is transformed to HTML at
 * build time, so no MDX runtime or syntax-highlighting JS reaches the client.
 * `rehype-pretty-code` emits inline `style` attributes (allowed by the CSP's
 * `style-src 'unsafe-inline'`), so the strict production `script-src` stays
 * intact. Element styling uses theme tokens only — no hardcoded hex.
 */
import Image from "next/image"
import { MDXRemote } from "next-mdx-remote/rsc"
import type { MDXRemoteProps } from "next-mdx-remote/rsc"
import rehypeExternalLinks from "rehype-external-links"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

import { Mermaid } from "@/components/mermaid"
import { rehypeMermaid } from "@/lib/rehype-mermaid"
import { cn } from "@/lib/utils"

const components: MDXRemoteProps["components"] = {
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        "mt-10 mb-4 text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-10 mb-3 scroll-mt-24 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "mt-8 mb-2 scroll-mt-24 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={cn("mt-6 mb-2 scroll-mt-24 font-semibold", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn("my-4 leading-relaxed text-foreground/90", className)}
      {...props}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn(
        "text-link underline underline-offset-4 transition-opacity hover:opacity-80",
        className
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "my-4 list-disc space-y-2 pl-6 text-foreground/90",
        className
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "my-4 list-decimal space-y-2 pl-6 text-foreground/90",
        className
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("leading-relaxed", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "my-6 border-l-2 border-border pl-4 text-muted-foreground italic",
        className
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("my-8 border-border", className)} {...props} />
  ),
  // Inline code. Code inside <pre> blocks is reset to transparent so Shiki's
  // colors (set via inline styles) show through — see the `pre` mapping.
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]",
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "my-6 overflow-x-auto rounded-xl border border-border p-4 text-sm",
        "[&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[0.85rem]",
        className
      )}
      {...props}
    />
  ),
  table: ({ className, ...props }) => (
    <div className="my-6 overflow-x-auto">
      <table
        className={cn("w-full border-collapse text-sm", className)}
        {...props}
      />
    </div>
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "border border-border px-3 py-2 text-left font-semibold",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn("border border-border px-3 py-2", className)}
      {...props}
    />
  ),
  // Custom element emitted by rehypeMermaid for ```mermaid fenced blocks.
  // Rendered by a client island since Mermaid needs a DOM to lay out.
  mermaid: ({ chart }: { chart?: string }) => <Mermaid chart={chart ?? ""} />,
  img: ({ className, src, alt, ...props }) => (
    // Post images live under /public; width/height are unknown so we render a
    // responsive block image rather than a fixed next/image layout.
    <Image
      src={typeof src === "string" ? src : ""}
      alt={alt ?? ""}
      width={1200}
      height={630}
      sizes="100vw"
      className={cn(
        "my-6 h-auto w-full rounded-xl border border-border",
        className
      )}
      {...props}
    />
  ),
}

const options: MDXRemoteProps["options"] = {
  parseFrontmatter: false,
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      // Must precede rehypePrettyCode so mermaid blocks skip syntax highlighting.
      rehypeMermaid,
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["nofollow", "noopener", "noreferrer"] },
      ],
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          // Dual themes: Shiki emits CSS variables for both; globals.css picks
          // the right one based on the .dark class.
          theme: { light: "github-light", dark: "github-dark" },
          keepBackground: false,
        },
      ],
    ],
  },
}

export function MDX({ code }: { code: string }) {
  return <MDXRemote source={code} components={components} options={options} />
}
