"use client";

import { HeroContent } from "@/components/home/HeroContent";
import { HeroMedia } from "@/components/home/HeroMedia";
import { HeroFloatingDock } from "@/components/home/HeroFloatingDock";
import { HeroAyatSlider } from "@/components/home/HeroAyatSlider";

export function Hero({ content }: { content?: any }) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full overflow-hidden bg-ivory h-[calc(100dvh-80px)] min-h-[580px]"
    >
      {/* Background Sacred Photography Slider */}
      <div className="absolute inset-0">
        <HeroMedia content={content} />

        {/* Soft elegant ivory blend on the left matching the reference editorial layout */}
        <div
          className="pointer-events-none absolute inset-0 hidden lg:block"
          aria-hidden
        >
          {/* Seamless gradient blend: solid ivory behind text, smoothly feathering into photo without any sharp line */}
          <div className="absolute inset-y-0 left-0 w-[54%] bg-gradient-to-r from-ivory from-60% via-ivory/80 via-78% to-transparent" />
          <div className="absolute inset-y-0 left-0 w-[44%] pattern-geometric-cream opacity-25 [mask-image:linear-gradient(to_right,black_70%,transparent)]" />
        </div>
      </div>

      {/* Hero Layout: Occupies 100% of the first viewport with compact, balanced vertical rhythm */}
      {/* pb-7 sm:pb-8 lg:pb-9 lifts the bottom category bar up with elegant floating breathing room */}
      <div className="relative z-20 flex h-full flex-col justify-between pt-4 sm:pt-6 lg:pt-8 pb-7 sm:pb-8 lg:pb-9 pointer-events-none">
        {/* Main Content Area: Left Editorial copy + Center-Right Floating Frosted Glass Ayat Slider */}
        <div className="container-editorial flex flex-1 items-center justify-between gap-6 lg:gap-10">
          {/* Left Column: Exactly 3-Line Headline with gold underline + CTAs */}
          <div className="pointer-events-auto w-full max-w-[40rem] lg:w-[52%] xl:w-[50%]">
            <HeroContent content={content} />
          </div>

          {/* Center-Right Floating Frosted Glass Ayat Slider (Centered in the open landmark space) */}
          <div className="pointer-events-auto hidden lg:flex lg:flex-1 lg:max-w-[490px] xl:max-w-[520px] lg:justify-center">
            <HeroAyatSlider verses={content?.verses} />
          </div>
        </div>

        {/* Floating Category Dock at the bottom of the first view (Lifted higher up) */}
        <div className="container-editorial pointer-events-auto">
          <HeroFloatingDock content={content} />
        </div>
      </div>
    </section>
  );
}
