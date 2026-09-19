"use client";

import { PrayerTimesCard } from "@/components/home/PrayerTimesCard";
import { DuaOfTheDayCard } from "@/components/home/DuaOfTheDayCard";
import { WordOfTheDayCard } from "@/components/home/WordOfTheDayCard";
import { SpiritualDailyProvider } from "@/components/home/SpiritualDailyProvider";
import { SectionHeader } from "@/components/home/SectionHeader";
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
      className="relative overflow-hidden bg-ivory scroll-mt-[4.5rem]"
    >
      <div
        className="pointer-events-none absolute inset-0 pattern-geometric-cream opacity-50"
        aria-hidden
      />
      <div className="container-editorial relative pt-12 pb-10 lg:pt-16 lg:pb-14">
        <SectionHeader
          eyebrow={copy.eyebrow}
          title={copy.title}
          subtitle={copy.subtitle}
          icon={<Sparkles className="h-3 w-3" />}
          tone="sand"
        />

        <SpiritualDailyProvider>
          <div className="rounded-[30px] border border-[#e6dfd3]/90 bg-white/70 p-4 shadow-[0_8px_30px_-12px_rgba(6,59,47,0.12)] backdrop-blur-xs sm:p-5 lg:p-6">
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
      </div>
    </section>
  );
}
