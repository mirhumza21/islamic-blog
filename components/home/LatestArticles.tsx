"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArticleGrid } from "@/components/blog/ArticleGrid";
import { SidebarSearch } from "@/components/home/SidebarSearch";
import { formatDate } from "@/lib/utils";
import { defaultLatestSection } from "@/data/home-sections";
import type { Article, Category } from "@/types/blog";
import {
  ArrowRight,
  Bookmark,
  Clock,
  Flame,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export function LatestArticles({
  articles,
  popular,
  categories,
  content,
}: {
  articles: Article[];
  popular: Article[];
  categories: Category[];
  content?: Partial<typeof defaultLatestSection>;
}) {
  const copy = { ...defaultLatestSection, ...content };
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredArticles =
    selectedCategory === "all"
      ? articles
      : articles.filter((a) => a.categorySlug === selectedCategory);

  const heroArticle = filteredArticles[0];
  const remainingArticles = filteredArticles.slice(1, 3);

  return (
    <section className="container-editorial py-12 lg:py-16">
      {/* Header & Filter Row */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-green/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-green">
            <Sparkles className="h-3 w-3" />
            {copy.eyebrow}
          </div>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {copy.title}
          </h2>
        </div>

        <Link
          href={copy.viewAllHref || "/blog"}
          className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-green transition-colors hover:text-green-dark"
        >
          <span>{copy.viewAllLabel}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Category Quick Filter Pills */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
            selectedCategory === "all"
              ? "bg-green text-white shadow-xs"
              : "border border-border/80 bg-card text-foreground/75 hover:bg-cream"
          }`}
        >
          {copy.allTopicsLabel}
        </button>
        {categories.slice(0, 5).map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.slug)}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedCategory === cat.slug
                ? "bg-green text-white shadow-xs"
                : "border border-border/80 bg-card text-foreground/75 hover:bg-cream"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Grid & Sidebar Layout */}
      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        {/* Left: Articles Stream (8 cols) */}
        <div className="space-y-8 lg:col-span-8">
          {/* Top Magazine Lead Card */}
          {heroArticle ? (
            <article className="group overflow-hidden rounded-[24px] border border-border/80 bg-card shadow-xs transition-colors duration-200 hover:border-green/40 sm:grid sm:grid-cols-12 sm:items-stretch">
              <div className="relative aspect-[16/10] overflow-hidden sm:col-span-6 sm:aspect-auto sm:rounded-l-[24px] isolate">
                <Image
                  src={heroArticle.image}
                  alt={heroArticle.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-col justify-between p-6 sm:col-span-6 sm:p-7">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span className="rounded-full bg-cream px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-green">
                      {categories.find((c) => c.slug === heroArticle.categorySlug)?.name ?? "Guide"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-sand" />
                      {heroArticle.readingTime} min read
                    </span>
                  </div>

                  <h3 className="mt-3 font-serif text-xl font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-green sm:text-2xl">
                    <Link href={`/blog/${heroArticle.slug}`}>
                      {heroArticle.title}
                    </Link>
                  </h3>

                  <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-muted">
                    {heroArticle.excerpt}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted">
                  <span>{formatDate(heroArticle.publishedAt)}</span>
                  <Link
                    href={`/blog/${heroArticle.slug}`}
                    className="inline-flex items-center gap-1 font-semibold text-green hover:underline"
                  >
                    Read Guide &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ) : null}

          {/* Remaining Articles Grid (2 Cards) */}
          <ArticleGrid articles={remainingArticles} categories={categories} columns={2} />
        </div>

        {/* Right: Premium Editorial Sidebar (4 cols) */}
        <aside className="space-y-6 lg:col-span-4">
          <SidebarSearch />

          {/* Trending Ranked Articles */}
          <div className="rounded-[24px] border border-border/80 bg-card p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3.5 text-xs font-bold uppercase tracking-wider text-green">
              <TrendingUp className="h-4 w-4" />
              <span>Trending Reads</span>
            </div>

            <ol className="mt-5 space-y-4">
              {popular.map((item, index) => (
                <li key={item.id} className="group flex items-start gap-3.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sand/15 font-serif text-sm font-bold text-sand transition-colors group-hover:bg-green group-hover:text-white">
                    0{index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-serif text-[15px] font-bold leading-snug text-foreground transition-colors group-hover:text-green line-clamp-2">
                      <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                    </h4>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted">
                      <span>{item.readingTime} min read</span>
                      <span>&bull;</span>
                      <span className="text-sand">{categories.find((c) => c.slug === item.categorySlug)?.name}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Spiritual Reflection Banner */}
          <div className="overflow-hidden rounded-[24px] border border-[#ecdcc3] bg-gradient-to-br from-[#faf6ef] to-[#f5ede0] p-6 shadow-xs">
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[#b87c32]">
              <Sparkles className="h-3.5 w-3.5" />
              Spiritual Reminder
            </div>
            <blockquote className="mt-3 font-serif text-base italic leading-relaxed text-foreground">
              &ldquo;Take benefit of five before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before you are preoccupied, and your life before your death.&rdquo;
            </blockquote>
            <div className="mt-3 text-right text-xs font-semibold text-[#8a6b32]">
              — Al-Hakim: 7831
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
