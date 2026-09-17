"use client";

import { upcomingIslamicEvents } from "@/data/islamic-data";
import { Calendar, Moon, Sparkles } from "lucide-react";

export function IslamicEventsCard() {
  const now = new Date();
  const currentDateFormatted = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const hijriFormatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const todayHijri = `${hijriFormatter.format(now)} AH`;

  return (
    <div className="flex h-full flex-col justify-between rounded-[26px] border border-border/80 bg-card p-6 shadow-spiritual lg:p-7">
      <div>
        {/* Header */}
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/70">
          TODAY & UPCOMING EVENTS
        </div>

        {/* Today's Milestone Card */}
        <div className="mt-5 flex items-start gap-3.5 rounded-2xl border border-[#ece4d5] bg-[#faf7f0] p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0a483a] text-[#ebdcb9] shadow-xs">
            <Moon className="h-5 w-5 fill-current" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#b87c32]">
                TODAY
              </span>
              <span className="text-[11px] font-medium text-muted">
                {currentDateFormatted}
              </span>
            </div>

            <h4 className="mt-1 font-serif text-lg font-bold text-foreground">
              {todayHijri}
            </h4>

            <p className="mt-1 text-xs leading-relaxed text-foreground/80">
              The blessed Islamic day. Increase in good deeds, voluntary fasting, daily dhikr, and regular Quran recitation.
            </p>
          </div>
        </div>

        {/* Upcoming Milestones List */}
        <div className="mt-5 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Upcoming Milestones
          </div>

          {upcomingIslamicEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between rounded-xl border border-border/70 bg-ivory/50 px-3.5 py-2.5 transition-colors hover:border-green/30 hover:bg-ivory"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green/10 text-green">
                  <Calendar className="h-3.5 w-3.5" />
                </span>
                <div>
                  <div className="text-xs font-semibold text-foreground">
                    {event.name}
                  </div>
                  <div className="text-[10px] text-muted">
                    {event.hijriDate}
                  </div>
                </div>
              </div>

              <span className="rounded-md bg-sand/15 px-2 py-0.5 text-[10px] font-semibold text-[#a67026]">
                {event.badge || "Upcoming"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer advice */}
      <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-[11px] text-muted">
        <span className="flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-sand" />
          Plan and prepare your spiritual goals
        </span>
        <span className="font-semibold text-green">Hijri 1448</span>
      </div>
    </div>
  );
}
