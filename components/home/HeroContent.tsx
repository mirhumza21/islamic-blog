"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Compass } from "lucide-react";
import { HeroReveal } from "@/components/home/HeroReveal";
import { heroContent } from "@/data/navigation";
import { GoldUnderline } from "@/components/home/GoldUnderline";

export function HeroContent({ content }: { content?: typeof heroContent }) {
  const data = content || heroContent;
  const titleLines = data.titleLines?.length
    ? data.titleLines
    : heroContent.titleLines;
  const accent = data.titleAccent || heroContent.titleAccent;
  const accentParts = accent.trim().split(/\s+/);
  const journeyWord = accentParts.pop() || accent;
  const accentLead = accentParts.join(" ");

  return (
    <div className="relative z-10 flex w-full max-w-[44rem] flex-col">
      {/* 1. Main Editorial Headline: Exactly 3 Lines matching reference */}
      <HeroReveal delay={0.04}>
        <h1
          id="hero-heading"
          className="font-serif pb-1 text-[clamp(2.2rem,5.6vw,3.35rem)] lg:text-[clamp(2.85rem,4.6vw,4.95rem)] font-bold leading-[1.05] tracking-[-0.02em]"
        >
          <span className="block w-fit text-[#141d1a] sm:whitespace-nowrap">
            {titleLines[0] || "Guidance for"}
          </span>
          <span className="block w-fit text-[#141d1a] sm:whitespace-nowrap">
            {titleLines[1] || "Every Step of"}
          </span>
          <span className="inline-block w-fit text-[#063b2f] sm:whitespace-nowrap">
            {accentLead ? `${accentLead} ` : null}
            <span className="relative inline-block">
              {journeyWord}
              <GoldUnderline className="top-[1.08em]" />
            </span>
          </span>
        </h1>
      </HeroReveal>

      {/* 2–3. Description + CTAs */}
      <HeroReveal delay={0.1} className="mt-4 flex w-full max-w-[35rem] flex-col self-start sm:mt-5">
        <p className="w-full text-[15px] leading-[1.58] text-[#3f4d47] sm:text-[16.5px] lg:text-muted">
          {data.description ||
            "Inspiring blogs, practical guides and authentic knowledge to help you prepare for Umrah and grow closer to Allah."}
        </p>
        <div className="mt-4 flex flex-col items-stretch gap-2.5 sm:mt-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5">
          <Link
            href={data.primaryCta?.href || "/blog"}
            className="group inline-flex h-11 sm:h-12 items-center justify-center gap-2.5 rounded-full bg-[#063b2f] px-5 sm:px-6 text-[13.5px] sm:text-[14px] font-semibold text-white shadow-[0_2px_12px_rgba(6,59,47,0.25)] transition-[background-color,box-shadow] duration-200 hover:bg-[#042d24] hover:shadow-[0_4px_16px_rgba(6,59,47,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#063b2f]"
          >
            <BookOpen className="h-4 w-4 text-white/90" strokeWidth={1.8} />
            <span>{data.primaryCta?.label || "Explore Latest Articles"}</span>
            <ArrowRight className="h-4 w-4 text-white/90" strokeWidth={1.8} />
          </Link>

          <Link
            href={data.secondaryCta?.href || "/category/umrah-guides"}
            className="group inline-flex h-11 sm:h-12 items-center justify-center gap-2.5 rounded-full border border-[#c59a53]/65 bg-white/92 px-5 sm:px-6 text-[13.5px] sm:text-[14px] font-semibold text-[#141d1a] shadow-2xs backdrop-blur-xs transition-[background-color,border-color,color] duration-200 hover:border-[#063b2f] hover:bg-white hover:text-[#063b2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#063b2f]"
          >
            <Compass className="h-4 w-4 text-[#c59a53] transition-colors duration-200 group-hover:text-[#063b2f]" strokeWidth={1.8} />
            <span>{data.secondaryCta?.label || "Browse Umrah Guides"}</span>
            <ArrowRight className="h-4 w-4 text-[#c59a53] transition-colors duration-200 group-hover:text-[#063b2f]" strokeWidth={1.8} />
          </Link>
        </div>
      </HeroReveal>
    </div>
  );
}
