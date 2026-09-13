import { HeroContent } from "@/components/home/HeroContent";
import { HeroMedia } from "@/components/home/HeroMedia";
import { HeroQuote } from "@/components/home/HeroQuote";
import { heroContent } from "@/data/navigation";

/**
 * Desktop: full-bleed photo + soft left gradient.
 * Content uses the same container-editorial as the header for alignment.
 * Mobile: content first, then image band.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      {/* Desktop immersive background */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <HeroMedia variant="background" />
        <div className="absolute inset-0 hero-gradient-desktop" aria-hidden />
      </div>

      <div className="container-editorial relative z-10">
        <div className="grid lg:min-h-[720px] lg:grid-cols-12 lg:items-center xl:min-h-[min(800px,calc(100dvh-5rem))]">
          <div className="py-12 sm:py-14 lg:col-span-6 lg:py-16 xl:col-span-5">
            <HeroContent />
          </div>

          {/* Desktop quote / accent sit in the image area, still inside container */}
          <div className="relative hidden lg:col-span-6 lg:block xl:col-span-7">
            <div className="absolute right-0 top-10 xl:top-14">
              <HeroQuote />
            </div>
            <p
              className="font-script absolute bottom-16 right-0 max-w-[230px] text-right text-[1.85rem] leading-[1.15] text-white xl:bottom-20 xl:text-[2rem]"
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
              <span className="mt-2 ml-auto block h-px w-14 bg-sand" />
            </p>
          </div>
        </div>
      </div>

      {/* Mobile / tablet image */}
      <div className="relative h-[380px] w-full sm:h-[420px] lg:hidden">
        <HeroMedia variant="panel" />
        <div className="absolute right-4 top-4 z-10 w-[min(calc(100%-2rem),270px)]">
          <HeroQuote />
        </div>
        <p
          className="font-script absolute bottom-6 right-5 z-10 max-w-[190px] text-right text-[1.5rem] leading-[1.15] text-white"
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
          <span className="mt-2 ml-auto block h-px w-12 bg-sand" />
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-0 z-20 hidden w-full lg:block">
        <div className="container-editorial flex items-center gap-3 text-muted">
          <span className="inline-flex h-8 w-5 items-center justify-center rounded-full border border-border/80 bg-ivory/40">
            <span className="h-1.5 w-1 rounded-full bg-muted/70" />
          </span>
          <span className="h-px w-8 bg-border" />
          <span className="text-[11px] font-medium tracking-wide">
            Scroll to explore
          </span>
        </div>
      </div>
    </section>
  );
}
