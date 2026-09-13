import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleGrid } from "@/components/blog/ArticleGrid";
import { FeaturedArticle } from "@/components/home/FeaturedArticle";
import { Newsletter } from "@/components/home/Newsletter";
import {
  getAllCategories,
  getArticlesByCategory,
  getAuthorById,
  getCategoryBySlug,
} from "@/lib/articles";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
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
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const articles = getArticlesByCategory(slug);
  const featured = articles[0];
  const author = featured ? getAuthorById(featured.authorId) : undefined;
  const categories = getAllCategories();
  const relatedCategories = categories
    .filter((item) => item.slug !== slug)
    .slice(0, 4);
  const remaining = articles.filter((article) => article.id !== featured?.id);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <Image
            src={category.image}
            alt={category.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-green-dark/75" />
        </div>
        <div className="container-editorial relative py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sand">
            Category
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {category.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">
            {category.description}
          </p>
        </div>
      </section>

      {featured && author ? (
        <FeaturedArticle
          article={featured}
          author={author}
          category={category}
        />
      ) : null}

      <section className="container-editorial py-14 lg:py-16">
        <h2 className="font-serif text-3xl font-semibold text-foreground">
          Articles in {category.name}
        </h2>
        <div className="mt-8">
          {remaining.length > 0 || !featured ? (
            <ArticleGrid
              articles={remaining.length > 0 ? remaining : articles}
              categories={categories}
            />
          ) : (
            <p className="text-muted">More articles coming soon in this category.</p>
          )}
        </div>

        <div className="mt-14">
          <h3 className="font-serif text-2xl font-semibold text-foreground">
            Related categories
          </h3>
          <div className="mt-5 flex flex-wrap gap-3">
            {relatedCategories.map((item) => (
              <Link
                key={item.id}
                href={`/category/${item.slug}`}
                className="inline-flex h-11 items-center rounded-xl border border-border bg-card px-4 text-sm font-medium transition-colors hover:border-green/30 hover:text-green"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
