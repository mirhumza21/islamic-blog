import { ArticleCard } from "@/components/blog/ArticleCard";
import { SectionHeader } from "@/components/home/SectionHeader";
import type { Article, Category } from "@/types/blog";

export function RelatedArticles({
  articles,
  categories,
  title,
  description,
}: {
  articles: Article[];
  categories: Category[];
  title?: string;
  description?: string;
}) {
  if (articles.length === 0) return null;

  const categoryMap = new Map(categories.map((category) => [category.slug, category]));
  const heading = title?.trim() || "Continue Reading";
  const copy = description?.trim();

  return (
    <section className="mt-16 pt-4 lg:mt-20">
      <SectionHeader title={heading} description={copy} />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 xl:gap-8">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            category={categoryMap.get(article.categorySlug)}
          />
        ))}
      </div>
    </section>
  );
}
