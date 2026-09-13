import type { Metadata } from "next";
import Link from "next/link";
import { ArticleGrid } from "@/components/blog/ArticleGrid";
import { CategoryFilters } from "@/components/blog/CategoryFilters";
import { FeaturedArticle } from "@/components/home/FeaturedArticle";
import { Newsletter } from "@/components/home/Newsletter";
import { SidebarSearch } from "@/components/home/SidebarSearch";
import {
  getAllArticles,
  getAllCategories,
  getArticlesByCategory,
  getAuthorById,
  getCategoryBySlug,
  paginateArticles,
} from "@/lib/articles";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Explore Umrah guides, Islamic lifestyle articles, travel tips, Quran reflections, and real pilgrim stories on UmrahZone.",
  alternates: {
    canonical: "/blog",
  },
};

type BlogPageProps = {
  searchParams: Promise<{ category?: string; page?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const categorySlug = params.category;
  const page = Number(params.page ?? "1") || 1;
  const categories = getAllCategories();
  const all = categorySlug
    ? getArticlesByCategory(categorySlug)
    : getAllArticles();
  const featured = all[0];
  const author = featured ? getAuthorById(featured.authorId) : undefined;
  const category = featured
    ? getCategoryBySlug(featured.categorySlug)
    : undefined;
  const remaining = all.filter((article) => article.id !== featured?.id);
  const pagination = paginateArticles(remaining, page, 9);
  const activeCategory = categorySlug
    ? getCategoryBySlug(categorySlug)
    : undefined;

  return (
    <>
      <section className="border-b border-border bg-cream/50 py-14 lg:py-16">
        <div className="container-editorial max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green">
            Editorial Library
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {activeCategory ? activeCategory.name : "Blogs & Guides"}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {activeCategory
              ? activeCategory.description
              : "Practical guidance and meaningful Islamic content for Umrah, Hajj, and everyday faith."}
          </p>
          <div className="mt-8 max-w-md">
            <SidebarSearch />
          </div>
        </div>
      </section>

      <div className="container-editorial py-10">
        <CategoryFilters
          categories={categories}
          activeSlug={categorySlug}
        />
      </div>

      {featured && author && category && page === 1 ? (
        <FeaturedArticle
          article={featured}
          author={author}
          category={category}
        />
      ) : null}

      <section className="container-editorial py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl font-semibold text-foreground">
            {activeCategory ? `${activeCategory.name} articles` : "All articles"}
          </h2>
          <p className="text-sm text-muted">{pagination.total} results</p>
        </div>

        {pagination.items.length > 0 ? (
          <ArticleGrid articles={pagination.items} categories={categories} />
        ) : (
          <p className="rounded-2xl border border-dashed border-border bg-cream/50 px-5 py-12 text-center text-muted">
            No articles found in this category yet.
          </p>
        )}

        {pagination.totalPages > 1 ? (
          <div className="mt-10 flex items-center justify-center gap-3">
            {pagination.page > 1 ? (
              <Link
                href={`/blog?${new URLSearchParams({
                  ...(categorySlug ? { category: categorySlug } : {}),
                  page: String(pagination.page - 1),
                }).toString()}`}
                className="inline-flex h-11 items-center rounded-xl border border-border bg-card px-4 text-sm font-medium hover:border-green/30"
              >
                Previous
              </Link>
            ) : null}
            <span className="text-sm text-muted">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            {pagination.hasMore ? (
              <Link
                href={`/blog?${new URLSearchParams({
                  ...(categorySlug ? { category: categorySlug } : {}),
                  page: String(pagination.page + 1),
                }).toString()}`}
                className="inline-flex h-11 items-center rounded-xl border border-border bg-card px-4 text-sm font-medium hover:border-green/30"
              >
                Load more
              </Link>
            ) : null}
          </div>
        ) : null}
      </section>

      <Newsletter />
    </>
  );
}
