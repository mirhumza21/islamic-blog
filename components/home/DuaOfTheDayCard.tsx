"use client";

import { useEffect, useState } from "react";
import { curatedDuas, DuaItem } from "@/data/islamic-data";
import { fetchLiveDuaOfTheDay, LiveDailyDua } from "@/lib/spiritual-api";
import { DuasExplorerModal } from "@/components/islamic/DuasExplorerModal";
import { Volume2, Sparkles, Wifi } from "lucide-react";

export function DuaOfTheDayCard() {
  const [currentDua, setCurrentDua] = useState<LiveDailyDua>({
    id: curatedDuas[0].id,
    category: curatedDuas[0].category,
    title: curatedDuas[0].title,
    arabic: curatedDuas[0].arabic,
    transliteration: curatedDuas[0].transliteration,
    translation: curatedDuas[0].translation,
    reference: curatedDuas[0].reference,
    isLive: false,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [duaIndex, setDuaIndex] = useState(0);

  useEffect(() => {
    fetchLiveDuaOfTheDay().then((liveDua) => {
      setCurrentDua(liveDua);
    });
  }, []);

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
    const nextIdx = (duaIndex + 1) % curatedDuas.length;
    setDuaIndex(nextIdx);
    const d = curatedDuas[nextIdx];
    setCurrentDua({
      id: d.id,
      category: d.category,
      title: d.title,
      arabic: d.arabic,
      transliteration: d.transliteration,
      translation: d.translation,
      reference: d.reference,
      isLive: false,
    });
  };

  return (
    <>
      <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[26px] border border-border/80 bg-card p-6 shadow-spiritual transition-all duration-300 hover:border-green/30 lg:p-7">
        <div>
          {/* Header Row */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/80">
                  DUA OF THE DAY
                </span>
                {currentDua.isLive ? (
                  <span className="flex items-center gap-1 rounded-full bg-green/10 px-2 py-0.5 text-[9px] font-bold text-green">
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
            </div>

            <button
              type="button"
              onClick={handlePlayAudio}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                isPlaying
                  ? "bg-green text-white ring-4 ring-green/20"
                  : "bg-cream text-foreground/70 hover:bg-green hover:text-white shadow-xs"
              }`}
              title="Listen to Arabic recitation"
              aria-label="Listen to Dua recitation"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>

          {/* Arabic Calligraphy text */}
          <div className="my-5 text-center min-h-[100px] flex items-center justify-center">
            <p
              dir="rtl"
              className="font-arabic text-2xl font-bold leading-[1.8] text-foreground sm:text-[1.75rem]"
            >
              {currentDua.arabic}
            </p>
          </div>

          {/* Reference & Translation Box */}
          <div className="rounded-2xl bg-[#faf6ef] p-4 text-center border border-[#eee4d3]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#b8782a]">
              {currentDua.reference}
            </div>
            {currentDua.transliteration ? (
              <div className="mt-1.5 text-xs italic text-foreground/75 leading-relaxed font-serif">
                {currentDua.transliteration}
              </div>
            ) : null}
            <p className="mt-2 text-xs leading-relaxed text-foreground/90 font-medium">
              "{currentDua.translation}"
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setExplorerOpen(true)}
            className="flex-1 rounded-full border border-border/80 bg-ivory py-3 text-center text-xs font-bold uppercase tracking-wider text-foreground transition-all duration-200 hover:border-green hover:bg-green hover:text-white shadow-xs"
          >
            VIEW ALL DUAS
          </button>
          <button
            type="button"
            onClick={handleNextDua}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/80 bg-ivory text-foreground/70 transition-colors hover:border-green hover:bg-cream hover:text-green shadow-xs"
            title="Next Dua"
            aria-label="Next Dua"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </div>

      <DuasExplorerModal
        open={explorerOpen}
        onOpenChange={setExplorerOpen}
      />
    </>
  );
}
