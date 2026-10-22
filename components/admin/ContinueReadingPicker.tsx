"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Search, X } from "lucide-react";
import { CONTINUE_READING_LIMIT } from "@/lib/articleEditor";

export type ContinueReadingChoice = {
  id: string;
  slug: string;
  title: string;
  status?: string;
  image?: string;
};

function ArticleThumb({ src }: { src?: string }) {
  if (!src) {
    return (
      <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md bg-gray-100 text-[9px] font-semibold text-gray-400">
        No image
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="h-10 w-14 shrink-0 rounded-md object-cover bg-gray-100"
    />
  );
}

export function ContinueReadingPicker({
  articles,
  currentSlug,
  value,
  onChange,
}: {
  articles: ContinueReadingChoice[];
  currentSlug?: string;
  value: string[];
  onChange: (slugs: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const bySlug = useMemo(
    () => new Map(articles.map((article) => [article.slug, article])),
    [articles]
  );

  const selected = value
    .map((slug) => bySlug.get(slug))
    .filter((article): article is ContinueReadingChoice => Boolean(article));

  const available = articles.filter((article) => {
    if (article.slug === currentSlug) return false;
    if (value.includes(article.slug)) return false;
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return (
      article.title.toLowerCase().includes(needle) ||
      article.slug.toLowerCase().includes(needle)
    );
  });

  const add = (slug: string) => {
    if (value.length >= CONTINUE_READING_LIMIT || value.includes(slug)) return;
    onChange([...value, slug]);
  };

  const remove = (slug: string) => {
    onChange(value.filter((item) => item !== slug));
  };

  const move = (index: number, direction: -1 | 1) => {
    const next = [...value];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-gray-700">
            Selected for Continue Reading
          </p>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
            {value.length}/{CONTINUE_READING_LIMIT}
          </span>
        </div>
        {selected.length === 0 ? (
          <p className="mt-2 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-3 py-3 text-xs text-gray-500">
            No posts selected yet. Choose four articles from the list below.
          </p>
        ) : (
          <ol className="mt-2 space-y-2">
            {selected.map((article, index) => (
              <li
                key={article.slug}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-700">
                  {index + 1}
                </span>
                <ArticleThumb src={article.image} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-gray-900">
                    {article.title}
                  </span>
                  <span className="block truncate font-mono text-[11px] text-gray-400">
                    /{article.slug}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
                  title="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === selected.length - 1}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
                  title="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(article.slug)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-rose-50 hover:text-rose-600"
                  title="Remove"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-700">Add an article</label>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles by title..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-xs text-gray-900 outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>
        <div className="mt-2 max-h-56 space-y-1 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5">
          {available.length === 0 ? (
            <p className="px-2 py-3 text-center text-xs text-gray-400">
              No matching articles.
            </p>
          ) : (
            available.slice(0, 30).map((article) => (
              <button
                key={article.id}
                type="button"
                onClick={() => add(article.slug)}
                disabled={value.length >= CONTINUE_READING_LIMIT}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArticleThumb src={article.image} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-gray-800">
                    {article.title}
                  </span>
                  <span className="block truncate text-[11px] text-gray-400">
                    {article.status === "draft" ? "Draft · " : ""}/{article.slug}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
