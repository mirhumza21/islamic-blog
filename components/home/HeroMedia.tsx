"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { heroContent } from "@/data/navigation";
import { cn } from "@/lib/utils";

const SLIDE_MS = 7000;

type HeroSlide = {
  src: string;
  alt: string;
  caption?: string;
  objectPosition?: string;
};

function resolveSlides(content?: typeof heroContent): HeroSlide[] {
  const data = content || heroContent;
  const fromCms = Array.isArray(data.slides) ? data.slides : [];
  if (fromCms.length > 0) return fromCms;

  const cover = data.image || heroContent.image;
  const rest = heroContent.slides.filter((slide) => slide.src !== cover.src);
  return [cover, ...rest];
}

export function HeroMedia({ content }: { content?: typeof heroContent }) {
  const slides = useMemo(() => resolveSlides(content), [content]);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const pointerStart = useRef<number | null>(null);

  const goTo = useCallback(
    (next: number) => {
      const total = slides.length;
      setIndex(((next % total) + total) % total);
    },
    [slides.length]
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setAnimate(!media.matches);
  }, []);

  useEffect(() => {
    if (!animate || slides.length < 2) return;

    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, SLIDE_MS);

    return () => window.clearTimeout(timer);
  }, [animate, index, slides.length]);

  const active = slides[index] || slides[0];
  if (!active) return null;

  return (
    <figure
      className="absolute inset-0 h-full w-full select-none overflow-hidden bg-[#042e24]"
      aria-roledescription="carousel"
      aria-label="Sacred Islamic landmarks slider"
      onPointerDown={(event) => {
        pointerStart.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (pointerStart.current == null) return;
        const delta = event.clientX - pointerStart.current;
        pointerStart.current = null;
        if (Math.abs(delta) < 48) return;
        goTo(index + (delta < 0 ? 1 : -1));
      }}
    >
      {slides.map((slide, slideIndex) => {
        const isActive = slideIndex === index;
        return (
          <div
            key={slide.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              isActive ? "opacity-100" : "opacity-0"
            )}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={slideIndex === 0}
              quality={90}
              sizes="100vw"
              className={cn("object-cover", isActive && animate && "hero-kenburns")}
              style={{ objectPosition: slide.objectPosition || "68% 48%" }}
            />
          </div>
        );
      })}

      {/* Subtle overlay for depth */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent lg:from-black/40"
        aria-hidden
      />

      {/* Elegant English Calligraphy Branding on Top Right */}
      <div
        className="pointer-events-none absolute right-5 top-5 z-20 hidden select-none text-right md:block lg:right-10 lg:top-7"
        aria-hidden
      >
        <div className="font-script text-[28px] leading-[1.08] text-white/95 drop-shadow-[0_3px_10px_rgba(0,0,0,0.55)] sm:text-[34px] lg:text-[42px]">
          <span className="block">Better</span>
          <span className="block">Knowledge</span>
          <span className="block">Closer to</span>
          <span className="block">Allah</span>
        </div>
        <svg
          className="ml-auto mt-1 h-3 w-20 text-[#d4af72] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
          viewBox="0 0 100 16"
          fill="none"
        >
          <path
            d="M 5 12 Q 45 2 95 9"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Slide Landmark Caption */}
      {active.caption ? (
        <div className="pointer-events-none absolute bottom-32 right-4 z-20 hidden text-right sm:block lg:bottom-36 lg:right-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            {active.caption}
          </p>
        </div>
      ) : null}

      {/* Vertical Carousel Indicators on the Right Side of the Image */}
      {slides.length > 1 ? (
        <div
          className="absolute right-3.5 top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-2.5 rounded-full border border-white/20 bg-black/40 px-2 py-3 backdrop-blur-md shadow-2xl sm:right-6 lg:right-7"
          role="tablist"
          aria-label="Sacred landmark carousel slides"
        >
          {slides.map((slide, slideIndex) => {
            const isActive = slideIndex === index;
            return (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Slide ${slideIndex + 1}: ${slide.caption || slide.alt}`}
                onClick={(event) => {
                  event.stopPropagation();
                  goTo(slideIndex);
                }}
                className={cn(
                  "rounded-full transition-[height,background-color] duration-300",
                  isActive
                    ? "h-7 w-2 bg-[#d4af72] shadow-[0_0_10px_rgba(212,175,114,0.7)]"
                    : "h-2 w-2 bg-white/50 hover:bg-white"
                )}
              />
            );
          })}
        </div>
      ) : null}

      {/* Slider Progress Bar (runs at the bottom of the hero) */}
      {slides.length > 1 ? (
        <div className="absolute inset-x-0 bottom-0 z-30 h-[3px] bg-black/25">
          <div
            key={`${index}-${animate ? "on" : "off"}`}
            className={cn("h-full bg-[#d4af72]", animate && "hero-progress-bar")}
          />
        </div>
      ) : null}
    </figure>
  );
}
