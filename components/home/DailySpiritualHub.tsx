"use client";

import { PrayerTimesCard } from "@/components/home/PrayerTimesCard";
import { DuaOfTheDayCard } from "@/components/home/DuaOfTheDayCard";
import { WordOfTheDayCard } from "@/components/home/WordOfTheDayCard";
import { SpiritualDailyProvider } from "@/components/home/SpiritualDailyProvider";
import {
  defaultDailySpiritual,
  type DailySpiritualContent,
} from "@/data/daily-spiritual";
import { Sparkles } from "lucide-react";

export function DailySpiritualHub({
  content,
}: {
  content?: Partial<DailySpiritualContent>;
}) {
  const copy = { ...defaultDailySpiritual, ...content };

  return (
    <section
      id="daily-spiritual-hub"
      aria-label={copy.title}
      className="container-editorial scroll-mt-[4.5rem] pt-10 pb-8 lg:pt-14 lg:pb-10"
    >
      <div className="mb-5 flex items-end justify-between gap-4 lg:mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sand/15 px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-sand">
            <Sparkles className="h-3 w-3" />
            {copy.eyebrow}
          </div>
          <h2 className="mt-1.5 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-[1.85rem] lg:text-[2rem]">
            {copy.title}
          </h2>
        </div>
        <p className="hidden text-xs text-muted sm:block">{copy.subtitle}</p>
      </div>

      <SpiritualDailyProvider>
        <div className="rounded-[30px] border border-border/80 bg-card/60 p-4 shadow-xs sm:p-5 lg:p-6">
          <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12 lg:gap-5">
            <div className="lg:col-span-5">
              <PrayerTimesCard
                label={copy.prayerLabel}
                timetableLabel={copy.timetableLabel}
                locationLabel={copy.locationLabel}
              />
            </div>
            <div className="lg:col-span-4">
              <DuaOfTheDayCard
                label={copy.duaLabel}
                viewAllLabel={copy.viewAllDuasLabel}
              />
            </div>
            <div className="lg:col-span-3">
              <WordOfTheDayCard
                label={copy.wordLabel}
                exploreLabel={copy.exploreNamesLabel}
              />
            </div>
          </div>
        </div>
      </SpiritualDailyProvider>
    </section>
  );
}
