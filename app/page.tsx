import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedArticle } from "@/components/home/FeaturedArticle";
import { Hero } from "@/components/home/Hero";
import { LatestArticles } from "@/components/home/LatestArticles";
import { Newsletter } from "@/components/home/Newsletter";
import {
  getAllCategories,
  getAuthorById,
  getCategoryBySlug,
  getFeaturedArticle,
  getLatestArticles,
  getPopularArticles,
} from "@/lib/articles";

export default function HomePage() {
  const featured = getFeaturedArticle();
  const author = featured ? getAuthorById(featured.authorId) : undefined;
  const category = featured
    ? getCategoryBySlug(featured.categorySlug)
    : undefined;
  const categories = getAllCategories();
  const latest = getLatestArticles(6).filter(
    (article) => article.id !== featured?.id
  );
  const popular = getPopularArticles(5);

  return (
    <>
      <Hero />
      <section className="container-editorial py-16 lg:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green">
              Explore Knowledge
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Browse by Category
            </h2>
          </div>
        </div>
        <CategoryGrid categories={categories} />
      </section>
      {featured && author && category ? (
        <FeaturedArticle
          article={featured}
          author={author}
          category={category}
        />
      ) : null}
      <LatestArticles
        articles={latest}
        popular={popular}
        categories={categories}
      />
      <Newsletter />
    </>
  );
}
