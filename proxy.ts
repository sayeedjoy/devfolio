import { NextResponse, type NextRequest } from "next/server"

// Content negotiation for LLM / agent clients: when a request for a content page
// explicitly asks for markdown (`Accept: text/markdown`, or a `?format=md`
// query), serve that page's markdown representation instead of the HTML. The
// markdown twins live at app/index.md, app/blog/[slug]/index.md and
// app/project/[slug]/index.md and are also reachable directly at those URLs.
//
// `proxy` is Next 16's replacement for the deprecated `middleware` convention.

// Map a canonical content path to its markdown twin, or null if it has none.
// The home page maps to /index.md; single-segment posts and projects map to
// /<section>/<slug>/index.md.
function markdownTwin(pathname: string): string | null {
  if (pathname === "/") return "/index.md"
  const match = pathname.match(/^\/(blog|project)\/([^/]+)\/?$/)
  if (match) return `/${match[1]}/${match[2]}/index.md`
  return null
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const accept = request.headers.get("accept") ?? ""
  const wantsMarkdown =
    searchParams.get("format") === "md" || accept.includes("text/markdown")

  if (wantsMarkdown) {
    const twin = markdownTwin(pathname)
    if (twin) {
      const url = request.nextUrl.clone()
      url.pathname = twin
      url.searchParams.delete("format")
      const response = NextResponse.rewrite(url)
      // The same URL can return HTML or markdown depending on the request, so
      // tell caches to key on Accept.
      response.headers.set("Vary", "Accept")
      return response
    }
  }

  const response = NextResponse.next()
  response.headers.set("Vary", "Accept")
  return response
}

export const config = {
  // Scope the proxy to the home page and the two content collections; every
  // other route is skipped before the handler even runs.
  matcher: ["/", "/blog/:slug", "/project/:slug"],
}
