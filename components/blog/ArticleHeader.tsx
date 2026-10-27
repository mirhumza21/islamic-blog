"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Bookmark,
  Check,
  Clock,
  Link2,
  Share2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Article, Author } from "@/types/blog";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80";

export function ArticleHeader({
  article,
  author,
}: {
  article: Article;
  author: Author;
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

  const description = article.bannerDescription?.trim() || "";
  const showDescription = Boolean(description) && description !== article.title;

  return (
    <header className="w-full">
      <div className="relative flex min-h-[20rem] w-full flex-col justify-end overflow-hidden rounded-[24px] border border-[#e6dfd3] bg-cream shadow-[0_12px_40px_-16px_rgba(6,59,47,0.18)] sm:min-h-[24rem] lg:min-h-[28rem] lg:rounded-[28px]">
        <Image
          src={article.coverImage || article.image}
          alt={article.coverImageAlt || article.imageAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1400px) 90vw, 1360px"
          className="object-cover object-[center_32%]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
        <div className="relative z-10 flex flex-col px-5 py-6 sm:px-8 sm:py-7 lg:px-10 lg:py-8">
          <div className="max-w-3xl">
            <h1 className="font-serif text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[2.75rem] xl:text-[3.15rem]">
              {article.title}
            </h1>
            {showDescription ? (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:mt-3.5 sm:text-base">
                {description}
              </p>
            ) : null}
          </div>
        <div className="mt-4 flex items-center justify-between gap-2 sm:mt-5 sm:gap-4">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <Image
              src={author.avatar || FALLBACK_AVATAR}
              alt={author.name}
              width={44}
              height={44}
              className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white/80 sm:h-11 sm:w-11"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {author.name}
                {author.role ? (
                  <span className="ml-2 hidden font-medium text-white/80 sm:inline">
                    · {author.role}
                  </span>
                ) : null}
              </p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-white/80 sm:text-xs">
                <span>{formatDate(article.publishedAt)}</span>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.readingTime} min read
                </span>
                {article.updatedAt ? (
                  <span className="hidden md:inline">
                    · Updated {formatDate(article.updatedAt)}
                  </span>
                ) : null}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy link"}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/40 bg-white/90 px-2.5 text-xs font-semibold text-[#141d1a] shadow-sm transition-colors hover:bg-white sm:px-3.5"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green" />
                  <span className="hidden sm:inline">Copied</span>
                </>
              ) : (
                <>
                  <Link2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Copy link</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleNativeShare}
              aria-label="Share"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/40 bg-white/90 px-2.5 text-xs font-semibold text-[#141d1a] shadow-sm transition-colors hover:bg-white sm:px-3.5"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              type="button"
              onClick={() => setBookmarked(!bookmarked)}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition-colors ${
                bookmarked
                  ? "border-[#063b2f] bg-[#063b2f] text-white"
                  : "border-white/40 bg-white/90 text-[#141d1a] hover:bg-white"
              }`}
              aria-label={bookmarked ? "Bookmarked" : "Bookmark article"}
            >
              <Bookmark className="h-3.5 w-3.5" fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
        </div>
      </div>
    </header>
  );
}
