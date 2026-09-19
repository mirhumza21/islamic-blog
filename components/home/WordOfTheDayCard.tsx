"use client";

import { useEffect, useMemo, useState } from "react";
import { NamesExplorerModal } from "@/components/islamic/NamesExplorerModal";
import { useSpiritualDaily } from "@/components/home/SpiritualDailyProvider";
import type { LiveDailyWord } from "@/lib/spiritual-api";
import { defaultDailySpiritual } from "@/data/daily-spiritual";
import { Sparkles } from "lucide-react";

export function WordOfTheDayCard({
  label = defaultDailySpiritual.wordLabel,
  exploreLabel = defaultDailySpiritual.exploreNamesLabel,
}: {
  label?: string;
  exploreLabel?: string;
}) {
  const { word, names, loading } = useSpiritualDaily();
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [currentWord, setCurrentWord] = useState<LiveDailyWord>(word);
  const [dateLabel, setDateLabel] = useState("");

  useEffect(() => {
    setCurrentWord(word);
  }, [word]);

  useEffect(() => {
    setDateLabel(
      new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);

  const namePool = useMemo(
    () => (names.length > 0 ? names : [currentWord]),
    [names, currentWord]
  );

  const handleNextWord = () => {
    const currentIndex = namePool.findIndex((item) => item.number === currentWord.number);
    const nextIdx = (currentIndex + 1) % namePool.length;
    setCurrentWord(namePool[nextIdx]);
  };

  return (
    <>
      <article className="relative flex h-full w-full flex-col overflow-hidden rounded-[26px] border border-[#eee5d5] bg-[#fdfbf7] p-5 shadow-spiritual sm:p-6 lg:p-7">
        <div className="flex flex-1 flex-col">
          <header className="shrink-0 text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
              {label}
            </span>
            {dateLabel ? (
              <p className="mt-1.5 font-serif text-[13px] text-muted">{dateLabel}</p>
            ) : (
              <div className="mt-1.5 h-[19px]" />
            )}
          </header>

          <div className="mt-4 flex flex-1 flex-col items-center justify-center text-center">
            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-sand/15 px-2 font-serif text-[12px] font-bold text-sand">
              {String(currentWord.number).padStart(2, "0")}
            </span>

            <div className="mt-3 flex items-center justify-center overflow-hidden px-1 py-1">
              <span
                lang="ar"
                dir="rtl"
                className="inline-block font-arabic text-[1.85rem] font-bold leading-[1.5] text-[#063b2f] sm:text-[2.15rem]"
              >
                {loading ? "…" : currentWord.arabic}
              </span>
            </div>

            <h4 className="mt-3 font-serif text-base font-semibold tracking-[0.12em] text-foreground sm:text-lg">
              {currentWord.transliteration}
            </h4>

            <p className="mt-2.5 inline-block max-w-full rounded-full border border-[#e4d4ba] bg-[#fcf6eb] px-3.5 py-1 font-serif text-sm text-[#a87428]">
              <span className="line-clamp-1">{currentWord.meaning}</span>
            </p>

            <div className="my-4 h-px w-12 bg-[#e0d6c5]" />

            <p className="line-clamp-2 max-w-[240px] font-serif text-sm leading-relaxed text-foreground/75">
              {currentWord.explanation}
            </p>
          </div>
        </div>

        <div className="mt-5 flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            onClick={() => setExplorerOpen(true)}
            className="flex-1 rounded-full border border-[#d6c7b0] bg-white py-2.5 text-center text-xs font-semibold tracking-wide text-foreground shadow-xs transition-all duration-200 hover:border-green hover:bg-green hover:text-white"
          >
            {exploreLabel}
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
