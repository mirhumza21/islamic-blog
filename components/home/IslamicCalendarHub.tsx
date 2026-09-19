"use client";

import { IslamicCalendarCard } from "@/components/home/IslamicCalendarCard";
import { IslamicEventsCard } from "@/components/home/IslamicEventsCard";
import { EventCountdownCard } from "@/components/home/EventCountdownCard";
import { SectionHeader } from "@/components/home/SectionHeader";
import { defaultCalendar } from "@/data/home-sections";
import { Moon } from "lucide-react";

export function IslamicCalendarHub({
  content,
}: {
  content?: Partial<typeof defaultCalendar>;
}) {
  const copy = { ...defaultCalendar, ...content };

  return (
    <section aria-label={copy.title} className="relative overflow-hidden bg-cream/80">
      <div
        className="pointer-events-none absolute inset-0 pattern-geometric-cream opacity-60"
        aria-hidden
      />
      <div className="container-editorial relative py-12 lg:py-16">
        <SectionHeader
          eyebrow={copy.eyebrow}
          title={copy.title}
          subtitle={copy.subtitle}
          icon={<Moon className="h-3 w-3" />}
          tone="green"
        />

        <div className="rounded-[30px] border border-[#e6dfd3] bg-white/75 p-4 shadow-[0_8px_30px_-12px_rgba(6,59,47,0.12)] backdrop-blur-xs sm:p-6 lg:p-7">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:items-stretch lg:gap-6">
            <div className="min-h-[440px]">
              <IslamicCalendarCard label={copy.calendarLabel} />
            </div>
            <div className="min-h-[440px]">
              <IslamicEventsCard
                label={copy.eventsLabel}
                todayBlessing={copy.todayBlessing}
              />
            </div>
            <div className="min-h-[440px] md:col-span-2 lg:col-span-1">
              <EventCountdownCard
                label={copy.countdownLabel}
                subtitle={copy.countdownSubtitle}
                selectLabel={copy.selectMilestoneLabel}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
