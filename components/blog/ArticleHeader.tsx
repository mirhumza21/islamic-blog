"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  Calendar,
  Check,
  Clock,
  Link2,
  RotateCcw,
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
  category?: Category;
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

  const description =
    article.bannerDescription?.trim() || article.excerpt?.trim() || "";

  const categoryName = category?.name || "Islamic Knowledge";
  const categoryHref = category?.slug ? `/category/${category.slug}` : "/blog";

  return (
    <header className="w-full">
      <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[28px] border border-[#eee7da] bg-[#faf6ef] p-5 sm:p-7 lg:p-9 shadow-[0_4px_24px_-8px_rgba(6,59,47,0.06)]">
        {/* Subtle decorative background watermark */}
        <div
          className="pointer-events-none absolute inset-0 pattern-geometric-cream opacity-25"
          aria-hidden
        />

        <div className="relative z-10 flex flex-col gap-6 sm:gap-8">
          {/* Top Section: Left (Category, Title, Excerpt) & Right (Featured Image) */}
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-10">
            {/* Left Column: Category badge, Title, Excerpt */}
            <div className="space-y-3.5 sm:space-y-4 lg:col-span-7">
              {/* Category Pill */}
              <div>
                <Link
                  href={categoryHref}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#063b2f] px-3.5 py-1 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#084e3f]"
                >
                  <BookOpen className="h-3.5 w-3.5 text-[#d4af72]" />
                  <span>{categoryName}</span>
                </Link>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl font-bold leading-[1.18] tracking-tight text-[#141d1a] sm:text-3xl md:text-4xl lg:text-[2.65rem]">
                {article.title}
              </h1>

              {/* Excerpt / Description */}
              {description ? (
                <p className="max-w-2xl text-sm leading-relaxed text-[#57534e] sm:text-base md:leading-relaxed">
                  {description}
                </p>
              ) : null}
            </div>

            {/* Right Column: Featured Image */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-[#e8dfd2] bg-[#f0ebe1] shadow-xs">
                <Image
                  src={article.coverImage || article.image}
                  alt={article.coverImageAlt || article.imageAlt || article.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 550px"
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Bottom Bar: Author info & Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#ede4d5] pt-4 sm:pt-5">
            {/* Left: Author Avatar, Name, Date, Read Time, Updated */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#57534e] sm:gap-3">
              <div className="flex items-center gap-2.5">
                <Image
                  src={author.avatar || FALLBACK_AVATAR}
                  alt={author.name}
                  width={40}
                  height={40}
                  className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-full object-cover border border-[#e5ddd0]"
                />
                <span className="font-semibold text-[#141d1a] text-xs sm:text-sm">
                  {author.name}
                </span>
              </div>

              <span className="text-[#d8d0c2] hidden sm:inline" aria-hidden>|</span>

              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                <Calendar className="h-3.5 w-3.5 text-[#736b5e]" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>

              <span className="text-[#d8d0c2] hidden sm:inline" aria-hidden>|</span>

              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                <Clock className="h-3.5 w-3.5 text-[#736b5e]" />
                <span>{article.readingTime} min read</span>
              </div>

              {article.updatedAt && (
                <>
                  <span className="text-[#d8d0c2] hidden md:inline" aria-hidden>|</span>
                  <div className="hidden md:flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <RotateCcw className="h-3.5 w-3.5 text-[#736b5e]" />
                    <span>Updated: {formatDate(article.updatedAt)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Right: Actions (Copy Link, Share, Bookmark) */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? "Copied" : "Copy link"}
                className="inline-flex h-8 sm:h-9 items-center gap-1.5 rounded-full border border-[#e6dfd3] bg-white px-3 sm:px-3.5 text-xs font-semibold text-[#141d1a] shadow-2xs transition-colors hover:bg-gray-50"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#063b2f]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Link2 className="h-3.5 w-3.5 text-[#063b2f]" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                aria-label="Share"
                className="inline-flex h-8 sm:h-9 items-center gap-1.5 rounded-full border border-[#e6dfd3] bg-white px-3 sm:px-3.5 text-xs font-semibold text-[#141d1a] shadow-2xs transition-colors hover:bg-gray-50"
              >
                <Share2 className="h-3.5 w-3.5 text-[#063b2f]" />
                <span>Share</span>
              </button>

              <button
                type="button"
                onClick={() => setBookmarked(!bookmarked)}
                className={`inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[#e6dfd3] shadow-2xs transition-colors ${
                  bookmarked
                    ? "bg-[#063b2f] text-white border-[#063b2f]"
                    : "bg-white text-[#141d1a] hover:bg-gray-50"
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
      </div>
    </header>
  );
}
