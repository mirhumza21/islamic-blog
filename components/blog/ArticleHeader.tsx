"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  Check,
  ChevronRight,
  Clock,
  Link2,
  Share2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Article, Author, Category } from "@/types/blog";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80";

export function ArticleHeader({
  article,
  author,
  category,
}: {
  article: Article;
  author: Author;
  category: Category;
}) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch {
        // dismissed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <header className="w-full">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="transition-colors hover:text-green">
              Home
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="h-3.5 w-3.5 text-border" />
          </li>
          <li>
            <Link href="/blog" className="transition-colors hover:text-green">
              Blog
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="h-3.5 w-3.5 text-border" />
          </li>
          <li>
            <Link
              href={`/category/${category.slug}`}
              className="font-medium text-green hover:text-green-dark"
            >
              {category.name}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="mt-6 max-w-3xl lg:mt-8">
        <Link
          href={`/category/${category.slug}`}
          className="text-xs font-bold uppercase tracking-[0.16em] text-green transition-colors hover:text-green-dark"
        >
          {category.name}
        </Link>

        <h1 className="mt-3 font-serif text-3xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] xl:text-[3.15rem]">
          {article.title}
        </h1>

        {article.excerpt ? (
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            {article.excerpt}
          </p>
        ) : null}
      </div>

      <div className="mt-7 flex flex-col gap-4 border-y border-border/80 py-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={author.avatar || FALLBACK_AVATAR}
            alt={author.name}
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {author.name}
              {author.role ? (
                <span className="ml-2 font-medium text-muted">· {author.role}</span>
              ) : null}
            </p>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted">
              <span>{formatDate(article.publishedAt)}</span>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.readingTime} min read
              </span>
              {article.updatedAt ? (
                <>
                  <span aria-hidden>·</span>
                  <span>Updated {formatDate(article.updatedAt)}</span>
                </>
              ) : null}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-xs font-semibold text-foreground/80 transition-colors hover:border-green hover:text-green"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green" />
                Copied
              </>
            ) : (
              <>
                <Link2 className="h-3.5 w-3.5" />
                Copy link
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleNativeShare}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-xs font-semibold text-foreground/80 transition-colors hover:border-green hover:text-green"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
          <button
            type="button"
            onClick={() => setBookmarked(!bookmarked)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
              bookmarked
                ? "border-green bg-green text-white"
                : "border-border bg-card text-foreground/80 hover:border-green hover:text-green"
            }`}
            aria-label={bookmarked ? "Bookmarked" : "Bookmark article"}
          >
            <Bookmark className="h-3.5 w-3.5" fill={bookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-[24px] border border-border/80 bg-cream sm:mt-10 sm:aspect-[2/1] lg:rounded-[28px]">
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1400px) 90vw, 1360px"
          className="object-cover"
        />
      </div>
    </header>
  );
}
