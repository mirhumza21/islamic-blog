"use client";

import { HeroContent } from "@/components/home/HeroContent";
import { HeroMedia } from "@/components/home/HeroMedia";
import { HeroFloatingDock } from "@/components/home/HeroFloatingDock";
import { HeroAyatSlider } from "@/components/home/HeroAyatSlider";

export function Hero({ content }: { content?: any }) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full overflow-hidden bg-ivory lg:h-[calc(100dvh-80px)] lg:min-h-[600px] lg:max-h-[920px]"
    >
      {/* Background Sacred Photography Slider */}
      <div className="absolute inset-0">
        <HeroMedia content={content} />

        {/* Soft ivory backdrop on mobile/tablet so text and buttons stay crisp over the photo */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ivory/94 via-ivory/82 via-52% to-black/35 lg:hidden"
          aria-hidden
        />

        {/* Soft elegant ivory blend on the left matching the reference editorial layout */}
        <div
          className="pointer-events-none absolute inset-0 hidden lg:block"
          aria-hidden
        >
          {/* Seamless gradient blend: solid ivory behind text, smoothly feathering into photo without any sharp line */}
          <div className="absolute inset-y-0 left-0 w-[56%] bg-gradient-to-r from-ivory from-62% via-ivory/82 via-80% to-transparent" />
          <div className="absolute inset-y-0 left-0 w-[44%] pattern-geometric-cream opacity-25 [mask-image:linear-gradient(to_right,black_70%,transparent)]" />
        </div>
      </div>

      {/* Hero Layout: Occupies 100% of the first viewport on desktop with compact, balanced vertical rhythm */}
      <div className="relative z-20 flex h-full flex-col justify-between gap-4 pt-5 pb-4 sm:gap-5 sm:pt-6 sm:pb-5 lg:gap-4 lg:pt-6 lg:pb-5 pointer-events-none">
        {/* Main Content Area: Left Editorial copy + Center-Right Floating Frosted Glass Ayat Slider */}
        <div className="container-editorial flex flex-1 items-center justify-between gap-6 lg:gap-8">
          {/* Left Column: Exactly 3-Line Headline with gold underline + CTAs */}
          <div className="pointer-events-auto w-full max-w-[44rem] lg:w-[56%] xl:w-[54%]">
            <HeroContent content={content} />
          </div>

          {/* Center-Right Floating Frosted Glass Ayat Slider (Centered in the open landmark space) */}
          <div className="pointer-events-auto hidden lg:flex lg:flex-1 lg:max-w-[480px] xl:max-w-[510px] lg:justify-center">
            <HeroAyatSlider verses={content?.verses} />
          </div>
        </div>

        {/* Floating Category Dock at the bottom of the first view */}
        <div className="container-editorial pointer-events-auto">
          <HeroFloatingDock content={content} />
        </div>
      </div>
    </section>
  );
}
