import type { MetadataRoute } from "next";
import { env } from "@/env";
import { PROJECTS } from "@/data/projects";
import { POSTS } from "@/data/posts";
import { localePath, LOCALES } from "@/data/locale";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const lastModified = new Date();

  const paths: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/projects", priority: 0.9 },
    { path: "/research", priority: 0.9 },
    { path: "/about", priority: 0.8 },
    { path: "/blog", priority: 0.8 },
    ...PROJECTS.map((project) => ({ path: `/projects/${project.slug}`, priority: 0.7 })),
    ...POSTS.map((post) => ({ path: `/blog/${post.slug}`, priority: 0.6 })),
  ];

  // Una entrada por locale y ruta (EN sin prefijo, ES bajo /es).
  return LOCALES.flatMap((locale) =>
    paths.map(({ path, priority }) => ({
      url: `${base}${localePath(locale, path)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
    }))
  );
}
