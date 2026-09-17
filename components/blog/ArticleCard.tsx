"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, Clock, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, cn } from "@/lib/utils";
import type { Article, Category } from "@/types/blog";

export function ArticleCard({
  article,
  category,
  variant = "default",
}: {
  article: Article;
  category?: Category;
  variant?: "default" | "compact" | "horizontal";
}) {
  const [bookmarked, setBookmarked] = useState(false);

  if (variant === "horizontal") {
    return (
      <article className="group flex gap-4 items-center rounded-2xl border border-border/70 bg-card p-3 transition-all duration-200 hover:border-green/30 hover:shadow-xs">
        <Link
          href={`/blog/${article.slug}`}
          className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-cream [clip-path:inset(0)] [transform:translateZ(0)]"
        >
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </Link>
        <div className="min-w-0 flex-1">
          {category ? (
            <span className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-green">
              {category.name}
            </span>
          ) : null}
          <h4 className="mt-1 font-serif text-[15px] font-semibold leading-snug text-foreground transition-colors group-hover:text-green line-clamp-2">
            <Link href={`/blog/${article.slug}`}>{article.title}</Link>
          </h4>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-muted">
            <span>{formatDate(article.publishedAt)}</span>
            <span>&bull;</span>
            <span className="flex items-center gap-0.5">
              <Clock className="h-3 w-3" />
              {article.readingTime} min read
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-colors duration-200 hover:border-green/40",
        variant === "compact" && "rounded-xl"
      )}
    >
      <Link
        href={`/blog/${article.slug}`}
        className="relative block aspect-[16/10] w-full overflow-hidden rounded-t-2xl bg-cream isolate [clip-path:inset(0)] [transform:translateZ(0)]"
      >
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {category ? (
          <span className="absolute left-3.5 top-3.5 rounded-full bg-white/95 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-green shadow-xs backdrop-blur-xs">
            {category.name}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-sand" />
            {article.readingTime} min read
          </span>
          <button
            type="button"
            onClick={() => setBookmarked(!bookmarked)}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              bookmarked
                ? "bg-green text-white"
                : "text-muted hover:bg-cream hover:text-green"
            }`}
            aria-label={`Bookmark ${article.title}`}
          >
            <Bookmark className="h-3.5 w-3.5" fill={bookmarked ? "currentColor" : "none"} />
          </button>
        </div>

        <h3 className="mt-3 font-serif text-xl font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-green sm:text-[1.35rem]">
          <Link href={`/blog/${article.slug}`} className="flex items-start justify-between gap-2">
            <span>{article.title}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5" />
          </Link>
        </h3>

        {variant === "default" ? (
          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted">
            {article.excerpt}
          </p>
        ) : null}

        <div className="mt-auto pt-5 border-t border-border/60 flex items-center justify-between text-xs text-muted">
          <span>{formatDate(article.publishedAt)}</span>
          <span className="font-semibold text-green group-hover:underline">
            Read Article &rarr;
          </span>
        </div>
      </div>
    </article>
  );
}
