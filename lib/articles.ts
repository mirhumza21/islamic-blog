import { articles } from "@/data/articles";
import { authors } from "@/data/authors";
import { categories } from "@/data/categories";
import type { Article, Author, Category, SearchResult } from "@/types/blog";

export function getAllArticles(): Article[] {
  return [...articles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getFeaturedArticle(): Article | undefined {
  return articles.find((article) => article.featured) ?? getAllArticles()[0];
}

export function getPopularArticles(limit = 5): Article[] {
  return [...articles]
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

export function getAuthorById(id: string): Author | undefined {
  return authors.find((author) => author.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getAllCategories(): Category[] {
  return categories;
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
