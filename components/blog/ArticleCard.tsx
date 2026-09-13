"use client";

import Link from "next/link";
import Image from "next/image";
import { Bookmark } from "lucide-react";
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
  if (variant === "horizontal") {
    return (
      <article className="group flex gap-4">
        <Link
          href={`/blog/${article.slug}`}
          className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl"
        >
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        </Link>
        <div className="min-w-0">
          {category ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-green">
              {category.name}
            </p>
          ) : null}
          <h3 className="mt-1 font-serif text-lg leading-snug text-foreground">
            <Link
              href={`/blog/${article.slug}`}
              className="transition-colors hover:text-green"
            >
              {article.title}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-muted">
            {formatDate(article.publishedAt)} · {article.readingTime} min
          </p>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-200 hover:border-green/30",
        variant === "compact" && "rounded-xl"
      )}
    >
      <Link
        href={`/blog/${article.slug}`}
        className="relative block aspect-[16/10] w-full overflow-hidden"
      >
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          {category ? <Badge>{category.name}</Badge> : <span />}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-cream hover:text-green"
            aria-label={`Bookmark ${article.title}`}
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
        <h3 className="mt-3 font-serif text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-[1.35rem]">
          <Link
            href={`/blog/${article.slug}`}
            className="transition-colors hover:text-green"
          >
            {article.title}
          </Link>
        </h3>
        {variant === "default" ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
            {article.excerpt}
          </p>
        ) : null}
        <p className="mt-auto pt-4 text-xs text-muted">
          {formatDate(article.publishedAt)} · {article.readingTime} min read
        </p>
      </div>
    </article>
  );
}
