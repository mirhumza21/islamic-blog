import { CategoryGrid } from "@/components/home/CategoryGrid";
import { DailySpiritualHub } from "@/components/home/DailySpiritualHub";
import { FeaturedArticle } from "@/components/home/FeaturedArticle";
import { Hero } from "@/components/home/Hero";
import { IslamicCalendarHub } from "@/components/home/IslamicCalendarHub";
import { LatestArticles } from "@/components/home/LatestArticles";
import { Newsletter } from "@/components/home/Newsletter";
import {
  fetchAllArticles,
  fetchAllCategories,
  fetchAuthorById,
  fetchCategoryBySlug,
  fetchFeaturedArticle,
  fetchLatestArticles,
  fetchPopularArticles,
} from "@/lib/articles";
import { getHomePageContent } from "@/lib/pages";

export default async function HomePage() {
  const [homeContent, articles, categories] = await Promise.all([
    getHomePageContent(),
    fetchAllArticles(),
    fetchAllCategories(),
  ]);
  const featured = await fetchFeaturedArticle(articles);
  const author = featured ? await fetchAuthorById(featured.authorId) : undefined;
  const category = featured
    ? await fetchCategoryBySlug(featured.categorySlug)
    : undefined;
  const latest = (await fetchLatestArticles(6, articles)).filter(
    (article) => article.id !== featured?.id
  );
  const popular = await fetchPopularArticles(5, articles);

  return (
    <>
      <Hero content={homeContent} />

      {/* Daily Spiritual Essentials */}
      <DailySpiritualHub />

      {/* Islamic Calendar & Event Countdown */}
      <IslamicCalendarHub />

      {/* Browse by Category */}
      <section className="container-editorial py-12 lg:py-16">
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

      {/* Featured Article Guide */}
      {featured && author && category ? (
        <FeaturedArticle
          article={featured}
          author={author}
          category={category}
        />
      ) : null}

      {/* Redesigned Latest Articles Stream */}
      <LatestArticles
        articles={latest}
        popular={popular}
        categories={categories}
      />

      <Newsletter />
    </>
  );
}
