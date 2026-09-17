"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Home,
  Link2,
  Share2,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Article, Author, Category } from "@/types/blog";

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
        // User dismissed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <header className="relative mx-auto w-full max-w-5xl">
      {/* Centered Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex justify-center text-xs text-muted">
        <ol className="inline-flex flex-wrap items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 py-1.5 shadow-xs backdrop-blur-xs">
          <li>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-muted transition-colors hover:text-green"
            >
              <Home className="h-3 w-3" />
              <span>Home</span>
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="h-3 w-3 text-border" />
          </li>
          <li>
            <Link
              href="/blog"
              className="text-muted transition-colors hover:text-green"
            >
              Blog
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="h-3 w-3 text-border" />
          </li>
          <li>
            <Link
              href={`/category/${category.slug}`}
              className="font-semibold text-green transition-colors hover:text-green-dark"
            >
              {category.name}
            </Link>
          </li>
        </ol>
      </nav>

      {/* Centered Editorial Title & Meta Area */}
      <div className="mt-7 text-center">
        {/* Category & Read Time Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <Link
            href={`/category/${category.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-sand/40 bg-cream/90 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-sand transition-colors hover:bg-cream hover:text-green shadow-xs"
          >
            <Sparkles className="h-3 w-3 text-sand" />
            {category.name}
          </Link>
          <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card px-3 py-1 text-xs font-semibold text-muted shadow-xs">
            <Clock className="h-3 w-3 text-sand" />
            {article.readingTime} min read
          </span>
          {article.updatedAt ? (
            <span className="rounded-full border border-border/60 bg-card px-3 py-1 text-xs text-muted shadow-xs">
              Updated {formatDate(article.updatedAt)}
            </span>
          ) : null}
        </div>

        {/* Master Headline */}
        <h1 className="mx-auto mt-6 max-w-4xl font-serif text-3xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[3.5rem] text-balance">
          {article.title}
        </h1>

        {/* Subtitle / Excerpt */}
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg lg:text-[1.2rem] lg:leading-relaxed text-balance">
          {article.excerpt}
        </p>

        {/* Unified Author & Reader Action Bar */}
        <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center justify-between gap-4 rounded-[22px] border border-border/80 bg-card/90 p-3.5 shadow-xs sm:flex-row sm:px-5">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <Image
                src={author.avatar}
                alt={author.name}
                width={46}
                height={46}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-sand/30"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-green text-[9px] font-bold text-white shadow-xs">
                ✓
              </span>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">
                  {author.name}
                </span>
                <span className="rounded-md bg-sand/15 px-2 py-0.5 text-[10.5px] font-semibold text-sand">
                  {author.role}
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted/70" />
                  {formatDate(article.publishedAt)}
                </span>
                <span>&bull;</span>
                <span>Verified Sunnah Guide</span>
              </div>
            </div>
          </div>

          {/* Quick Reader Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-ivory px-3.5 py-1.5 text-xs font-semibold text-foreground/80 shadow-xs transition-colors hover:border-green hover:bg-cream hover:text-green"
              title="Copy article link"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green" />
                  <span className="text-green font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="h-3.5 w-3.5 text-sand" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNativeShare}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-ivory px-3.5 py-1.5 text-xs font-semibold text-foreground/80 shadow-xs transition-colors hover:border-green hover:bg-cream hover:text-green"
              title="Share article"
            >
              <Share2 className="h-3.5 w-3.5 text-sand" />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={() => setBookmarked(!bookmarked)}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/80 shadow-xs transition-colors ${
                bookmarked
                  ? "border-green bg-green text-white"
                  : "bg-ivory text-foreground/80 hover:border-green hover:bg-cream hover:text-green"
              }`}
              aria-label={bookmarked ? "Bookmarked" : "Bookmark article"}
            >
              <Bookmark
                className="h-3.5 w-3.5"
                fill={bookmarked ? "currentColor" : "none"}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Featured Image with Contained Frame */}
      <div className="relative mx-auto mt-10 aspect-[16/9] w-full max-w-5xl overflow-hidden rounded-[26px] border border-border/80 bg-cream sm:aspect-[21/10] lg:rounded-[32px] shadow-spiritual [clip-path:inset(0)] [transform:translateZ(0)]">
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-6 hidden rounded-full bg-black/40 px-4 py-1.5 text-xs text-white/95 backdrop-blur-xs sm:block">
          Sacred Knowledge &bull; UmrahZone Verified Editorial
        </div>
      </div>
    </header>
  );
}
