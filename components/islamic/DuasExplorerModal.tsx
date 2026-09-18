"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { curatedDuas } from "@/data/islamic-data";
import type { LiveDailyDua } from "@/lib/spiritual-api";
import { BookOpen, Check, Copy, Search, Volume2 } from "lucide-react";

interface DuasExplorerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCategory?: string;
  duas?: LiveDailyDua[];
}

export function DuasExplorerModal({
  open,
  onOpenChange,
  initialCategory,
  duas,
}: DuasExplorerModalProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || "All");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const source: LiveDailyDua[] =
    duas && duas.length > 0
      ? duas
      : curatedDuas.map((item) => ({ ...item, isLive: false }));
  const categories = useMemo(() => {
    const unique = Array.from(new Set(source.map((dua) => dua.category)));
    return ["All", ...unique];
  }, [source]);

  const filtered = source.filter((dua) => {
    const matchesCat = activeCategory === "All" || dua.category === activeCategory;
    const query = search.trim().toLowerCase();
    const matchesQuery =
      !query ||
      dua.title.toLowerCase().includes(query) ||
      dua.translation.toLowerCase().includes(query) ||
      dua.transliteration.toLowerCase().includes(query) ||
      dua.reference.toLowerCase().includes(query);
    return matchesCat && matchesQuery;
  });

  const handlePlay = (dua: LiveDailyDua) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setPlayingId(dua.id);

    const utterance = new SpeechSynthesisUtterance(dua.arabic);
    utterance.lang = "ar-SA";
    utterance.rate = 0.85;
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (dua: LiveDailyDua) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}\n(${dua.reference})`
      );
      setCopiedId(dua.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-3xl flex-col overflow-hidden bg-card p-6 sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 font-serif text-2xl font-semibold text-foreground">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green text-white">
              <BookOpen className="h-5 w-5" />
            </span>
            Authentic Duas & Azkar
          </DialogTitle>
          <p className="text-xs text-muted">
            Supplications from the Holy Qur&apos;an and authentic Sunnah of the Prophet Muhammad ﷺ.
          </p>
        </DialogHeader>

        <div className="mt-3 shrink-0 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by topic, keyword, or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-ivory py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted/60 focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-green text-white"
                    : "bg-cream text-foreground/80 hover:bg-cream/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
          {filtered.map((dua) => (
            <div
              key={dua.id}
              className="rounded-2xl border border-border/80 bg-ivory/50 p-5 transition-all hover:border-green/40 hover:bg-card hover:shadow-xs"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-md bg-sand/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-sand">
                  {dua.category}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePlay(dua)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                      playingId === dua.id
                        ? "animate-pulse bg-green text-white"
                        : "bg-cream text-foreground/70 hover:bg-green hover:text-white"
                    }`}
                    title="Play Arabic audio"
                    aria-label="Listen to Dua"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(dua)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-foreground/70 transition-colors hover:bg-green hover:text-white"
                    title="Copy Dua"
                    aria-label="Copy Dua text"
                  >
                    {copiedId === dua.id ? (
                      <Check className="h-4 w-4 text-green" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <h4 className="mt-2.5 font-sans text-sm font-semibold text-foreground">
                {dua.title}
              </h4>

              <p
                dir="rtl"
                lang="ar"
                className="arabic-verse mt-3 text-right font-arabic text-2xl font-bold text-green"
              >
                {dua.arabic}
              </p>

              {dua.transliteration ? (
                <p className="mt-3 text-xs italic leading-relaxed text-foreground/75">
                  {dua.transliteration}
                </p>
              ) : null}

              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                &ldquo;{dua.translation}&rdquo;
              </p>

              <div className="mt-3 text-right text-[11px] font-semibold text-sand">
                {dua.reference}
              </div>
            </div>
          ))}

          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted">
              No Duas match your search. Try another query or category.
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
