"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArticleGrid } from "@/components/blog/ArticleGrid";
import { SidebarSearch } from "@/components/home/SidebarSearch";
import { SectionHeader } from "@/components/home/SectionHeader";
import { formatDate } from "@/lib/utils";
import { defaultLatestSection } from "@/data/home-sections";
import type { Article, Category } from "@/types/blog";
import { ArrowRight, Clock, Sparkles, TrendingUp } from "lucide-react";

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
    <section className="relative overflow-hidden bg-ivory">
      <div
        className="pointer-events-none absolute inset-0 pattern-geometric-cream opacity-45"
        aria-hidden
      />
      <div className="container-editorial relative py-12 lg:py-16">
        <SectionHeader
          eyebrow={copy.eyebrow}
          title={copy.title}
          icon={<Sparkles className="h-3 w-3" />}
          tone="green"
        />

        <div className="mb-8 flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === "all"
                  ? "bg-[#063b2f] text-white shadow-xs"
                  : "border border-[#e6dfd3] bg-white/80 text-foreground/75 hover:bg-cream"
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
                    ? "bg-[#063b2f] text-white shadow-xs"
                    : "border border-[#e6dfd3] bg-white/80 text-foreground/75 hover:bg-cream"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <Link
            href={copy.viewAllHref || "/blog"}
            className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-[#c59a53]/60 bg-white/70 px-5 text-[13px] font-semibold text-[#141d1a] shadow-2xs backdrop-blur-xs transition-[background-color,border-color,color] duration-200 hover:border-[#063b2f] hover:bg-white hover:text-[#063b2f]"
          >
            <span>{copy.viewAllLabel}</span>
            <ArrowRight
              className="h-3.5 w-3.5 text-[#c59a53] transition-colors duration-200 group-hover:text-[#063b2f]"
              strokeWidth={1.8}
            />
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            {!heroArticle ? (
              <p className="rounded-[26px] border border-[#e6dfd3] bg-white/80 px-6 py-10 text-center text-sm text-muted">
                No articles in this topic yet.
              </p>
            ) : null}
            {heroArticle ? (
              <article className="group overflow-hidden rounded-[26px] border border-[#e6dfd3] bg-white/80 shadow-[0_8px_28px_-16px_rgba(6,59,47,0.14)] transition-colors duration-200 hover:border-[#c59a53]/50 sm:grid sm:grid-cols-12 sm:items-stretch">
                <div className="relative aspect-[16/10] overflow-hidden sm:col-span-6 sm:aspect-auto sm:rounded-l-[26px] isolate">
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
                      <span className="rounded-full bg-sand/15 px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-sand">
                        {categories.find((c) => c.slug === heroArticle.categorySlug)?.name ?? "Guide"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-sand" />
                        {heroArticle.readingTime} min read
                      </span>
                    </div>

                    <h3 className="mt-3 font-serif text-xl font-bold leading-snug tracking-tight text-[#141d1a] transition-colors group-hover:text-[#063b2f] sm:text-2xl">
                      <Link href={`/blog/${heroArticle.slug}`}>
                        {heroArticle.title}
                      </Link>
                    </h3>

                    <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-muted">
                      {heroArticle.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-[#e6dfd3] pt-4 text-xs text-muted">
                    <span>{formatDate(heroArticle.publishedAt)}</span>
                    <Link
                      href={`/blog/${heroArticle.slug}`}
                      className="inline-flex items-center gap-1 font-semibold text-[#063b2f] hover:underline"
                    >
                      Read Guide
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ) : null}

            <ArticleGrid articles={remainingArticles} categories={categories} columns={2} />
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <SidebarSearch />

            <div className="rounded-[26px] border border-[#e6dfd3] bg-white/80 p-6 shadow-[0_8px_28px_-16px_rgba(6,59,47,0.14)]">
              <div className="flex items-center gap-2 border-b border-[#e6dfd3] pb-3.5 text-xs font-bold uppercase tracking-wider text-[#063b2f]">
                <TrendingUp className="h-4 w-4 text-[#c59a53]" />
                <span>Trending Reads</span>
              </div>

              <ol className="mt-5 space-y-4">
                {popular.map((item, index) => (
                  <li key={item.id} className="group flex items-start gap-3.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand/15 font-serif text-sm font-bold text-sand transition-colors group-hover:bg-[#063b2f] group-hover:text-white">
                      0{index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif text-[15px] font-bold leading-snug text-[#141d1a] transition-colors group-hover:text-[#063b2f] line-clamp-2">
                        <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                      </h4>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-muted">
                        <span>{item.readingTime} min read</span>
                        <span>&bull;</span>
                        <span className="text-sand">
                          {categories.find((c) => c.slug === item.categorySlug)?.name}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="overflow-hidden rounded-[26px] border border-[#ecdcc3] bg-gradient-to-br from-[#faf6ef] to-[#f5ede0] p-6 shadow-[0_8px_28px_-16px_rgba(6,59,47,0.1)]">
              <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[#b87c32]">
                <Sparkles className="h-3.5 w-3.5" />
                Spiritual Reminder
              </div>
              <blockquote className="mt-3 font-serif text-base italic leading-relaxed text-[#141d1a]">
                &ldquo;Take benefit of five before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before you are preoccupied, and your life before your death.&rdquo;
              </blockquote>
              <div className="mt-3 text-right text-xs font-semibold text-[#8a6b32]">
                — Al-Hakim: 7831
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
