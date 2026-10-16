import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

import content from "@/data/content"

// The site-wide share image, referenced by OG_DEFAULTS in lib/seo.ts: avatar,
// name and role on a plain panel. Rendered once at build time by Satori, which
// takes inline styles and hex colours only; its bundled default font is Geist.
// Satori can't decode WebP, so the avatar is a 320px JPEG copy of
// profile.avatar — replace public/og-avatar.jpg when you change your photo.
export const dynamic = "force-static"

export async function GET() {
  const { name, role } = content.profile
  const photo = await readFile(join(process.cwd(), "public/og-avatar.jpg"))
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          width={160}
          height={160}
          style={{ borderRadius: 9999, objectFit: "cover" }}
        />
        <div
          style={{
            marginTop: 40,
            fontSize: 72,
            letterSpacing: -2,
            color: "#fafafa",
          }}
        >
          {name}
        </div>
        <div style={{ marginTop: 8, fontSize: 36, color: "#a1a1a1" }}>
          {role}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
