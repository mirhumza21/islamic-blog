import type { Metadata } from "next";
import { SearchResults } from "@/components/search/SearchResults";
import { popularSearches } from "@/data/categories";
import { searchPublishedArticles } from "@/lib/articles";
import Link from "next/link";
import { SearchPageForm } from "@/components/search/SearchPageForm";
import { PageHero } from "@/components/layout/PageHero";
import { Search } from "lucide-react";

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
    <>
      <PageHero
        eyebrow="Search"
        title="Find guidance"
        subtitle="Search articles, Umrah guides, duas, and practical tips."
        icon={<Search className="h-3 w-3" />}
      />

      <section className="relative overflow-hidden bg-ivory">
        <div
          className="pointer-events-none absolute inset-0 pattern-geometric-cream opacity-40"
          aria-hidden
        />
        <div className="container-editorial relative py-10 lg:py-14">
          <div className="max-w-2xl">
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
                    className="rounded-full border border-[#e6dfd3] bg-white/80 px-3.5 py-2 text-sm text-[#141d1a] transition-colors hover:border-[#c59a53]/50 hover:text-[#063b2f]"
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
        </div>
      </section>
    </>
  );
}
