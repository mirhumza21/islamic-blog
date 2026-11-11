"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PrayerCity } from "@/data/islamic-data";
import {
  CalendarDayItem,
  fetchLiveMonthlyCalendar,
  PrayerTimeSchedule,
} from "@/lib/prayer-times";
import { Calendar, Clock, Globe, MapPin, Sparkles } from "lucide-react";

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
  const [monthlyDays, setMonthlyDays] = useState<CalendarDayItem[]>([]);
  const [loadingMonthly, setLoadingMonthly] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoadingMonthly(true);
    fetchLiveMonthlyCalendar(city)
      .then((data) => {
        setMonthlyDays(data);
      })
      .finally(() => {
        setLoadingMonthly(false);
      });
  }, [open, city]);

  const currentMonthName = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-card p-6 sm:rounded-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2.5 font-serif text-2xl font-semibold text-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green text-white">
                <Clock className="h-5 w-5" />
              </span>
              Prayer Timetable & Islamic Calendar
            </DialogTitle>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <MapPin className="h-3.5 w-3.5 text-green" />
              {city.name}, {city.country}
            </span>
            <span>&bull;</span>
            <span className="inline-flex items-center gap-1 text-green font-medium">
              <Globe className="h-3 w-3" />
              {city.country === "United States" ? "USA Aladhan ISNA Method" : `${city.method} Method`}
            </span>
            <span>&bull;</span>
            <span>{currentMonthName}</span>
          </div>
        </DialogHeader>

        {/* Tab switcher */}
        <div className="mt-3 flex rounded-xl border border-border bg-ivory p-1">
          <button
            type="button"
            onClick={() => setTab("daily")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              tab === "daily"
                ? "bg-green text-white shadow-xs"
                : "text-muted hover:text-foreground"
            }`}
          >
            Today's Full Breakdown (8 Times)
          </button>
          <button
            type="button"
            onClick={() => setTab("monthly")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              tab === "monthly"
                ? "bg-green text-white shadow-xs"
                : "text-muted hover:text-foreground"
            }`}
          >
            Full Monthly Calendar ({city.country === "United States" ? "USA API" : "Live Timetable"})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 pr-1">
          {tab === "daily" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
            <div className="overflow-x-auto rounded-xl border border-border">
              {loadingMonthly && monthlyDays.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted">
                  Loading monthly timetable from USA Live API...
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream/70 text-foreground sticky top-0 backdrop-blur-sm">
                    <tr>
                      <th className="px-3.5 py-2.5 font-semibold">Date</th>
                      <th className="px-3 py-2.5 font-semibold">Hijri Date</th>
                      <th className="px-3 py-2.5 font-semibold">Fajr</th>
                      <th className="px-3 py-2.5 font-semibold">Sunrise</th>
                      <th className="px-3 py-2.5 font-semibold">Dhuhr</th>
                      <th className="px-3 py-2.5 font-semibold">Asr</th>
                      <th className="px-3 py-2.5 font-semibold">Maghrib</th>
                      <th className="px-3 py-2.5 font-semibold">Isha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {monthlyDays.map((d, i) => (
                      <tr
                        key={i}
                        className={d.isToday ? "bg-green/10 font-medium" : "hover:bg-ivory"}
                      >
                        <td className="whitespace-nowrap px-3.5 py-2 text-foreground">
                          {d.dateStr} {d.isToday ? <span className="ml-1 rounded bg-green px-1.5 py-0.5 text-[9px] text-white">Today</span> : null}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-sand font-medium">
                          {d.hijriDay} {d.hijriMonth}
                        </td>
                        <td className="px-3 py-2 text-muted">{d.schedule.fajr}</td>
                        <td className="px-3 py-2 text-muted">{d.schedule.sunrise}</td>
                        <td className="px-3 py-2 text-muted">{d.schedule.dhuhr}</td>
                        <td className="px-3 py-2 text-muted">{d.schedule.asr}</td>
                        <td className="px-3 py-2 text-muted">{d.schedule.maghrib}</td>
                        <td className="px-3 py-2 text-muted">{d.schedule.isha}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-green" />
            {city.country === "United States"
              ? "Live Aladhan USA Calendar & Timetable API (ISNA Method)"
              : "Live Aladhan Islamic Calendar & Timetable API"}
          </span>
          <span>UmrahZone &bull; Authentic Timings</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
