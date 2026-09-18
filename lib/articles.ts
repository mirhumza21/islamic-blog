import { articles as staticArticles } from "@/data/articles";
import { authors as staticAuthors } from "@/data/authors";
import { categories as staticCategories } from "@/data/categories";
import type { Article, Author, Category, SearchResult } from "@/types/blog";
import { supabase } from "@/lib/supabase";

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return Boolean(url) && !url.includes("placeholder");
}

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

export function mapDbCategory(row: any): Category {
  return {
    id: String(row.id),
    slug: row.slug,
    name: row.name,
    description: row.description || "",
    shortDescription: row.short_description || row.shortDescription || "",
    image: row.image || "",
    icon: row.icon || "kaaba",
    color: row.color || undefined,
  };
}

export function mapDbAuthor(row: any): Author {
  return {
    id: String(row.id),
    name: row.name,
    role: row.role || undefined,
    avatar: row.avatar || "",
    bio: row.bio || undefined,
  };
}

function sortArticles(list: Article[]) {
  return [...list].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function fetchAllArticles(): Promise<Article[]> {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (!error && data) {
        return data.map(mapDbArticle);
      }
    }
  } catch (err) {
    console.warn("Could not fetch from Supabase, using static articles:", err);
  }

  return sortArticles(staticArticles);
}

export async function fetchArticleBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {}
): Promise<Article | undefined> {
  try {
    if (isSupabaseConfigured()) {
      let query = supabase.from("articles").select("*").eq("slug", slug);
      if (!options.includeDrafts) {
        query = query.eq("status", "published");
      }
      const { data, error } = await query.maybeSingle();

      if (!error && data) {
        return mapDbArticle(data);
      }
      return undefined;
    }
  } catch (err) {
    console.warn("Could not fetch article by slug from Supabase:", err);
  }

  return staticArticles.find((article) => article.slug === slug);
}

export async function fetchAllCategories(): Promise<Category[]> {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data) {
        return data.map(mapDbCategory);
      }
    }
  } catch (err) {
    console.warn("Could not fetch categories from Supabase:", err);
  }

  return staticCategories;
}

export async function fetchAllAuthors(): Promise<Author[]> {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data) {
        return data.map(mapDbAuthor);
      }
    }
  } catch (err) {
    console.warn("Could not fetch authors from Supabase:", err);
  }

  return staticAuthors;
}

export async function fetchAuthorById(id: string): Promise<Author | undefined> {
  const authors = await fetchAllAuthors();
  return authors.find((author) => author.id === id);
}

export async function fetchCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  const categories = await fetchAllCategories();
  return categories.find((category) => category.slug === slug);
}

export async function fetchFeaturedArticle(
  articles?: Article[]
): Promise<Article | undefined> {
  const list = articles ?? (await fetchAllArticles());
  return list.find((article) => article.featured) ?? list[0];
}

export async function fetchPopularArticles(
  limit = 5,
  articles?: Article[]
): Promise<Article[]> {
  const list = articles ?? (await fetchAllArticles());
  return [...list]
    .filter((article) => article.popular)
    .sort((a, b) => (a.popularRank ?? 99) - (b.popularRank ?? 99))
    .slice(0, limit);
}

export async function fetchLatestArticles(
  limit?: number,
  articles?: Article[]
): Promise<Article[]> {
  const list = articles ?? (await fetchAllArticles());
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export async function fetchArticlesByCategory(
  categorySlug: string,
  articles?: Article[]
): Promise<Article[]> {
  const list = articles ?? (await fetchAllArticles());
  return list.filter((article) => article.categorySlug === categorySlug);
}

export async function fetchRelatedArticles(
  article: Article,
  limit = 3,
  articles?: Article[]
): Promise<Article[]> {
  const list = articles ?? (await fetchAllArticles());
  return list
    .filter(
      (item) =>
        item.id !== article.id &&
        (item.categorySlug === article.categorySlug ||
          item.tags?.some((tag) => article.tags?.includes(tag)))
    )
    .slice(0, limit);
}

export async function fetchPrevNextArticles(
  currentSlug: string,
  articles?: Article[]
): Promise<{ prev?: Article; next?: Article }> {
  const all = articles ?? (await fetchAllArticles());
  const index = all.findIndex((a) => a.slug === currentSlug);
  if (index === -1) return {};
  return {
    prev: index > 0 ? all[index - 1] : undefined,
    next: index < all.length - 1 ? all[index + 1] : undefined,
  };
}

export async function searchPublishedArticles(
  query: string,
  articles?: Article[],
  categories?: Category[]
): Promise<SearchResult[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const list = articles ?? (await fetchAllArticles());
  const cats = categories ?? (await fetchAllCategories());
  const categoryMap = new Map(cats.map((category) => [category.slug, category]));

  return list
    .filter((article) => {
      const category = categoryMap.get(article.categorySlug);
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
      categoryName: categoryMap.get(article.categorySlug)?.name ?? "Article",
    }));
}

/** Synchronous fallbacks for static/demo data (client components without fetch). */
export function getAllArticles(): Article[] {
  return sortArticles(staticArticles);
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
      categoryName: getCategoryBySlug(article.categorySlug)?.name ?? "Article",
    }));
}

export function getHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function ensureHeadingIds(html: string): string {
  return html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, level, attrs, inner) => {
      if (/\sid\s*=/i.test(attrs)) return match;
      const id = getHeadingId(stripHtml(inner));
      if (!id) return match;
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    }
  );
}

export function extractHeadingsFromHtml(html: string) {
  const matches = [
    ...html.matchAll(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi),
  ];

  return matches.map((match) => {
    const level = Number(match[1]) as 2 | 3;
    const attrs = match[2] || "";
    const text = stripHtml(match[3] || "");
    const idMatch = attrs.match(/\sid=["']([^"']+)["']/i);
    return {
      id: idMatch?.[1] || getHeadingId(text),
      text,
      level,
    };
  });
}

export function extractTableOfContents(article: Article) {
  const fromBlocks = article.content
    .filter(
      (block): block is Extract<Article["content"][number], { type: "heading" }> =>
        block.type === "heading"
    )
    .map((heading) => ({
      id: heading.id ?? getHeadingId(heading.text),
      text: heading.text,
      level: heading.level,
    }));

  const fromHtml = article.content
    .filter(
      (block): block is Extract<Article["content"][number], { type: "html" }> =>
        block.type === "html"
    )
    .flatMap((block) => extractHeadingsFromHtml(block.text));

  return [...fromBlocks, ...fromHtml].filter((item) => item.text);
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
