"use client";

import { useEffect, useState } from "react";
import { upcomingIslamicEvents, IslamicEvent } from "@/data/islamic-data";
import { defaultCalendar } from "@/data/home-sections";
import { Timer } from "lucide-react";

export function EventCountdownCard({
  label = defaultCalendar.countdownLabel,
  subtitle = defaultCalendar.countdownSubtitle,
  selectLabel = defaultCalendar.selectMilestoneLabel,
}: {
  label?: string;
  subtitle?: string;
  selectLabel?: string;
}) {
  const [selectedEvent, setSelectedEvent] = useState<IslamicEvent>(
    upcomingIslamicEvents[0]
  );
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(selectedEvent.targetDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [selectedEvent]);

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[26px] border border-[#ecdcc3] bg-[#fefcf8] p-6 shadow-spiritual lg:p-7">
      {/* Decorative Islamic Arched Outline & Lanterns */}
      <div
        className="pointer-events-none absolute inset-3 rounded-[20px] border border-[#e8d5b7]/50"
        aria-hidden
      />

      {/* Left Hanging Lantern (Fanous) SVG */}
      <div
        className="pointer-events-none absolute left-5 top-12 w-6 text-[#c49856] opacity-75"
        aria-hidden
      >
        <svg viewBox="0 0 24 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          {/* Chain */}
          <line x1="12" y1="0" x2="12" y2="24" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          {/* Lantern Top */}
          <path d="M7 24h10l-2 5H9l-2-5z" fill="currentColor" opacity="0.9" />
          {/* Glass Body */}
          <path d="M8 29h8l2 12-4 4h-4l-4-4 2-12z" stroke="currentColor" strokeWidth="1" fill="#fdf7eb" />
          <circle cx="12" cy="35" r="2" fill="#e6a840" />
          {/* Lantern Base & Tassel */}
          <path d="M10 45h4l-2 4-2-4z" fill="currentColor" />
          <line x1="12" y1="49" x2="12" y2="58" stroke="currentColor" strokeWidth="1" />
          <circle cx="12" cy="58" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* Right Hanging Lantern (Fanous) SVG */}
      <div
        className="pointer-events-none absolute right-5 top-12 w-6 text-[#c49856] opacity-75"
        aria-hidden
      >
        <svg viewBox="0 0 24 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <line x1="12" y1="0" x2="12" y2="24" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          <path d="M7 24h10l-2 5H9l-2-5z" fill="currentColor" opacity="0.9" />
          <path d="M8 29h8l2 12-4 4h-4l-4-4 2-12z" stroke="currentColor" strokeWidth="1" fill="#fdf7eb" />
          <circle cx="12" cy="35" r="2" fill="#e6a840" />
          <path d="M10 45h4l-2 4-2-4z" fill="currentColor" />
          <line x1="12" y1="49" x2="12" y2="58" stroke="currentColor" strokeWidth="1" />
          <circle cx="12" cy="58" r="1.5" fill="currentColor" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8e6a2c]">
            {label}
          </div>
          <p className="mt-1 text-xs text-muted">
            {subtitle}
          </p>
        </div>

        {/* Selected Event Title */}
        <div className="mt-6 text-center">
          <h4 className="font-serif text-xl font-bold text-[#064234] sm:text-2xl">
            {selectedEvent.name}
          </h4>
          <div className="mt-1 inline-block rounded-full bg-[#fcedd7] px-3 py-0.5 text-[11px] font-semibold text-[#b87625]">
            {selectedEvent.hijriDate}
          </div>
        </div>

        {/* Live Countdown Counter Grid */}
        <div className="mt-6 grid grid-cols-4 gap-2 text-center">
          {[
            { label: "DAYS", value: timeLeft.days },
            { label: "HOURS", value: timeLeft.hours },
            { label: "MINS", value: timeLeft.minutes },
            { label: "SECS", value: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center rounded-2xl border border-[#ecd9be] bg-white p-2.5 shadow-xs sm:p-3"
            >
              <span className="font-serif text-2xl font-bold text-[#084c3c] sm:text-3xl">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="mt-1 text-[9px] font-bold tracking-wider text-muted">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Event description */}
        <p className="mt-4 text-center text-xs leading-relaxed text-foreground/80 font-medium">
          {selectedEvent.description}
        </p>
      </div>

      {/* Event Selector Chips */}
      <div className="relative z-10 mt-6 border-t border-[#ebdcc8] pt-4">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2 text-center">
          {selectLabel}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {upcomingIslamicEvents.map((evt) => (
            <button
              key={evt.id}
              type="button"
              onClick={() => setSelectedEvent(evt)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                selectedEvent.id === evt.id
                  ? "bg-[#084c3c] text-white shadow-xs"
                  : "border border-[#ecd9be] bg-white text-foreground/75 hover:bg-[#faf4e8]"
              }`}
            >
              {evt.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
