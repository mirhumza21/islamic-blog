import { ArticleCard } from "@/components/blog/ArticleCard";
import type { Article, Category } from "@/types/blog";

export function RelatedArticles({
  articles,
  categories,
}: {
  articles: Article[];
  categories: Category[];
}) {
  if (articles.length === 0) return null;

  const categoryMap = new Map(categories.map((category) => [category.slug, category]));

  return (
    <section className="mt-16 border-t border-border pt-12 lg:mt-20 lg:pt-14">
      <div className="mb-8 flex items-baseline justify-between border-b border-border/60 pb-4">
        <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Continue Reading
        </h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
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
