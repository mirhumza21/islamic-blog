import { CategoryGrid } from "@/components/home/CategoryGrid";
import { DailySpiritualHub } from "@/components/home/DailySpiritualHub";
import { FeaturedArticle } from "@/components/home/FeaturedArticle";
import { Hero } from "@/components/home/Hero";
import { IslamicCalendarHub } from "@/components/home/IslamicCalendarHub";
import { LatestArticles } from "@/components/home/LatestArticles";
import { GlobalNewsletter } from "@/components/home/GlobalNewsletter";
import { SectionHeader } from "@/components/home/SectionHeader";
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
      <DailySpiritualHub content={homeContent.dailySpiritual} />

      {/* Islamic Calendar & Event Countdown */}
      <IslamicCalendarHub content={homeContent.calendar} />

      <section className="relative overflow-hidden bg-ivory">
        <div
          className="pointer-events-none absolute inset-0 pattern-geometric-cream opacity-45"
          aria-hidden
        />
        <div className="container-editorial relative py-12 lg:py-16">
          <SectionHeader
            eyebrow={homeContent.categories?.eyebrow || "Explore Knowledge"}
            title={homeContent.categories?.title || "Browse by Category"}
            tone="sand"
          />
          <CategoryGrid categories={categories} />
        </div>
      </section>

      {/* Featured Article Guide */}
      {featured && author && category ? (
        <FeaturedArticle
          article={featured}
          author={author}
          category={category}
          content={homeContent.featured}
        />
      ) : null}

      {/* Redesigned Latest Articles Stream */}
      <LatestArticles
        articles={latest}
        popular={popular}
        categories={categories}
        content={homeContent.latest}
      />

      <GlobalNewsletter />
    </>
  );
}
