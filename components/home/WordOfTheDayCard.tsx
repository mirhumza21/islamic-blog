"use client";

import { useEffect, useState } from "react";
import { namesOfAllah } from "@/data/islamic-data";
import { fetchLiveWordOfTheDay, LiveDailyWord } from "@/lib/spiritual-api";
import { NamesExplorerModal } from "@/components/islamic/NamesExplorerModal";
import { Sparkles } from "lucide-react";

export function WordOfTheDayCard() {
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [word, setWord] = useState<LiveDailyWord>({
    number: namesOfAllah[0].number,
    arabic: namesOfAllah[0].arabic,
    transliteration: namesOfAllah[0].transliteration,
    meaning: namesOfAllah[0].meaning,
    explanation: namesOfAllah[0].explanation,
    isLive: false,
  });
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    fetchLiveWordOfTheDay().then((liveWord) => {
      setWord(liveWord);
    });
  }, []);

  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleNextWord = () => {
    const nextIdx = (wordIdx + 1) % namesOfAllah.length;
    setWordIdx(nextIdx);
    const item = namesOfAllah[nextIdx];
    setWord({
      number: item.number,
      arabic: item.arabic,
      transliteration: item.transliteration,
      meaning: item.meaning,
      explanation: item.explanation,
      isLive: false,
    });
  };

  return (
    <>
      <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[26px] border border-[#eee5d5] bg-[#fdfbf7] p-6 shadow-spiritual transition-all duration-300 hover:border-sand/40 lg:p-7">
        <div
          className="pointer-events-none absolute right-4 bottom-14 font-serif text-8xl font-bold text-sand/10 select-none"
          aria-hidden
        >
          ”
        </div>

        <div>
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="w-full text-center">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8a6b32]">
                  WORD OF THE DAY
                </span>
                {word.isLive ? (
                  <span className="rounded-full bg-sand/15 px-2 py-0.2 text-[9px] font-bold text-sand">
                    API
                  </span>
                ) : null}
              </div>
              <div className="mt-1 text-[11px] font-medium text-muted">
                {currentDateFormatted}
              </div>
            </div>
          </div>

          {/* Large Calligraphy */}
          <div className="my-5 flex flex-col items-center justify-center text-center">
            <span className="font-arabic text-5xl font-bold tracking-tight text-[#064234] sm:text-6xl min-h-[70px] flex items-center">
              {word.arabic}
            </span>

            <h4 className="mt-3 font-serif text-base font-bold tracking-[0.22em] uppercase text-foreground">
              {word.transliteration}
            </h4>

            <div className="mt-2 inline-block rounded-full border border-[#e4d4ba] bg-[#fcf6eb] px-3.5 py-0.5 text-xs font-semibold text-[#a87428]">
              {word.meaning}
            </div>

            <div className="my-4 h-px w-12 bg-[#e0d6c5]" />

            <p className="max-w-[260px] text-xs leading-relaxed text-foreground/80 font-medium text-center">
              {word.explanation}
            </p>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="mt-6 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setExplorerOpen(true)}
            className="flex-1 rounded-full border border-[#d6c7b0] bg-white py-3 text-center text-xs font-bold tracking-wider text-foreground transition-all duration-200 hover:border-green hover:bg-green hover:text-white shadow-xs"
          >
            Explore 99 Names
          </button>
          <button
            type="button"
            onClick={handleNextWord}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d6c7b0] bg-white text-foreground/70 transition-colors hover:border-green hover:bg-cream hover:text-green shadow-xs"
            title="Next Word"
            aria-label="Next Word"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </div>

      <NamesExplorerModal
        open={explorerOpen}
        onOpenChange={setExplorerOpen}
      />
    </>
  );
}
