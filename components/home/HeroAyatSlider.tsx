"use client";

import { useEffect, useState, useRef } from "react";
import { heroContent } from "@/data/navigation";
import { cn } from "@/lib/utils";

type Verse = {
  arabic: string;
  text: string;
  reference: string;
  id?: number | string;
};

export function HeroAyatSlider({
  verses,
  className = "",
}: {
  verses?: Verse[];
  className?: string;
}) {
  const resolvedVerses =
    Array.isArray(verses) && verses.length > 0 ? verses : heroContent.verses;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeVerse = resolvedVerses[currentIndex] || resolvedVerses[0];

  const changeSlide = (newIndex: number) => {
    if (newIndex === currentIndex || isTransitioning || resolvedVerses.length < 2) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((newIndex + resolvedVerses.length) % resolvedVerses.length);
      setIsTransitioning(false);
    }, 220);
  };

  useEffect(() => {
    if (currentIndex >= resolvedVerses.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, resolvedVerses.length]);

  useEffect(() => {
    if (isPaused || resolvedVerses.length < 2) return;

    timerRef.current = setInterval(() => {
      changeSlide((currentIndex + 1) % resolvedVerses.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, resolvedVerses.length]);

  if (!activeVerse) return null;

  return (
    <aside
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        "relative w-full max-w-[500px] overflow-hidden rounded-2xl sm:rounded-3xl border border-white/35 bg-white/12 p-6 sm:p-7 shadow-[0_12px_36px_0_rgba(0,0,0,0.18)] backdrop-blur-md text-white transition-all duration-300",
        className
      )}
      role="region"
      aria-roledescription="carousel"
      aria-label="Inspirational Quranic Verses Slider"
    >
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div
          className={cn(
            "min-w-0 flex-1 transition-all duration-200 ease-out",
            isTransitioning ? "opacity-0 translate-y-1.5" : "opacity-100 translate-y-0"
          )}
        >
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic text-[1.45rem] sm:text-[1.75rem] font-semibold leading-[1.8] text-white text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]"
          >
            {activeVerse.arabic}
          </p>

          <blockquote className="mt-3 text-center font-sans text-[13.5px] sm:text-[14.5px] font-normal leading-relaxed text-white/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)]">
            {activeVerse.text}
          </blockquote>

          <div className="mt-3.5 text-left">
            <span className="text-[11.5px] sm:text-[12px] font-medium tracking-wide text-white/85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
              {activeVerse.reference}
            </span>
          </div>
        </div>

        {resolvedVerses.length > 1 ? (
          <div
            className="flex flex-col items-center gap-2 pl-2 shrink-0 select-none"
            role="tablist"
            aria-label="Verse pagination"
          >
            {resolvedVerses.map((verse, i) => {
              const isActive = i === currentIndex;
              return (
                <button
                  key={verse.reference + i}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to ${verse.reference}`}
                  onClick={() => changeSlide(i)}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    isActive
                      ? "h-2.5 w-2.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] scale-110"
                      : "h-2 w-2 bg-white/40 hover:bg-white/80"
                  )}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
