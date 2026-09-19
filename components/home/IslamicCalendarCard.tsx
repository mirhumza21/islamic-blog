"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Moon } from "lucide-react";
import { defaultCalendar } from "@/data/home-sections";

export function IslamicCalendarCard({
  label = defaultCalendar.calendarLabel,
}: {
  label?: string;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Gregorian month name
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long" });

  // Real astronomical Hijri conversion using Intl Islamic Umm al-Qura calendar
  const hijriFormatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    month: "long",
    year: "numeric",
  });
  const hijriParts = hijriFormatter.formatToParts(new Date(year, month, selectedDay || 1));
  const hijriMonthName = hijriParts.find((p) => p.type === "month")?.value || "Rabīʿ al-thānī";
  const hijriYear = hijriParts.find((p) => p.type === "year")?.value || "1448";

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isToday = (day: number) => {
    const now = new Date();
    return (
      day === now.getDate() &&
      month === now.getMonth() &&
      year === now.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  return (
    <div className="flex h-full flex-col justify-between rounded-[26px] border border-border/80 bg-card p-6 shadow-spiritual lg:p-7">
      <div>
        {/* Header */}
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/70">
          {label}
        </div>

        {/* Month Navigation */}
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-ivory text-foreground/70 transition-colors hover:border-green hover:bg-cream hover:text-green"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="text-center">
            <h4 className="font-serif text-lg font-bold text-foreground sm:text-xl">
              {hijriMonthName} {hijriYear} AH
            </h4>
            <div className="text-xs font-medium text-muted">
              {monthName} / {year}
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-ivory text-foreground/70 transition-colors hover:border-green hover:bg-cream hover:text-green"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="mt-6 grid grid-cols-7 text-center text-[10px] font-bold tracking-wider text-muted">
          <span>SUN</span>
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
        </div>

        {/* Days grid */}
        <div className="mt-3 grid grid-cols-7 gap-y-2 text-center text-xs">
          {blanks.map((b) => (
            <div key={`blank-${b}`} className="h-8 w-8" />
          ))}

          {daysArray.map((day) => {
            const today = isToday(day);
            const isSelected = selectedDay === day;
            // Sunnah fast markers: Mon/Thu and White days (13, 14, 15)
            const dayOfWeek = (firstDayOfWeek + day - 1) % 7;
            const isSunnahFast = dayOfWeek === 1 || dayOfWeek === 4 || day === 13 || day === 14 || day === 15;

            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className="group relative mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs transition-all"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                    today
                      ? "bg-[#075846] font-bold text-white shadow-sm ring-2 ring-[#075846]/20"
                      : isSelected
                      ? "border border-green bg-green/10 font-bold text-green"
                      : "text-foreground/80 hover:bg-cream"
                  }`}
                >
                  {day}
                </span>

                {/* Sunnah Fast subtle dot indicator */}
                {isSunnahFast && !today && !isSelected ? (
                  <span
                    className="absolute bottom-0 h-1 w-1 rounded-full bg-sand/60"
                    title="Recommended Sunnah Fast"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day footnote */}
      <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-between text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <Moon className="h-3.5 w-3.5 text-green" />
          Selected: {monthName} {selectedDay}, {year}
        </span>
        <span className="text-[10px] font-medium text-sand">
          Sunnah Fast Days marked
        </span>
      </div>
    </div>
  );
}
