"use client";

import { useEffect, useMemo, useState } from "react";
import { NamesExplorerModal } from "@/components/islamic/NamesExplorerModal";
import { useSpiritualDaily } from "@/components/home/SpiritualDailyProvider";
import type { LiveDailyWord } from "@/lib/spiritual-api";
import { Sparkles } from "lucide-react";

export function WordOfTheDayCard() {
  const { word, names, loading } = useSpiritualDaily();
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [currentWord, setCurrentWord] = useState<LiveDailyWord>(word);

  useEffect(() => {
    setCurrentWord(word);
  }, [word]);

  const namePool = useMemo(
    () => (names.length > 0 ? names : [currentWord]),
    [names, currentWord]
  );

  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleNextWord = () => {
    const currentIndex = namePool.findIndex((item) => item.number === currentWord.number);
    const nextIdx = (currentIndex + 1) % namePool.length;
    setCurrentWord(namePool[nextIdx]);
  };

  return (
    <>
      <article className="relative flex h-full min-h-[28rem] flex-col overflow-hidden rounded-[26px] border border-[#eee5d5] bg-[#fdfbf7] p-5 shadow-spiritual transition-all duration-300 hover:border-sand/40 sm:p-6">
        <div
          className="pointer-events-none absolute -right-2 top-10 z-0 font-serif text-[7rem] leading-none text-sand/10 select-none"
          aria-hidden
        >
          ”
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <header className="shrink-0 text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8a6b32]">
                Word of the Day
              </span>
              {currentWord.isLive ? (
                <span className="rounded-full bg-sand/15 px-2 py-0.5 text-[9px] font-bold text-sand">
                  API
                </span>
              ) : null}
            </div>
            <div className="mt-1 text-[11px] font-medium text-muted">
              {currentDateFormatted}
            </div>
          </header>

          <div className="mt-4 flex min-h-0 flex-1 flex-col items-center text-center">
            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-sand/15 px-2 text-[11px] font-bold text-sand">
              {String(currentWord.number).padStart(2, "0")}
            </span>

            <div className="mt-3 flex min-h-[5.5rem] items-center justify-center overflow-hidden px-1">
              <span
                lang="ar"
                dir="rtl"
                className="inline-block font-arabic text-[2.15rem] font-bold leading-[2] tracking-normal text-[#064234] sm:text-[2.6rem] lg:text-[2.35rem] xl:text-[2.7rem]"
              >
                {loading ? "…" : currentWord.arabic}
              </span>
            </div>

            <h4 className="mt-3 font-serif text-sm font-bold uppercase tracking-[0.18em] text-foreground sm:text-base">
              {currentWord.transliteration}
            </h4>

            <div className="mt-2 inline-block max-w-full rounded-full border border-[#e4d4ba] bg-[#fcf6eb] px-3.5 py-0.5 text-xs font-semibold text-[#a87428]">
              <span className="line-clamp-1">{currentWord.meaning}</span>
            </div>

            <div className="my-4 h-px w-12 bg-[#e0d6c5]" />

            <p className="line-clamp-4 max-w-[240px] text-xs font-medium leading-relaxed text-foreground/80">
              {currentWord.explanation}
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-5 flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setExplorerOpen(true)}
            className="flex-1 rounded-full border border-[#d6c7b0] bg-white py-3 text-center text-xs font-bold tracking-wider text-foreground shadow-xs transition-all duration-200 hover:border-green hover:bg-green hover:text-white"
          >
            Explore 99 Names
          </button>
          <button
            type="button"
            onClick={handleNextWord}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d6c7b0] bg-white text-foreground/70 shadow-xs transition-colors hover:border-green hover:bg-cream hover:text-green"
            title="Next Word"
            aria-label="Next Word"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </article>

      <NamesExplorerModal
        open={explorerOpen}
        onOpenChange={setExplorerOpen}
        names={names}
      />
    </>
  );
}
