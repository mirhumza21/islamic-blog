import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArticleGrid } from "@/components/blog/ArticleGrid";
import { CategoryFilters } from "@/components/blog/CategoryFilters";
import { GlobalNewsletter } from "@/components/home/GlobalNewsletter";
import { GoldUnderline, underlineLastWord } from "@/components/home/GoldUnderline";
import { SectionHeader } from "@/components/home/SectionHeader";
import { SidebarSearch } from "@/components/home/SidebarSearch";
import {
  fetchAllArticles,
  fetchAllCategories,
  fetchArticlesByCategory,
  fetchAuthorById,
  fetchCategoryBySlug,
  fetchPopularArticles,
  paginateArticles,
} from "@/lib/articles";
import { getBlogPageContent } from "@/lib/pages";
import { formatDate } from "@/lib/utils";
import { BookOpen, Clock, Sparkles, TrendingUp, ArrowRight } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getBlogPageContent();
  return {
    title: "Blog & Islamic Guides",
    description: copy.description,
    alternates: {
      canonical: "/blog",
    },
  };
}

type BlogPageProps = {
  searchParams: Promise<{ category?: string; page?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const categorySlug = params.category;
  const page = Number(params.page ?? "1") || 1;
  const [categories, articles, copy] = await Promise.all([
    fetchAllCategories(),
    fetchAllArticles(),
    getBlogPageContent(),
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
  const heroTitle = activeCategory ? activeCategory.name : copy.title;
  const { lead, last } = underlineLastWord(heroTitle);

  const pageHref = (nextPage: number) => {
    const query = new URLSearchParams({
      ...(categorySlug ? { category: categorySlug } : {}),
      page: String(nextPage),
    }).toString();
    return `/blog?${query}`;
  };

  return (
    <>
      <section className="relative overflow-hidden bg-ivory">
        <div
          className="pointer-events-none absolute inset-0 pattern-geometric-cream opacity-50"
          aria-hidden
        />
        <div className="container-editorial relative py-14 text-center lg:py-20">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sand/15 px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-sand">
            <Sparkles className="h-3 w-3" />
            {copy.eyebrow}
          </div>
          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-[#141d1a] sm:text-5xl lg:text-[3.4rem] lg:leading-[1.12]">
            {lead ? `${lead} ` : null}
            <span className="relative inline-block text-[#063b2f]">
              {last}
              <GoldUnderline />
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {activeCategory ? activeCategory.description : copy.description}
          </p>
        </div>
      </section>

      <div className="relative overflow-hidden bg-cream/80">
        <div
          className="pointer-events-none absolute inset-0 pattern-geometric-cream opacity-40"
          aria-hidden
        />
        <div className="container-editorial relative py-5">
          <CategoryFilters categories={categories} activeSlug={categorySlug} />
        </div>
      </div>

      <div className="relative overflow-hidden bg-ivory">
        <div
          className="pointer-events-none absolute inset-0 pattern-geometric-cream opacity-40"
          aria-hidden
        />
        <div className="container-editorial relative py-12 lg:py-16">
          {featured && author && featuredCategory && page === 1 ? (
            <article className="mb-16 grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-sand/15 px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-sand">
                  {copy.featuredBadge}
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#063b2f]">
                  {featuredCategory.name}
                </p>
                <h2 className="mt-3 font-serif text-3xl font-bold leading-[1.15] tracking-tight text-[#141d1a] sm:text-4xl">
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="transition-colors hover:text-[#063b2f]"
                  >
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted">
                  {featured.excerpt}
                </p>
                <div className="mt-8">
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#063b2f] px-7 text-[14px] font-semibold text-white shadow-[0_2px_12px_rgba(6,59,47,0.25)] transition-[background-color,box-shadow] duration-200 hover:bg-[#042d24] hover:shadow-[0_4px_16px_rgba(6,59,47,0.38)]"
                  >
                    {copy.featuredButton}
                    <ArrowRight className="h-4 w-4 text-white/90" strokeWidth={1.8} />
                  </Link>
                </div>
                <div className="mt-8 flex items-center gap-3">
                  {author.avatar ? (
                    <Image
                      src={author.avatar}
                      alt={author.name}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : null}
                  <div>
                    <p className="text-sm font-medium text-[#141d1a]">{author.name}</p>
                    <p className="flex items-center gap-1 text-xs text-muted">
                      <Clock className="h-3 w-3 text-sand" />
                      {formatDate(featured.publishedAt)} · {featured.readingTime} min read
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href={`/blog/${featured.slug}`}
                className="group relative block overflow-hidden rounded-[28px] border border-[#e6dfd3] shadow-[0_12px_40px_-16px_rgba(6,59,47,0.18)] transition-colors duration-200 hover:border-[#c59a53]/50 lg:col-span-7"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[28px] [clip-path:inset(0)] [transform:translateZ(0)]">
                  <Image
                    src={featured.image}
                    alt={featured.imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
              </Link>
            </article>
          ) : null}

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <SectionHeader
                eyebrow={activeCategory ? "Topic" : "Publications"}
                title={
                  activeCategory
                    ? `${activeCategory.name} Articles`
                    : copy.recentTitle
                }
                subtitle={`Showing ${pagination.items.length} of ${pagination.total} articles`}
                tone="green"
              />

              {pagination.items.length > 0 ? (
                <ArticleGrid articles={pagination.items} categories={categories} />
              ) : (
                <div className="rounded-[26px] border border-[#e6dfd3] bg-white/80 p-12 text-center shadow-[0_8px_28px_-16px_rgba(6,59,47,0.14)]">
                  <BookOpen className="mx-auto h-8 w-8 text-sand/70" />
                  <h4 className="mt-3 font-serif text-lg font-bold text-[#141d1a]">
                    {copy.emptyTitle}
                  </h4>
                  <p className="mt-1 text-sm text-muted">{copy.emptyText}</p>
                </div>
              )}

              {pagination.totalPages > 1 ? (
                <div className="mt-12 flex items-center justify-center gap-3">
                  {pagination.page > 1 ? (
                    <Link
                      href={pageHref(pagination.page - 1)}
                      className="inline-flex h-11 items-center rounded-full border border-[#c59a53]/60 bg-white/70 px-5 text-[13px] font-semibold text-[#141d1a] transition-colors hover:border-[#063b2f] hover:text-[#063b2f]"
                    >
                      Previous
                    </Link>
                  ) : null}

                  <span className="rounded-full bg-[#063b2f] px-4 py-2 text-xs font-bold text-white">
                    {pagination.page} / {pagination.totalPages}
                  </span>

                  {pagination.hasMore ? (
                    <Link
                      href={pageHref(pagination.page + 1)}
                      className="inline-flex h-11 items-center rounded-full border border-[#c59a53]/60 bg-white/70 px-5 text-[13px] font-semibold text-[#141d1a] transition-colors hover:border-[#063b2f] hover:text-[#063b2f]"
                    >
                      Next
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </div>

            <aside className="space-y-6 lg:col-span-4">
              <SidebarSearch />

              <div className="overflow-hidden rounded-[26px] border border-[#ecdcc3] bg-gradient-to-br from-[#faf6ef] to-[#f5ede0] p-6 shadow-[0_8px_28px_-16px_rgba(6,59,47,0.1)]">
                <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[#b87c32]">
                  <Sparkles className="h-3.5 w-3.5" />
                  {copy.reflectionEyebrow}
                </div>
                <blockquote className="mt-3 font-serif text-base italic leading-relaxed text-[#141d1a]">
                  &ldquo;{copy.reflectionQuote}&rdquo;
                </blockquote>
                <div className="mt-3 text-right text-xs font-semibold text-[#8a6b32]">
                  — {copy.reflectionSource}
                </div>
              </div>

              <div className="rounded-[26px] border border-[#e6dfd3] bg-white/80 p-6 shadow-[0_8px_28px_-16px_rgba(6,59,47,0.14)]">
                <div className="flex items-center gap-2 border-b border-[#e6dfd3] pb-3.5 text-xs font-bold uppercase tracking-wider text-[#063b2f]">
                  <TrendingUp className="h-4 w-4 text-[#c59a53]" />
                  <span>{copy.trendingLabel}</span>
                </div>
                <ol className="mt-5 space-y-4">
                  {popular.map((item, index) => (
                    <li key={item.id} className="group flex items-start gap-3.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand/15 font-serif text-sm font-bold text-sand transition-colors group-hover:bg-[#063b2f] group-hover:text-white">
                        0{index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-serif text-[15px] font-bold leading-snug text-[#141d1a] transition-colors group-hover:text-[#063b2f] line-clamp-2">
                          <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                        </h4>
                        <p className="mt-1 text-[11px] text-muted">
                          {item.readingTime} min read
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-[26px] border border-[#e6dfd3] bg-white/80 p-6 shadow-[0_8px_28px_-16px_rgba(6,59,47,0.14)]">
                <div className="border-b border-[#e6dfd3] pb-3 text-xs font-bold uppercase tracking-wider text-[#063b2f]">
                  {copy.topicsLabel}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="rounded-full border border-[#e6dfd3] bg-ivory px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-[#c59a53]/50 hover:text-[#063b2f]"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <GlobalNewsletter />
    </>
  );
}
