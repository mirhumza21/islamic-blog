"use client";

import { IslamicCalendarCard } from "@/components/home/IslamicCalendarCard";
import { IslamicEventsCard } from "@/components/home/IslamicEventsCard";
import { EventCountdownCard } from "@/components/home/EventCountdownCard";
import { defaultCalendar } from "@/data/home-sections";
import { Moon } from "lucide-react";

export function IslamicCalendarHub({
  content,
}: {
  content?: Partial<typeof defaultCalendar>;
}) {
  const copy = { ...defaultCalendar, ...content };

  return (
    <section
      aria-label={copy.title}
      className="container-editorial py-8 lg:py-12"
    >
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-green/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-green">
            <Moon className="h-3 w-3" />
            {copy.eyebrow}
          </div>
          <h2 className="mt-1.5 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {copy.title}
          </h2>
        </div>
        <p className="hidden text-xs text-muted sm:block">{copy.subtitle}</p>
      </div>

      <div className="rounded-[30px] border border-border/80 bg-card/60 p-4 shadow-xs sm:p-6 lg:p-7">
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
    </section>
  );
}
