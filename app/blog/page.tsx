import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArticleGrid } from "@/components/blog/ArticleGrid";
import { CategoryFilters } from "@/components/blog/CategoryFilters";
import { Newsletter } from "@/components/home/Newsletter";
import {
  fetchAllArticles,
  fetchAllCategories,
  fetchArticlesByCategory,
  fetchAuthorById,
  fetchCategoryBySlug,
  fetchPopularArticles,
  paginateArticles,
} from "@/lib/articles";
import { formatDate } from "@/lib/utils";
import { BookOpen, Clock, Sparkles, TrendingUp, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Islamic Guides",
  description:
    "Explore authentic Umrah guides, Islamic lifestyle articles, Quran reflections, Hadith, and travel tips on UmrahZone.",
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
  const [categories, articles] = await Promise.all([
    fetchAllCategories(),
    fetchAllArticles(),
  ]);
  const all = categorySlug
    ? await fetchArticlesByCategory(categorySlug, articles)
    : articles;

  const featured = all[0];
  const author = featured ? await fetchAuthorById(featured.authorId) : undefined;
  const featuredCategory = featured
    ? await fetchCategoryBySlug(featured.categorySlug)
    : undefined;

  const remaining = all.filter((article) => article.id !== featured?.id);
  const pagination = paginateArticles(remaining, page, 6);
  const activeCategory = categorySlug
    ? await fetchCategoryBySlug(categorySlug)
    : undefined;

  const popular = await fetchPopularArticles(4, articles);

  return (
    <>
      {/* Blog Hero Header */}
      <section className="relative overflow-hidden border-b border-border bg-ivory py-14 lg:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-20 pattern-geometric-cream" aria-hidden />

        <div className="container-editorial relative z-10 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sand/30 bg-cream/80 px-4 py-1 text-xs font-bold uppercase tracking-[0.16em] text-sand shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            Sacred Knowledge & Editorial Library
          </div>

          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {activeCategory ? activeCategory.name : "Faith, Guides & Reflections"}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {activeCategory
              ? activeCategory.description
              : "Authentic spiritual insights, practical Umrah preparations, and inspiring articles grounded in the Qur'an and Sunnah."}
          </p>
        </div>
      </section>

      {/* Category Pills Filter */}
      <div className="border-b border-border bg-cream/40 py-5">
        <div className="container-editorial">
          <CategoryFilters
            categories={categories}
            activeSlug={categorySlug}
          />
        </div>
      </div>

      <div className="container-editorial py-12 lg:py-16">
        {/* Featured Editorial Post on Page 1 */}
        {featured && author && featuredCategory && page === 1 ? (
          <div className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-green">
                EDITOR'S FEATURED PICK
              </span>
              <span className="rounded-full bg-sand/15 px-3 py-0.5 text-xs font-semibold text-sand">
                Must Read
              </span>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-border/80 bg-card shadow-md transition-all lg:grid lg:grid-cols-12 lg:items-stretch">
              <div className="relative aspect-[16/10] overflow-hidden lg:col-span-7 lg:aspect-auto lg:rounded-l-[28px] isolate">
                <Image
                  src={featured.image}
                  alt={featured.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5 lg:p-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-cream px-3 py-1 text-xs font-bold uppercase tracking-wider text-green">
                      {featuredCategory.name}
                    </span>
                    <span className="text-xs text-muted">
                      {formatDate(featured.publishedAt)}
                    </span>
                  </div>

                  <h2 className="mt-4 font-serif text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-3xl lg:text-[2rem]">
                    <Link
                      href={`/blog/${featured.slug}`}
                      className="transition-colors hover:text-green"
                    >
                      {featured.title}
                    </Link>
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-3">
                    {featured.excerpt}
                  </p>
                </div>

                <div className="mt-8 border-t border-border/60 pt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {author.avatar ? (
                      <Image
                        src={author.avatar}
                        alt={author.name}
                        width={36}
                        height={36}
                        className="rounded-full object-cover"
                      />
                    ) : null}
                    <div>
                      <div className="text-xs font-semibold text-foreground">
                        {author.name}
                      </div>
                      <div className="text-[11px] text-muted flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {featured.readingTime} min read
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${featured.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-green px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-green-dark"
                  >
                    Read Guide
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Main 2-Column Layout: Articles + Sidebar */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Main Articles Stream */}
          <div className="lg:col-span-8">
            <div className="mb-6 flex items-baseline justify-between border-b border-border/60 pb-4">
              <h3 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {activeCategory ? `${activeCategory.name} Articles` : "Recent Publications"}
              </h3>
              <span className="text-xs font-medium text-muted">
                Showing {pagination.items.length} of {pagination.total} articles
              </span>
            </div>

            {pagination.items.length > 0 ? (
              <ArticleGrid articles={pagination.items} categories={categories} />
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-cream/40 p-12 text-center text-muted">
                <BookOpen className="mx-auto h-8 w-8 text-sand/60" />
                <h4 className="mt-3 font-serif text-lg font-bold text-foreground">
                  No articles found
                </h4>
                <p className="mt-1 text-xs">
                  We are continually writing new guides. Check back soon!
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 ? (
              <div className="mt-12 flex items-center justify-center gap-3 border-t border-border/60 pt-8">
                {pagination.page > 1 ? (
                  <Link
                    href={`/blog?${new URLSearchParams({
                      ...(categorySlug ? { category: categorySlug } : {}),
                      page: String(pagination.page - 1),
                    }).toString()}`}
                    className="inline-flex h-10 items-center rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:border-green hover:text-green shadow-xs"
                  >
                    &larr; Previous Page
                  </Link>
                ) : null}

                <span className="rounded-lg bg-cream px-3 py-1.5 text-xs font-bold text-green">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                {pagination.hasMore ? (
                  <Link
                    href={`/blog?${new URLSearchParams({
                      ...(categorySlug ? { category: categorySlug } : {}),
                      page: String(pagination.page + 1),
                    }).toString()}`}
                    className="inline-flex h-10 items-center rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:border-green hover:text-green shadow-xs"
                  >
                    Next Page &rarr;
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8 lg:col-span-4">
            {/* Spiritual Reflection Card */}
            <div className="rounded-2xl border border-[#ecdcc3] bg-[#faf6ee] p-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b87c32]">
                <Sparkles className="h-4 w-4" />
                Spiritual Reflection
              </div>
              <blockquote className="mt-3 font-serif text-base italic leading-relaxed text-foreground">
                &ldquo;Whoever takes a path upon which he seeks knowledge, Allah makes the path to Paradise easy for him.&rdquo;
              </blockquote>
              <div className="mt-3 text-right text-xs font-semibold text-muted">
                — Sahih Muslim: 2699
              </div>
            </div>

            {/* Popular Articles List */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3 text-xs font-bold uppercase tracking-wider text-green">
                <TrendingUp className="h-4 w-4" />
                Trending Reads
              </div>

              <div className="mt-4 space-y-4">
                {popular.map((item, index) => (
                  <div key={item.id} className="group flex items-start gap-3">
                    <span className="font-serif text-2xl font-bold text-sand/60 transition-colors group-hover:text-green">
                      0{index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-green">
                        <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                      </h4>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {item.readingTime} min read
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories Quick Links */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
              <div className="border-b border-border/60 pb-3 text-xs font-bold uppercase tracking-wider text-foreground">
                Browse Topics
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="rounded-xl border border-border/70 bg-ivory px-3 py-1.5 text-xs font-medium text-foreground/80 transition-all hover:border-green hover:bg-cream hover:text-green"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
    </>
  );
}
