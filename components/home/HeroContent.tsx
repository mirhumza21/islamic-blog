"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Compass } from "lucide-react";
import { HeroReveal } from "@/components/home/HeroReveal";
import { heroContent } from "@/data/navigation";
import { HeroAyatSlider } from "@/components/home/HeroAyatSlider";

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
    <div className="relative z-10 flex w-full max-w-[38rem] flex-col lg:max-w-[42rem]">
      {/* 1. Main Editorial Headline: Exactly 3 Lines matching reference */}
      <HeroReveal delay={0.04}>
        <h1
          id="hero-heading"
          className="font-serif pb-2 text-[clamp(3.45rem,6.5vw,5.85rem)] font-bold leading-[1.02] tracking-[-0.018em]"
        >
          <span className="block w-fit text-[#141d1a]">
            {titleLines[0] || "Guidance for"}
          </span>
          <span className="block w-fit text-[#141d1a]">
            {titleLines[1] || "Every Step of"}
          </span>
          <span className="inline-block w-fit text-[#063b2f]">
            {accentLead ? `${accentLead} ` : null}
            <span className="relative inline-block">
              {journeyWord}
              {/* Gold brush underline sits just under Journey */}
              <svg
                viewBox="0 0 180 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="pointer-events-none absolute top-[1.1em] left-0 w-full overflow-visible text-[#c59a53]"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M2 8C38 3 92 2 178 9"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <path
                  d="M14 12C55 6 110 6 168 12"
                  stroke="#b8894a"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.65"
                />
              </svg>
            </span>
          </span>
        </h1>
      </HeroReveal>

      {/* 2–3. Description + CTAs share the button-row width */}
      <HeroReveal delay={0.1} className="mt-6 flex w-full flex-col self-start sm:mt-7 sm:w-fit sm:max-w-full">
        <p className="w-full text-lg leading-[1.55] text-muted sm:w-0 sm:min-w-full">
          {data.description ||
            "Inspiring blogs, practical guides and authentic knowledge to help you prepare for Umrah and grow closer to Allah."}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3.5 sm:mt-7 sm:flex-nowrap sm:gap-4">
          <Link
            href={data.primaryCta?.href || "/blog"}
            className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#063b2f] px-6 sm:px-7 text-[14px] font-semibold text-white shadow-[0_2px_12px_rgba(6,59,47,0.25)] transition-[background-color,box-shadow] duration-200 hover:bg-[#042d24] hover:shadow-[0_4px_16px_rgba(6,59,47,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#063b2f]"
          >
            <BookOpen className="h-4 w-4 text-white/90" strokeWidth={1.8} />
            <span>{data.primaryCta?.label || "Explore Latest Articles"}</span>
            <ArrowRight className="h-4 w-4 text-white/90" strokeWidth={1.8} />
          </Link>

          <Link
            href={data.secondaryCta?.href || "/category/umrah-guides"}
            className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-full border border-[#c59a53]/60 bg-white/70 px-6 sm:px-7 text-[14px] font-semibold text-[#141d1a] shadow-2xs backdrop-blur-xs transition-[background-color,border-color,color] duration-200 hover:border-[#063b2f] hover:bg-white hover:text-[#063b2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#063b2f]"
          >
            <Compass className="h-4 w-4 text-[#c59a53] transition-colors duration-200 group-hover:text-[#063b2f]" strokeWidth={1.8} />
            <span>{data.secondaryCta?.label || "Browse Umrah Guides"}</span>
            <ArrowRight className="h-4 w-4 text-[#c59a53] transition-colors duration-200 group-hover:text-[#063b2f]" strokeWidth={1.8} />
          </Link>
        </div>
      </HeroReveal>

      {/* Mobile-only Ayat Slider */}
      <div className="mt-6 block lg:hidden">
        <HeroAyatSlider verses={data.verses} />
      </div>
    </div>
  );
}
