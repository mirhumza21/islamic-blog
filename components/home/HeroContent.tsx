"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { HeroReveal } from "@/components/home/HeroReveal";
import { heroContent } from "@/data/navigation";

export function HeroContent({ content }: { content?: typeof heroContent }) {
  const data = content || heroContent;
  const titleLines = data.titleLines || heroContent.titleLines;

  return (
    <div className="relative z-10 w-full max-w-[36rem] lg:max-w-[38rem]">
      <HeroReveal delay={0.05}>
        <div className="inline-flex items-center gap-2 rounded-full border border-sand/30 bg-cream/80 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-sand shadow-xs backdrop-blur-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-sand" />
          {data.eyebrow}
        </div>
      </HeroReveal>

      <HeroReveal delay={0.12}>
        <h1
          id="hero-heading"
          className="mt-4 font-serif text-[clamp(2.75rem,8vw,3.25rem)] font-bold leading-[1.02] tracking-tight text-foreground sm:mt-5 sm:text-[clamp(3.1rem,6vw,3.6rem)] lg:text-[clamp(3.25rem,4.8vw,4.4rem)] lg:leading-[1]"
        >
          {titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
          <span className="block text-green-soft font-serif">{data.titleAccent}</span>
        </h1>
      </HeroReveal>

      <HeroReveal delay={0.2}>
        <p className="mt-4 max-w-[34rem] text-[1.05rem] leading-[1.65] text-muted sm:mt-5 sm:text-[1.125rem]">
          {data.description}
        </p>
      </HeroReveal>

      <HeroReveal delay={0.28}>
        <div className="mt-6 flex w-full flex-col gap-3 sm:mt-7 sm:w-auto sm:flex-row sm:items-center">
          <Link
            href={data.primaryCta?.href || "/blog"}
            className="group inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-full bg-green px-6 text-[14.5px] font-semibold text-white shadow-emerald-glow transition-all duration-200 hover:-translate-y-px hover:bg-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green sm:w-auto sm:px-7"
          >
            {data.primaryCta?.label || "Explore Latest Articles"}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-[3px]" />
          </Link>
          <Link
            href={data.secondaryCta?.href || "/category/umrah-guides"}
            className="inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-full border border-border bg-white/80 px-6 text-[14.5px] font-semibold text-foreground transition-all duration-200 hover:border-green hover:bg-cream hover:text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green sm:w-auto sm:px-7 shadow-xs"
          >
            <BookOpen className="h-4 w-4 text-sand" strokeWidth={1.7} aria-hidden />
            {data.secondaryCta?.label || "Browse Umrah Guides"}
          </Link>
        </div>
      </HeroReveal>

      {/* Quick Spiritual Jump Badges */}
      <HeroReveal delay={0.35}>
        <div className="mt-8 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="font-semibold text-foreground/80">Spiritual Hub:</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-white/70 px-2.5 py-1 font-medium text-green shadow-xs">
            🕌 Live Prayer Times
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-white/70 px-2.5 py-1 font-medium text-sand shadow-xs">
            🤲 Daily Dua
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-white/70 px-2.5 py-1 font-medium text-foreground/80 shadow-xs">
            📅 Hijri Calendar
          </span>
        </div>
      </HeroReveal>
    </div>
  );
}
