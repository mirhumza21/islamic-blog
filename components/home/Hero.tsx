import { HeroContent } from "@/components/home/HeroContent";
import { HeroMedia } from "@/components/home/HeroMedia";
import { HeroQuote } from "@/components/home/HeroQuote";
import { HeroReveal } from "@/components/home/HeroReveal";
import { HeroTrustItems } from "@/components/home/HeroTrustItems";
import { heroContent } from "@/data/navigation";

/**
 * Desktop: full-bleed photo + soft cream→photo dissolve.
 * Content aligns with header via container-editorial.
 * Mobile order: copy → CTAs → image → quote → trust.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-[42%] pattern-geometric-cream opacity-[0.35] lg:block"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <HeroMedia variant="background" />
        <div className="absolute inset-0 hero-gradient-desktop" aria-hidden />
      </div>

      <div className="container-editorial relative z-10">
        <div className="flex flex-col lg:min-h-[min(720px,calc(100svh-5rem))] lg:justify-center xl:min-h-[min(740px,calc(100svh-5rem))]">
          <div className="grid lg:grid-cols-12 lg:items-center lg:gap-6">
            <div className="py-10 sm:py-12 lg:col-span-5 lg:py-10 xl:col-span-5">
              <HeroContent />
            </div>

            <div className="relative z-20 hidden lg:col-span-7 lg:block lg:h-[min(520px,54svh)] xl:h-[min(540px,52svh)]">
              <div className="absolute right-0 top-0 xl:right-2 xl:top-1">
                <HeroQuote className="relative z-20" />
              </div>
              <p
                className="font-script absolute bottom-4 right-0 z-10 max-w-[180px] text-right text-[1.35rem] leading-[1.2] text-white/85 xl:right-2 xl:bottom-5 xl:text-[1.5rem]"
                aria-hidden
              >
                {heroContent.decorativeTagline.map((line) => (
                  <span
                    key={line}
                    className="block [text-shadow:0_1px_12px_rgba(0,0,0,0.4)]"
                  >
                    {line}
                  </span>
                ))}
                <span className="mt-2.5 ml-auto block h-px w-11 bg-sand/75" />
              </p>
            </div>
          </div>

          <div className="mt-2 hidden items-center gap-3 text-muted/70 lg:flex">
            <span className="inline-flex h-7 w-[18px] items-center justify-center rounded-full border border-border/70 bg-ivory/50">
              <span className="h-1.5 w-1 rounded-full bg-muted/55" />
            </span>
            <span className="h-px w-7 bg-border" />
            <span className="text-[11px] font-medium tracking-[0.04em]">
              Scroll to explore
            </span>
          </div>

          <HeroReveal
            delay={0.38}
            className="hidden border-t border-border/50 py-7 lg:block xl:py-8"
          >
            <HeroTrustItems />
          </HeroReveal>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="relative h-[340px] w-full sm:h-[380px]">
          <HeroMedia variant="panel" />
          <p
            className="font-script absolute bottom-5 right-4 z-10 max-w-[170px] text-right text-[1.35rem] leading-[1.15] text-white/90 sm:bottom-6 sm:right-5 sm:text-[1.45rem]"
            aria-hidden
          >
            {heroContent.decorativeTagline.map((line) => (
              <span
                key={line}
                className="block [text-shadow:0_1px_10px_rgba(0,0,0,0.35)]"
              >
                {line}
              </span>
            ))}
            <span className="mt-2 ml-auto block h-px w-11 bg-sand/80" />
          </p>
        </div>

        <div className="container-editorial relative z-10 -mt-8 pb-10 sm:pb-12">
          <HeroQuote className="mx-auto shadow-[0_16px_40px_-20px_rgba(23,32,30,0.4)]" />
          <HeroReveal delay={0.15} className="mt-8 sm:mt-10">
            <HeroTrustItems />
          </HeroReveal>
        </div>
      </div>
    </section>
  );
}
