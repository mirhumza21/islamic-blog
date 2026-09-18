import type { Metadata } from "next";
import { SearchResults } from "@/components/search/SearchResults";
import { popularSearches } from "@/data/categories";
import { searchPublishedArticles } from "@/lib/articles";
import Link from "next/link";
import { SearchPageForm } from "@/components/search/SearchPageForm";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  return {
    title: query ? `Search: ${query}` : "Search",
    description: "Search UmrahZone articles, guides, and Islamic lifestyle content.",
    alternates: {
      canonical: query ? `/search?q=${encodeURIComponent(query)}` : "/search",
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchPublishedArticles(query) : [];

  return (
    <section className="container-editorial py-14 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green">
        Search
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Find guidance
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        Search articles, Umrah guides, duas, and practical tips.
      </p>

      <div className="mt-8 max-w-2xl">
        <SearchPageForm initialQuery={query} />
      </div>

      {!query ? (
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
            Popular searches
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {popularSearches.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-border bg-card px-3 py-2 text-sm transition-colors hover:border-green/30 hover:text-green"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">
          {results.length} result{results.length === 1 ? "" : "s"} for “{query}”
        </p>
      )}

      <div className="mt-8">
        <SearchResults query={query} results={results} />
      </div>
    </section>
  );
}
