import type { NextConfig } from "next"

// React + Turbopack use eval() in dev for debugging features; production never
// does. Only relax script-src for eval when running the dev server.
const isDev = process.env.NODE_ENV !== "production"
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  : "script-src 'self' 'unsafe-inline'"

// Security headers applied to every route. CSP is intentionally permissive for
// inline styles (Next injects them) but blocks framing and object embeds.
const securityHeaders = [
  {
    // Advertise machine-readable discovery entry points to agents/crawlers on
    // every response: the API catalog (RFC 9727) and the llms.txt site map.
    key: "Link",
    value: [
      '</.well-known/api-catalog>; rel="api-catalog"',
      '</llms.txt>; rel="describedby"; type="text/markdown"',
    ].join(", "),
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js requires inline styles; scripts allow inline for hydration bootstrap.
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
]

const nextConfig: NextConfig = {
  images: {
    // Blog cover images may be hosted on Cloudinary (see post frontmatter).
    // next/image optimizes them and serves from /_next/image (same origin),
    // so the CSP's `img-src 'self'` still covers what the browser loads.
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
    // Next 16 defaults the allowlist to [75]; any higher `quality` prop is
    // coerced down to 75 unless listed here. Allow a crisp tier for photos.
    qualities: [75, 100],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },
}

export default nextConfig
