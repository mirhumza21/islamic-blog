import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleGrid } from "@/components/blog/ArticleGrid";
import { FeaturedArticle } from "@/components/home/FeaturedArticle";
import { GlobalNewsletter } from "@/components/home/GlobalNewsletter";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeader } from "@/components/home/SectionHeader";
import {
  fetchAllCategories,
  fetchArticlesByCategory,
  fetchAuthorById,
  fetchCategoryBySlug,
} from "@/lib/articles";
import { BookOpen, Compass } from "lucide-react";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: {
      title: `${category.name} | UmrahZone`,
      description: category.description,
      images: [{ url: category.image, alt: category.name }],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);
  if (!category) notFound();

  const [articles, categories] = await Promise.all([
    fetchArticlesByCategory(slug),
    fetchAllCategories(),
  ]);
  const featured = articles[0];
  const author = featured ? await fetchAuthorById(featured.authorId) : undefined;
  const relatedCategories = categories
    .filter((item) => item.slug !== slug)
    .slice(0, 4);
  const remaining = articles.filter((article) => article.id !== featured?.id);

  return (
    <>
      <PageHero
        eyebrow="Category"
        title={category.name}
        subtitle={category.description}
        icon={<Compass className="h-3 w-3" />}
      />

      {featured && author ? (
        <FeaturedArticle
          article={featured}
          author={author}
          category={category}
        />
      ) : null}

      <section className="relative overflow-hidden bg-ivory">
        <div
          className="pointer-events-none absolute inset-0 pattern-geometric-cream opacity-40"
          aria-hidden
        />
        <div className="container-editorial relative py-14 lg:py-16">
          <SectionHeader
            eyebrow="Library"
            title={`Articles in ${category.name}`}
            tone="green"
            icon={<BookOpen className="h-3 w-3" />}
          />

          {remaining.length > 0 || !featured ? (
            <ArticleGrid
              articles={remaining.length > 0 ? remaining : articles}
              categories={categories}
            />
          ) : (
            <p className="rounded-[26px] border border-[#e6dfd3] bg-white/80 px-6 py-10 text-center text-sm text-muted">
              More articles coming soon in this category.
            </p>
          )}

          {relatedCategories.length > 0 ? (
            <div className="mt-14">
              <h3 className="font-serif text-2xl font-bold tracking-tight text-[#141d1a]">
                Related categories
              </h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {relatedCategories.map((item) => (
                  <Link
                    key={item.id}
                    href={`/category/${item.slug}`}
                    className="inline-flex h-11 items-center rounded-full border border-[#e6dfd3] bg-white/80 px-4 text-sm font-medium text-[#141d1a] transition-colors hover:border-[#c59a53]/50 hover:text-[#063b2f]"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <GlobalNewsletter />
    </>
  );
}
