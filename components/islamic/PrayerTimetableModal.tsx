"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PrayerCity } from "@/data/islamic-data";
import { calculatePrayerTimes, PrayerTimeSchedule } from "@/lib/prayer-times";
import { Calendar, Clock, MapPin } from "lucide-react";

interface PrayerTimetableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  city: PrayerCity;
  schedule: PrayerTimeSchedule;
}

export function PrayerTimetableModal({
  open,
  onOpenChange,
  city,
  schedule,
}: PrayerTimetableModalProps) {
  const [tab, setTab] = useState<"daily" | "monthly">("daily");

  // Generate 7-day projection for monthly/weekly preview
  const daysList = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const daySchedule = calculatePrayerTimes(city, d);
    return {
      dateStr: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      schedule: daySchedule,
      isToday: i === 0,
    };
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card p-6 sm:rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2.5 font-serif text-2xl font-semibold text-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green text-white">
                <Clock className="h-5 w-5" />
              </span>
              Prayer Timetable
            </DialogTitle>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <MapPin className="h-3.5 w-3.5 text-green" />
            <span>{city.name}, {city.country} • Calculation: {city.method}</span>
          </div>
        </DialogHeader>

        {/* Tab switcher */}
        <div className="mt-4 flex rounded-xl border border-border bg-ivory p-1">
          <button
            type="button"
            onClick={() => setTab("daily")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              tab === "daily"
                ? "bg-green text-white shadow-xs"
                : "text-muted hover:text-foreground"
            }`}
          >
            Today's Full Breakdown
          </button>
          <button
            type="button"
            onClick={() => setTab("monthly")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              tab === "monthly"
                ? "bg-green text-white shadow-xs"
                : "text-muted hover:text-foreground"
            }`}
          >
            Upcoming Days Timetable
          </button>
        </div>

        {tab === "daily" ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { name: "Fajr (Dawn)", time: schedule.fajr, desc: "Morning prayer start" },
              { name: "Sunrise (Shuruq)", time: schedule.sunrise, desc: "End of Fajr window" },
              { name: "Dhuhr (Noon)", time: schedule.dhuhr, desc: "Midday prayer" },
              { name: "Asr (Afternoon)", time: schedule.asr, desc: "Late afternoon prayer" },
              { name: "Sunset (Maghrib)", time: schedule.maghrib, desc: "Iftar / Dusk prayer" },
              { name: "Isha (Night)", time: schedule.isha, desc: "Night prayer" },
              { name: "Midnight (Nisf Layl)", time: schedule.midnight, desc: "Islamic midpoint" },
              { name: "Last 3rd of Night", time: schedule.lastThird, desc: "Tahajjud & Istighfar" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border/80 bg-ivory/60 p-3.5 transition-colors hover:border-green/30"
              >
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted">
                  {item.name}
                </div>
                <div className="mt-1 font-serif text-xl font-bold text-green">
                  {item.time}
                </div>
                <div className="mt-0.5 text-[10px] text-muted">{item.desc}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream/70 text-foreground">
                <tr>
                  <th className="px-3.5 py-2.5 font-semibold">Date</th>
                  <th className="px-3 py-2.5 font-semibold">Fajr</th>
                  <th className="px-3 py-2.5 font-semibold">Sunrise</th>
                  <th className="px-3 py-2.5 font-semibold">Dhuhr</th>
                  <th className="px-3 py-2.5 font-semibold">Asr</th>
                  <th className="px-3 py-2.5 font-semibold">Maghrib</th>
                  <th className="px-3 py-2.5 font-semibold">Isha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {daysList.map((d, i) => (
                  <tr
                    key={i}
                    className={d.isToday ? "bg-green/5 font-medium" : "hover:bg-ivory"}
                  >
                    <td className="whitespace-nowrap px-3.5 py-2.5 text-foreground">
                      {d.dateStr} {d.isToday ? <span className="ml-1 rounded bg-green px-1.5 py-0.5 text-[9px] text-white">Today</span> : null}
                    </td>
                    <td className="px-3 py-2.5 text-muted">{d.schedule.fajr}</td>
                    <td className="px-3 py-2.5 text-muted">{d.schedule.sunrise}</td>
                    <td className="px-3 py-2.5 text-muted">{d.schedule.dhuhr}</td>
                    <td className="px-3 py-2.5 text-muted">{d.schedule.asr}</td>
                    <td className="px-3 py-2.5 text-muted">{d.schedule.maghrib}</td>
                    <td className="px-3 py-2.5 text-muted">{d.schedule.isha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-green" />
            Precise solar astronomical calculation
          </span>
          <span>UmrahZone &bull; Authentic Timings</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
