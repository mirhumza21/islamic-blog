"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { popularSearches } from "@/data/categories";
import { searchArticles } from "@/lib/articles";
import { cn } from "@/lib/utils";

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const results = useMemo(() => searchArticles(query).slice(0, 8), [query]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const goToSearchPage = (value = query) => {
    const q = value.trim();
    onOpenChange(false);
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (results[activeIndex]) {
        onOpenChange(false);
        router.push(`/blog/${results[activeIndex].article.slug}`);
      } else {
        goToSearchPage();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          isMobile &&
            "top-0 left-0 h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 rounded-none border-0 p-4 sm:p-4"
        )}
      >
        <DialogHeader>
          <DialogTitle>Search UmrahZone</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search articles, guides, duas…"
            className="pl-10"
            autoFocus
            aria-label="Search articles"
          />
        </div>

        {!query ? (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
              Popular searches
            </p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setQuery(term);
                    goToSearchPage(term);
                  }}
                  className="rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:border-green/30 hover:text-green"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-h-[55vh] overflow-y-auto" role="listbox">
            {results.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border bg-cream/60 px-4 py-8 text-center text-sm text-muted">
                No articles found for “{query}”.
              </p>
            ) : (
              <ul className="space-y-1">
                {results.map((result, index) => (
                  <li key={result.article.id}>
                    <Link
                      href={`/blog/${result.article.slug}`}
                      onClick={() => onOpenChange(false)}
                      className={cn(
                        "block rounded-xl px-3 py-3 transition-colors",
                        index === activeIndex
                          ? "bg-cream"
                          : "hover:bg-cream/70"
                      )}
                      role="option"
                      aria-selected={index === activeIndex}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.06em] text-green">
                        {result.categoryName}
                      </p>
                      <p className="mt-1 font-serif text-lg leading-snug text-foreground">
                        {result.article.title}
                      </p>
                      <p className="mt-1 line-clamp-1 text-sm text-muted">
                        {result.article.excerpt}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
          <span>Use ↑ ↓ to navigate, Enter to open</span>
          <button
            type="button"
            className="font-medium text-green hover:underline"
            onClick={() => goToSearchPage()}
          >
            View all results
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
