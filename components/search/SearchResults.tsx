import Link from "next/link";
import { ArticleCard } from "@/components/blog/ArticleCard";
import type { SearchResult } from "@/types/blog";

export function SearchResults({
  query,
  results,
}: {
  query: string;
  results: SearchResult[];
}) {
  if (!query) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-cream/50 px-5 py-10 text-center text-muted">
        Start typing to search articles, guides, and duas.
      </p>
    );
  }

  if (results.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-cream/50 px-5 py-10 text-center">
        <p className="text-muted">No results for “{query}”.</p>
        <Link href="/blog" className="mt-3 inline-block text-sm font-medium text-green hover:underline">
          Browse all articles
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((result) => (
        <ArticleCard
          key={result.article.id}
          article={result.article}
          category={{
            id: result.article.categorySlug,
            slug: result.article.categorySlug,
            name: result.categoryName,
            description: "",
            shortDescription: "",
            image: result.article.image,
            icon: "book",
          }}
        />
      ))}
    </div>
  );
}
