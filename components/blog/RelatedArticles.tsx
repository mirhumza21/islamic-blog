import { ArticleCard } from "@/components/blog/ArticleCard";
import { SectionHeader } from "@/components/home/SectionHeader";
import type { Article, Category } from "@/types/blog";
import { BookOpen } from "lucide-react";

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
    <section className="mt-16 pt-4 lg:mt-20">
      <SectionHeader
        eyebrow="Keep Reading"
        title="Continue Reading"
        icon={<BookOpen className="h-3 w-3" />}
        tone="sand"
      />
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
