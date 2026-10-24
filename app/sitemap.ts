import type { MetadataRoute } from "next";
import { fetchAllArticles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await fetchAllArticles();

  return articles
    .filter((article) => !article.seo?.noIndex)
    .map((article) => ({
      url: absoluteUrl(`/blog/${article.slug}`),
      lastModified: new Date(article.updatedAt ?? article.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
}
