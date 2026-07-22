import type { MetadataRoute } from "next"

import { getAllPosts, getAllTags } from "@/lib/blog"
import { getAllProjects } from "@/lib/project"
import { SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.metadata.updatedAt ?? post.metadata.date,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const projectEntries: MetadataRoute.Sitemap = getAllProjects().map(
    (project) => ({
      url: `${SITE_URL}/project/${project.slug}`,
      lastModified: project.metadata.date,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  )

  const tagEntries: MetadataRoute.Sitemap = getAllTags().map(({ tag }) => ({
    url: `${SITE_URL}/blog/tag/${encodeURIComponent(tag)}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }))

  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/project`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/uses`, changeFrequency: "monthly", priority: 0.6 },
    ...postEntries,
    ...projectEntries,
    ...tagEntries,
  ]
}
