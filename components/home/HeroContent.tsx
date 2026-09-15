"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { HeroReveal } from "@/components/home/HeroReveal";
import { heroContent } from "@/data/navigation";

export function HeroContent() {
  return (
    <div className="relative z-10 w-full max-w-[36rem] lg:max-w-[38rem]">
      <HeroReveal delay={0.05}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sand/90 sm:text-xs">
          {heroContent.eyebrow}
        </p>
      </HeroReveal>

      <HeroReveal delay={0.12}>
        <h1
          id="hero-heading"
          className="mt-3.5 font-serif text-[clamp(2.75rem,8vw,3.15rem)] font-semibold leading-[0.98] tracking-[-0.02em] text-foreground sm:mt-4 sm:text-[clamp(3rem,6vw,3.4rem)] lg:text-[clamp(3.15rem,4.8vw,4.5rem)] lg:leading-[0.97]"
        >
          {heroContent.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
          <span className="block text-sand">{heroContent.titleAccent}</span>
        </h1>
      </HeroReveal>

      <HeroReveal delay={0.2}>
        <p className="mt-4 max-w-[34rem] text-[1.0625rem] leading-[1.65] text-muted sm:mt-5 sm:text-[1.125rem] sm:leading-[1.6] lg:text-[1.125rem]">
          {heroContent.description}
        </p>
      </HeroReveal>

      <HeroReveal delay={0.28}>
        <div className="mt-6 flex w-full flex-col gap-3 sm:mt-7 sm:w-auto sm:flex-row sm:items-center">
          <Link
            href={heroContent.primaryCta.href}
            className="group inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-full bg-green px-6 text-[15px] font-medium text-white shadow-[0_1px_0_rgba(255,255,255,0.12)_inset] transition-all duration-200 hover:-translate-y-px hover:bg-green-dark hover:shadow-[0_10px_24px_-14px_rgba(7,88,70,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:w-auto sm:px-7"
          >
            {heroContent.primaryCta.label}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-[3px]" />
          </Link>
          <Link
            href={heroContent.secondaryCta.href}
            className="inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-full border border-border bg-ivory/70 px-6 text-[15px] font-medium text-foreground/85 transition-all duration-200 hover:border-green/40 hover:bg-cream/90 hover:text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:w-auto sm:px-7"
          >
            <BookOpen className="h-4 w-4 text-sand" strokeWidth={1.7} aria-hidden />
            {heroContent.secondaryCta.label}
          </Link>
        </div>
      </HeroReveal>
    </div>
  );
}
