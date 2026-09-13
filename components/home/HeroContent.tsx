"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroReveal } from "@/components/home/HeroReveal";
import { HeroTrustItems } from "@/components/home/HeroTrustItems";
import { heroContent } from "@/data/navigation";

export function HeroContent() {
  return (
    <div className="relative z-10 w-full max-w-[34rem]">
      <HeroReveal delay={0.05}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sand sm:text-xs">
          {heroContent.eyebrow}
        </p>
      </HeroReveal>

      <HeroReveal delay={0.12}>
        <h1
          id="hero-heading"
          className="mt-4 font-serif text-[clamp(2.65rem,7.5vw,3.5rem)] font-semibold leading-[1.03] tracking-tight text-foreground lg:text-[clamp(3.25rem,4.2vw,4.5rem)] lg:leading-[1.02]"
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
        <p className="mt-5 max-w-[30rem] text-[1.05rem] leading-[1.7] text-muted sm:text-lg">
          {heroContent.description}
        </p>
      </HeroReveal>

      <HeroReveal delay={0.28}>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={heroContent.primaryCta.href}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-green px-7 text-[15px] font-medium text-white transition-colors hover:bg-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            {heroContent.primaryCta.label}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link
            href={heroContent.secondaryCta.href}
            className="inline-flex h-12 items-center justify-center rounded-full border border-border/80 bg-ivory/80 px-7 text-[15px] font-medium text-foreground backdrop-blur-sm transition-colors hover:border-green/35 hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            {heroContent.secondaryCta.label}
          </Link>
        </div>
      </HeroReveal>

      <HeroReveal delay={0.38} className="mt-10 lg:mt-12">
        <HeroTrustItems />
      </HeroReveal>
    </div>
  );
}
