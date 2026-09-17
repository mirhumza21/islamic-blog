"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { namesOfAllah, NameOfAllah } from "@/data/islamic-data";
import { Search, Sparkles, Volume2 } from "lucide-react";

interface NamesExplorerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NamesExplorerModal({
  open,
  onOpenChange,
}: NamesExplorerModalProps) {
  const [search, setSearch] = useState("");
  const [playingNum, setPlayingNum] = useState<number | null>(null);

  const filtered = namesOfAllah.filter(
    (n) =>
      n.transliteration.toLowerCase().includes(search.toLowerCase()) ||
      n.meaning.toLowerCase().includes(search.toLowerCase()) ||
      n.explanation.toLowerCase().includes(search.toLowerCase()) ||
      n.arabic.includes(search)
  );

  const handlePlay = (name: NameOfAllah) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setPlayingNum(name.number);

    const utterance = new SpeechSynthesisUtterance(name.arabic);
    utterance.lang = "ar-SA";
    utterance.rate = 0.8;
    utterance.onend = () => setPlayingNum(null);
    utterance.onerror = () => setPlayingNum(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-hidden bg-card p-6 flex flex-col sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 font-serif text-2xl font-semibold text-foreground">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            Asmaul Husna (99 Divine Names)
          </DialogTitle>
          <p className="text-xs text-muted">
            "And to Allah belong the best names, so invoke Him by them." (Surah Al-A'raf 7:180)
          </p>
        </DialogHeader>

        <div className="mt-3 shrink-0 relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search name in English, Arabic, or meaning..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-ivory py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted/60 focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
          />
        </div>

        <div className="mt-4 flex-1 overflow-y-auto pr-1 grid gap-3 sm:grid-cols-2">
          {filtered.map((item) => (
            <div
              key={item.number}
              className="relative flex flex-col justify-between rounded-2xl border border-border/80 bg-ivory/50 p-4 transition-all hover:border-sand/50 hover:bg-card hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sand/15 text-[11px] font-bold text-sand">
                    {item.number}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePlay(item)}
                    className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                      playingNum === item.number
                        ? "bg-green text-white animate-pulse"
                        : "bg-cream text-foreground/70 hover:bg-green hover:text-white"
                    }`}
                    title="Pronounce name"
                    aria-label={`Listen to ${item.transliteration}`}
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="my-2 text-center">
                  <span className="font-arabic text-3xl font-bold text-green">
                    {item.arabic}
                  </span>
                  <div className="mt-1 font-serif text-sm font-semibold tracking-wide text-foreground">
                    {item.transliteration}
                  </div>
                  <div className="mt-0.5 inline-block rounded-md bg-cream px-2 py-0.5 text-[11px] font-medium text-sand">
                    {item.meaning}
                  </div>
                </div>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-muted border-t border-border/60 pt-2">
                {item.explanation}
              </p>
            </div>
          ))}

          {filtered.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-sm text-muted">
              No divine names match your query.
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
