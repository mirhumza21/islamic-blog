import { ArticleCard } from "@/components/blog/ArticleCard";
import type { Article, Category } from "@/types/blog";

export function ArticleGrid({
  articles,
  categories,
}: {
  articles: Article[];
  categories: Category[];
}) {
  const categoryMap = new Map(categories.map((category) => [category.slug, category]));

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {articles.map((article, index) => (
        <div
          key={article.id}
          className={index % 5 === 0 ? "sm:row-span-1" : undefined}
        >
          <ArticleCard
            article={article}
            category={categoryMap.get(article.categorySlug)}
          />
        </div>
      ))}
    </div>
  );
}
