import { articles as staticArticles } from "@/data/articles";
import { authors as staticAuthors } from "@/data/authors";
import { categories as staticCategories } from "@/data/categories";
import type { Article, Author, Category, SearchResult } from "@/types/blog";
import { supabase } from "@/lib/supabase";

// Helper to map DB row to Article type
export function mapDbArticle(row: any): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    categorySlug: row.category_slug,
    authorId: row.author_id,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    readingTime: row.reading_time || 5,
    image: row.image,
    imageAlt: row.image_alt || row.title,
    featured: Boolean(row.featured),
    popular: Boolean(row.popular),
    popularRank: row.popular_rank || undefined,
    tags: row.tags || [],
    content: Array.isArray(row.content) ? row.content : [],
    seo: {
      title: row.seo_title || undefined,
      description: row.seo_description || undefined,
    },
  };
}

/**
 * Fetch all articles from Supabase, falling back to static data if not configured or empty
 */
export async function fetchAllArticles(): Promise<Article[]> {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(mapDbArticle);
      }
    }
  } catch (err) {
    console.warn("Could not fetch from Supabase, using static articles:", err);
  }

  return [...staticArticles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Fetch a single article by slug from Supabase, falling back to static data
 */
export async function fetchArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (!error && data) {
        return mapDbArticle(data);
      }
    }
  } catch (err) {
    console.warn("Could not fetch article by slug from Supabase:", err);
  }

  return staticArticles.find((article) => article.slug === slug);
}

// Synchronous legacy functions maintaining full backward compatibility
export function getAllArticles(): Article[] {
  return [...staticArticles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getArticleBySlug(slug: string): Article | undefined {
  return staticArticles.find((article) => article.slug === slug);
}

export function getFeaturedArticle(): Article | undefined {
  return staticArticles.find((article) => article.featured) ?? getAllArticles()[0];
}

export function getPopularArticles(limit = 5): Article[] {
  return [...staticArticles]
    .filter((article) => article.popular)
    .sort((a, b) => (a.popularRank ?? 99) - (b.popularRank ?? 99))
    .slice(0, limit);
}

export function getLatestArticles(limit?: number): Article[] {
  const sorted = getAllArticles();
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return getAllArticles().filter(
    (article) => article.categorySlug === categorySlug
  );
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return getAllArticles()
    .filter(
      (item) =>
        item.id !== article.id &&
        (item.categorySlug === article.categorySlug ||
          item.tags?.some((tag) => article.tags?.includes(tag)))
    )
    .slice(0, limit);
}

export function getPrevNextArticles(currentSlug: string): {
  prev?: Article;
  next?: Article;
} {
  const all = getAllArticles();
  const index = all.findIndex((a) => a.slug === currentSlug);
  if (index === -1) return {};
  return {
    prev: index > 0 ? all[index - 1] : undefined,
    next: index < all.length - 1 ? all[index + 1] : undefined,
  };
}

export function getAuthorById(id: string): Author | undefined {
  return staticAuthors.find((author) => author.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return staticCategories.find((category) => category.slug === slug);
}

export function getAllCategories(): Category[] {
  return staticCategories;
}

export function searchArticles(query: string): SearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return getAllArticles()
    .filter((article) => {
      const category = getCategoryBySlug(article.categorySlug);
      const haystack = [
        article.title,
        article.excerpt,
        article.tags?.join(" ") ?? "",
        category?.name ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    })
    .map((article) => ({
      article,
      categoryName:
        getCategoryBySlug(article.categorySlug)?.name ?? "Article",
    }));
}

export function getHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function extractTableOfContents(article: Article) {
  return article.content
    .filter(
      (block): block is Extract<Article["content"][number], { type: "heading" }> =>
        block.type === "heading"
    )
    .map((heading) => ({
      id: heading.id ?? getHeadingId(heading.text),
      text: heading.text,
      level: heading.level,
    }));
}

export function paginateArticles(list: Article[], page: number, perPage = 9) {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * perPage;
  const items = list.slice(start, start + perPage);
  const totalPages = Math.max(1, Math.ceil(list.length / perPage));

  return {
    items,
    page: safePage,
    perPage,
    total: list.length,
    totalPages,
    hasMore: safePage < totalPages,
  };
}
