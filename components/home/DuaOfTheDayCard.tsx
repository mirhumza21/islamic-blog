"use client";

import { useEffect, useMemo, useState } from "react";
import { DuasExplorerModal } from "@/components/islamic/DuasExplorerModal";
import { useSpiritualDaily } from "@/components/home/SpiritualDailyProvider";
import type { LiveDailyDua } from "@/lib/spiritual-api";
import { Sparkles, Volume2 } from "lucide-react";

export function DuaOfTheDayCard() {
  const { dua, duas, loading } = useSpiritualDaily();
  const [currentDua, setCurrentDua] = useState<LiveDailyDua>(dua);
  const [isPlaying, setIsPlaying] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(false);

  useEffect(() => {
    setCurrentDua(dua);
  }, [dua]);

  const duaPool = useMemo(() => (duas.length > 0 ? duas : [currentDua]), [duas, currentDua]);

  const handlePlayAudio = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(currentDua.arabic);
    utterance.lang = "ar-SA";
    utterance.rate = 0.85;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleNextDua = () => {
    const currentIndex = duaPool.findIndex((item) => item.id === currentDua.id);
    const nextIdx = (currentIndex + 1) % duaPool.length;
    setCurrentDua(duaPool[nextIdx]);
  };

  return (
    <>
      <article className="relative flex h-full min-h-[28rem] flex-col overflow-hidden rounded-[26px] border border-border/80 bg-card p-5 shadow-spiritual transition-all duration-300 hover:border-green/30 sm:p-6">
        <header className="flex shrink-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/80">
                Dua of the Day
              </span>
              {currentDua.isLive ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green/10 px-2 py-0.5 text-[9px] font-bold text-green">
                  <span className="h-1.5 w-1.5 rounded-full bg-green animate-pulse" />
                  LIVE
                </span>
              ) : null}
            </div>
            <div className="mt-2">
              <span className="inline-block rounded-md bg-[#fbf4e8] px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-[#b87c32]">
                {currentDua.category}
              </span>
            </div>
            <h3 className="mt-2 line-clamp-2 font-serif text-base font-semibold leading-snug text-foreground">
              {loading ? "Loading today’s dua…" : currentDua.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={handlePlayAudio}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
              isPlaying
                ? "bg-green text-white ring-4 ring-green/20"
                : "bg-cream text-foreground/70 shadow-xs hover:bg-green hover:text-white"
            }`}
            title="Listen to Arabic recitation"
            aria-label="Listen to Dua recitation"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </header>

        <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4">
          <div className="flex min-h-[6.5rem] items-center justify-center rounded-2xl bg-ivory/70 px-3 py-3">
            <p
              dir="rtl"
              lang="ar"
              className="arabic-verse line-clamp-4 text-center font-arabic text-[1.35rem] font-bold text-foreground sm:text-[1.5rem]"
            >
              {currentDua.arabic}
            </p>
          </div>

          <div className="shrink-0 rounded-2xl border border-[#eee4d3] bg-[#faf6ef] px-4 py-3.5 text-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#b8782a]">
              {currentDua.reference}
            </div>
            {currentDua.transliteration ? (
              <p className="mt-1.5 line-clamp-2 text-xs italic leading-relaxed text-foreground/70">
                {currentDua.transliteration}
              </p>
            ) : null}
            <p className="mt-2 line-clamp-4 text-xs font-medium leading-relaxed text-foreground/90">
              “{currentDua.translation}”
            </p>
          </div>
        </div>

        <div className="mt-5 flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setExplorerOpen(true)}
            className="flex-1 rounded-full border border-border/80 bg-ivory py-3 text-center text-xs font-bold uppercase tracking-wider text-foreground shadow-xs transition-all duration-200 hover:border-green hover:bg-green hover:text-white"
          >
            View All Duas
          </button>
          <button
            type="button"
            onClick={handleNextDua}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/80 bg-ivory text-foreground/70 shadow-xs transition-colors hover:border-green hover:bg-cream hover:text-green"
            title="Next Dua"
            aria-label="Next Dua"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </article>

      <DuasExplorerModal
        open={explorerOpen}
        onOpenChange={setExplorerOpen}
        duas={duas}
      />
    </>
  );
}
