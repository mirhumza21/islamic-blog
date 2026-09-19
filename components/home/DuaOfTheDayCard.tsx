"use client";

import { useEffect, useMemo, useState } from "react";
import { DuasExplorerModal } from "@/components/islamic/DuasExplorerModal";
import { useSpiritualDaily } from "@/components/home/SpiritualDailyProvider";
import type { LiveDailyDua } from "@/lib/spiritual-api";
import { defaultDailySpiritual } from "@/data/daily-spiritual";
import { playSpiritualAudio, stopSpiritualAudio } from "@/lib/spiritual-audio";
import { Pause, Sparkles, Volume2 } from "lucide-react";

export function DuaOfTheDayCard({
  label = defaultDailySpiritual.duaLabel,
  viewAllLabel = defaultDailySpiritual.viewAllDuasLabel,
}: {
  label?: string;
  viewAllLabel?: string;
}) {
  const { dua, duas, loading } = useSpiritualDaily();
  const [currentDua, setCurrentDua] = useState<LiveDailyDua>(dua);
  const [isPlaying, setIsPlaying] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(false);

  useEffect(() => {
    setCurrentDua(dua);
  }, [dua]);

  useEffect(() => {
    return () => stopSpiritualAudio();
  }, []);

  const duaPool = useMemo(
    () => (duas.length > 0 ? duas : [currentDua]),
    [duas, currentDua]
  );

  const handlePlayAudio = () => {
    void playSpiritualAudio({
      id: currentDua.id,
      arabic: currentDua.arabic,
      transliteration: currentDua.transliteration,
      audioUrl: currentDua.audioUrl,
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
    });
  };

  const handleNextDua = () => {
    stopSpiritualAudio();
    setIsPlaying(false);
    const currentIndex = duaPool.findIndex((item) => item.id === currentDua.id);
    const nextIdx = (currentIndex + 1) % duaPool.length;
    setCurrentDua(duaPool[nextIdx]);
  };

  return (
    <>
      <article className="relative flex h-full w-full flex-col overflow-hidden rounded-[26px] border border-border/80 bg-card p-5 shadow-spiritual sm:p-6 lg:p-7">
        <header className="flex shrink-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
              {label}
            </span>
            <div className="mt-2">
              <span className="inline-block rounded-md bg-[#fbf4e8] px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-[#b87c32]">
                {currentDua.category}
              </span>
            </div>
            <h3 className="mt-2 line-clamp-2 font-serif text-lg font-semibold leading-snug text-foreground">
              {loading ? "Loading today’s dua…" : currentDua.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={handlePlayAudio}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
              isPlaying
                ? "bg-green text-white ring-4 ring-green/15"
                : "bg-cream text-foreground/70 shadow-xs hover:bg-green hover:text-white"
            }`}
            title={isPlaying ? "Stop recitation" : "Listen to recitation"}
            aria-label={isPlaying ? "Stop recitation" : "Listen to Dua recitation"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" fill="currentColor" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
        </header>

        <div className="mt-4 flex flex-1 flex-col gap-3">
          <div className="flex flex-1 items-center justify-center rounded-2xl bg-ivory/80 px-4 py-4">
            <p
              dir="rtl"
              lang="ar"
              className="arabic-verse line-clamp-3 text-center font-arabic text-[1.35rem] font-bold leading-[1.7] text-[#063b2f] sm:text-[1.55rem]"
            >
              {currentDua.arabic}
            </p>
          </div>

          <div className="shrink-0 rounded-2xl border border-[#eee4d3] bg-[#faf6ef] px-4 py-3.5 text-center">
            <p className="font-serif text-[11px] font-semibold uppercase tracking-[0.14em] text-[#b8782a]">
              {currentDua.reference}
            </p>
            {currentDua.transliteration ? (
              <p className="mt-1.5 line-clamp-2 font-serif text-[12.5px] italic leading-relaxed text-foreground/70">
                {currentDua.transliteration}
              </p>
            ) : null}
            <p className="mt-2 line-clamp-2 font-serif text-sm leading-relaxed text-foreground/90">
              “{currentDua.translation}”
            </p>
          </div>
        </div>

        <div className="mt-5 flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            onClick={() => setExplorerOpen(true)}
            className="flex-1 rounded-full border border-border/80 bg-ivory py-2.5 text-center text-xs font-semibold tracking-wide text-foreground shadow-xs transition-all duration-200 hover:border-green hover:bg-green hover:text-white"
          >
            {viewAllLabel}
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
