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
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="font-serif text-3xl font-semibold text-foreground">
        Continue Reading
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
