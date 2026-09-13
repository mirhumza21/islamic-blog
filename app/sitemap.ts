import type { MetadataRoute } from "next";
import { getAllArticles, getAllCategories } from "@/lib/articles";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/blog", "/about", "/privacy", "/terms", "/search"].map(
    (path) => ({
      url: absoluteUrl(path || "/"),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })
  );

  const articleRoutes = getAllArticles().map((article) => ({
    url: absoluteUrl(`/blog/${article.slug}`),
    lastModified: new Date(article.updatedAt ?? article.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categoryRoutes = getAllCategories().map((category) => ({
    url: absoluteUrl(`/category/${category.slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes];
}
