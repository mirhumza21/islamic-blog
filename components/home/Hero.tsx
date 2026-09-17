import { HeroContent } from "@/components/home/HeroContent";
import { HeroMedia } from "@/components/home/HeroMedia";
import { HeroQuote } from "@/components/home/HeroQuote";
import { HeroReveal } from "@/components/home/HeroReveal";
import { HeroTrustItems } from "@/components/home/HeroTrustItems";
export function Hero({ content }: { content?: any }) {
  return (
    <>
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden border-b border-border bg-ivory"
      >
        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
          <HeroMedia variant="background" content={content} />
          <div className="absolute inset-0 hero-gradient-desktop" />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-[42%] pattern-geometric-cream opacity-25 lg:block"
          aria-hidden
        />

        <div className="container-editorial relative z-10">
          <div className="grid lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-14 xl:py-16">
            <div className="py-10 sm:py-12 lg:col-span-5 lg:py-0">
              <HeroContent content={content} />

              <div className="mt-10 hidden items-center gap-2.5 text-muted/70 lg:flex">
                <span className="inline-flex h-7 w-[18px] items-center justify-center rounded-full border border-border bg-card">
                  <span className="h-1.5 w-1 rounded-full bg-muted/50" />
                </span>
                <span className="h-px w-6 bg-border" />
                <span className="text-[11px] font-medium tracking-[0.05em]">
                  Scroll to explore
                </span>
              </div>
            </div>

            <div className="relative hidden lg:col-span-7 lg:block lg:min-h-[480px]">
              <div className="absolute right-0 top-6 z-20 xl:right-2 xl:top-8">
                <HeroQuote content={content} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          <div className="relative h-[280px] w-full sm:h-[320px]">
            <HeroMedia variant="panel" content={content} />
          </div>

          <div className="container-editorial py-6 sm:py-8">
            <HeroQuote className="mx-auto" content={content} />
          </div>
        </div>
      </section>

      <section
        aria-label="Why UmrahZone"
        className="border-b border-border bg-cream/50"
      >
        <div className="container-editorial py-8 lg:py-10">
          <HeroReveal delay={0.15}>
            <HeroTrustItems content={content} />
          </HeroReveal>
        </div>
      </section>
    </>
  );
}
