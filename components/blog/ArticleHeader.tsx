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

  const categoryName = category?.name || article.categorySlug?.replace(/-/g, " ") || "Islamic Lifestyle";
  const categoryHref = category?.slug
    ? `/category/${category.slug}`
    : article.categorySlug
    ? `/category/${article.categorySlug}`
    : "/blog";

  const displayImage = article.coverImage || article.image;

  return (
    <header className="relative w-full flex items-center justify-center pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20 min-h-[460px] sm:min-h-[520px] md:min-h-[580px] overflow-hidden">
      {/* Background Full-bleed Cover Image with Cinematic Scale */}
      {displayImage ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={displayImage}
            alt={article.coverImageAlt || article.imageAlt || article.title}
            fill
            sizes="100vw"
            className="object-cover object-center transition-transform duration-[40s] scale-105"
            priority
          />
          {/* Cinematic Editorial Overlays matching hajj-ummrah */}
          {/* Layer 1: Dark cinematic overlay */}
          <div className="absolute inset-0 bg-black/45 z-10 mix-blend-multiply" />

          {/* Layer 2: Warm luxury tint */}
          <div className="absolute inset-0 bg-[#0e0e0e]/20 z-10" />

          {/* Layer 3: Soft bottom fade for smooth transition to ivory content */}
          <div className="absolute bottom-0 left-0 right-0 h-44 sm:h-56 bg-gradient-to-t from-[#faf8f5] via-[#faf8f5]/60 to-transparent z-10" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-[#0c1a17]" />
      )}

      {/* Very Soft Radial Gold Lighting */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none opacity-40 z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(197,157,95,0.15) 0%, rgba(246,241,232,0) 70%)",
        }}
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none opacity-30 z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(197,157,95,0.12) 0%, rgba(246,241,232,0) 70%)",
        }}
        aria-hidden
      />

      {/* Floating Hero Card */}
      <div className="relative z-20 px-4 sm:px-6 max-w-4xl mx-auto w-full mt-4 sm:mt-6 flex flex-col items-center">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 sm:mb-5 flex flex-wrap items-center justify-center gap-1.5 text-xs text-white/80 drop-shadow-sm font-sans"
        >
          <Link
            href="/"
            className="transition-colors hover:text-white hover:underline"
          >
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-white/50" />
          <Link
            href="/blog"
            className="transition-colors hover:text-white hover:underline"
          >
            Blogs
          </Link>
          <ChevronRight className="h-3 w-3 text-white/50" />
          <Link
            href={categoryHref}
            className="font-medium text-[#e4c28d] capitalize transition-colors hover:text-white hover:underline"
          >
            {categoryName}
          </Link>
        </nav>

        {/* Glassmorphic Container matching hajj-ummrah */}
        <div className="bg-black/35 backdrop-blur-md border border-white/15 px-5 sm:px-8 md:px-12 py-6 sm:py-8 md:py-10 rounded-2xl shadow-2xl text-center w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

          {/* Category Pill with Flanking Gold Lines */}
          <div className="inline-flex items-center justify-center gap-3 mb-5 sm:mb-6 relative z-10">
            <div className="w-8 sm:w-10 h-px bg-[#c5a059]/70" />
            <Link
              href={categoryHref}
              className="font-serif text-[#d4af72] hover:text-[#f3dfbe] font-bold tracking-[0.35em] text-[11px] sm:text-xs uppercase transition-colors"
            >
              {categoryName}
            </Link>
            <div className="w-8 sm:w-10 h-px bg-[#c5a059]/70" />
          </div>

          {/* Title */}
          <h1 className="relative z-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-white mb-5 sm:mb-6 leading-tight tracking-tight drop-shadow-md max-w-3xl mx-auto">
            {article.title}
          </h1>

          {/* Description / Excerpt */}
          {description ? (
            <p className="relative z-10 text-white/85 text-sm sm:text-base font-light font-sans max-w-2xl mx-auto mb-6 leading-relaxed">
              {description}
            </p>
          ) : null}

          {/* Metadata Row: Date, Author with Avatar, Reading Time, Updated */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-white/90 text-xs sm:text-sm font-light font-sans">
            <div className="flex items-center gap-2">
              <Image
                src={author.avatar || FALLBACK_AVATAR}
                alt={author.name}
                width={24}
                height={24}
                className="h-6 w-6 rounded-full object-cover border border-white/30"
              />
              <span className="font-normal text-white">By {author.name}</span>
            </div>

            <span className="text-[#c5a059]/60 hidden sm:inline">|</span>

            <div className="flex items-center gap-1.5 text-white/85">
              <Calendar className="h-3.5 w-3.5 text-[#c5a059]" />
              <time>{formatDate(article.publishedAt)}</time>
            </div>

            {article.readingTime && (
              <>
                <span className="text-[#c5a059]/60 hidden sm:inline">|</span>
                <div className="flex items-center gap-1.5 text-white/85">
                  <Clock className="h-3.5 w-3.5 text-[#c5a059]" />
                  <span>{article.readingTime} min read</span>
                </div>
              </>
            )}

            {article.updatedAt && (
              <>
                <span className="text-[#c5a059]/60 hidden sm:inline">|</span>
                <div className="flex items-center gap-1.5 text-white/75">
                  <RotateCcw className="h-3.5 w-3.5 text-[#c5a059]" />
                  <span>Updated: {formatDate(article.updatedAt)}</span>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons: Copy Link, Share, Bookmark */}
          <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy link"}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-white/20 hover:border-white/40 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#d4af72]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Link2 className="h-3.5 w-3.5 text-[#d4af72]" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNativeShare}
              aria-label="Share"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-white/20 hover:border-white/40 active:scale-95"
            >
              <Share2 className="h-3.5 w-3.5 text-[#d4af72]" />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={() => setBookmarked(!bookmarked)}
              className={`inline-flex items-center justify-center h-8 w-8 rounded-full border transition-all active:scale-95 ${
                bookmarked
                  ? "bg-[#d4af72] text-[#0e0e0e] border-[#d4af72]"
                  : "border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/40"
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
    </header>
  );
}
