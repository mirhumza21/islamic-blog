"use client";

import { PrayerTimesCard } from "@/components/home/PrayerTimesCard";
import { DuaOfTheDayCard } from "@/components/home/DuaOfTheDayCard";
import { WordOfTheDayCard } from "@/components/home/WordOfTheDayCard";
import { Compass, Sparkles } from "lucide-react";

export function DailySpiritualHub() {
  return (
    <section
      aria-label="Daily Spiritual Essentials"
      className="container-editorial py-8 lg:py-12"
    >
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sand/15 px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-sand">
            <Sparkles className="h-3 w-3" />
            Spiritual Companion
          </div>
          <h2 className="mt-1.5 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Daily Spiritual Essentials
          </h2>
        </div>
        <p className="hidden text-xs text-muted sm:block">
          Authentic Timings &bull; Verified Duas &bull; Divine Names
        </p>
      </div>

      <div className="rounded-[30px] border border-border/80 bg-card/60 p-4 sm:p-6 lg:p-7 shadow-xs">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12 lg:items-stretch lg:gap-6">
          {/* Prayer Times Widget */}
          <div className="md:col-span-2 lg:col-span-5 min-h-[440px]">
            <PrayerTimesCard />
          </div>

          {/* Dua of the Day Widget */}
          <div className="md:col-span-1 lg:col-span-4 min-h-[440px]">
            <DuaOfTheDayCard />
          </div>

          {/* Word of the Day Widget */}
          <div className="md:col-span-1 lg:col-span-3 min-h-[440px]">
            <WordOfTheDayCard />
          </div>
        </div>
      </div>
    </section>
  );
}
