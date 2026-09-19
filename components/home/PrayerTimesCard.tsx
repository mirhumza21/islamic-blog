"use client";

import { useEffect, useState } from "react";
import { prayerCities, PrayerCity } from "@/data/islamic-data";
import {
  calculatePrayerTimes,
  fetchLivePrayerData,
  getCurrentPrayerStatus,
  PrayerKey,
  PrayerTimeSchedule,
} from "@/lib/prayer-times";
import { LocationPickerModal } from "@/components/islamic/LocationPickerModal";
import { PrayerTimetableModal } from "@/components/islamic/PrayerTimetableModal";
import { defaultDailySpiritual } from "@/data/daily-spiritual";
import { MapPin } from "lucide-react";

export function PrayerTimesCard({
  label = defaultDailySpiritual.prayerLabel,
  timetableLabel = defaultDailySpiritual.timetableLabel,
  locationLabel = defaultDailySpiritual.locationLabel,
}: {
  label?: string;
  timetableLabel?: string;
  locationLabel?: string;
}) {
  const [selectedCity, setSelectedCity] = useState<PrayerCity>(prayerCities[0]); // Default Lahore
  const [schedule, setSchedule] = useState<PrayerTimeSchedule>(() =>
    calculatePrayerTimes(prayerCities[0])
  );
  const [status, setStatus] = useState(() =>
    getCurrentPrayerStatus(calculatePrayerTimes(prayerCities[0]))
  );
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [timetableModalOpen, setTimetableModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load saved city and fetch real API data
  useEffect(() => {
    setMounted(true);
    let activeCity = prayerCities[0];
    const saved = localStorage.getItem("umrahzone_selected_city");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = prayerCities.find((c) => c.id === parsed.id);
        if (match) activeCity = match;
      } catch (e) {
        console.error(e);
      }
    }
    setSelectedCity(activeCity);

    // Call real API
    fetchLivePrayerData(activeCity).then(({ schedule: liveSched }) => {
      setSchedule(liveSched);
      setStatus(getCurrentPrayerStatus(liveSched));
    });
  }, []);

  // When city changes, fetch live data from API
  useEffect(() => {
    if (!mounted) return;
    fetchLivePrayerData(selectedCity).then(({ schedule: liveSched }) => {
      setSchedule(liveSched);
      setStatus(getCurrentPrayerStatus(liveSched));
    });
  }, [selectedCity, mounted]);

  // Update live clock and countdown every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setStatus(getCurrentPrayerStatus(schedule, now));
    }, 15000);
    return () => clearInterval(interval);
  }, [schedule]);

  const handleCitySelect = (city: PrayerCity) => {
    setSelectedCity(city);
    const instant = calculatePrayerTimes(city);
    setSchedule(instant);
    setStatus(getCurrentPrayerStatus(instant));
    try {
      localStorage.setItem("umrahzone_selected_city", JSON.stringify(city));
    } catch (e) {
      console.error(e);
    }
  };

  const prayerItems: { key: PrayerKey; label: string; time: string }[] = [
    { key: "fajr", label: "FAJR", time: schedule.fajr.replace(" AM", "") },
    { key: "dhuhr", label: "DHUHR", time: schedule.dhuhr.replace(" PM", "").replace(" AM", "") },
    { key: "asr", label: "ASR", time: schedule.asr.replace(" PM", "") },
    { key: "maghrib", label: "MAGHRIB", time: schedule.maghrib.replace(" PM", "") },
    { key: "isha", label: "ISHA", time: schedule.isha.replace(" PM", "") },
  ];

  const ampmMap: Record<PrayerKey, string> = {
    fajr: "AM",
    dhuhr: schedule.dhuhr.includes("PM") ? "PM" : "AM",
    asr: "PM",
    maghrib: "PM",
    isha: "PM",
  };

  return (
    <>
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[26px] bg-[#073f32] p-5 text-white shadow-emerald-glow sm:p-6 lg:p-7">
        {/* Subtle geometric pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10 pattern-subtle"
          aria-hidden
        />

        <div className="flex-1">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#d4af72]">
              <MapPin className="h-3.5 w-3.5 text-[#d4af72]" />
              <span>{label}</span>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE
            </span>
          </div>

          <p className="mt-2 text-xs text-emerald-100/70">
            {selectedCity.name}, {selectedCity.country}
          </p>

          {/* Current / Next Prayer Highlight */}
          <div className="mt-5">
            <h3 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-[2.2rem]">
              {status.currentPrayerName}
            </h3>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#e5c07b] sm:text-xl">
                {schedule[status.currentPrayer]}
              </span>
              <span className="text-xs text-emerald-200/70">
                Next: {status.nextPrayerName} in {status.timeRemainingFormatted}
              </span>
            </div>
          </div>

          {/* 5 Prayer slots row */}
          <div className="mt-5 grid grid-cols-5 gap-2 sm:gap-2.5">
            {prayerItems.map((item) => {
              const isActive = status.currentPrayer === item.key;
              return (
                <div
                  key={item.key}
                  className={`flex flex-col items-center justify-center rounded-xl px-1 py-3 transition-all ${
                    isActive
                      ? "border border-[#e5c07b]/70 bg-[#0d4f40] shadow-[0_0_15px_rgba(229,192,123,0.18)]"
                      : "border border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold tracking-wider ${
                      isActive ? "text-[#e5c07b]" : "text-emerald-100/70"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="mt-1.5 font-serif text-sm font-bold text-white sm:text-base">
                    {item.time}
                  </span>
                  <span className="mt-0.5 text-[9px] uppercase text-emerald-200/50">
                    {ampmMap[item.key]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-5 space-y-2.5">
          <button
            type="button"
            onClick={() => setTimetableModalOpen(true)}
            className="w-full rounded-full border border-white/20 bg-white/10 py-2.5 text-center text-xs font-semibold text-white backdrop-blur-xs transition-all duration-200 hover:bg-white hover:text-[#073f32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5c07b]"
          >
            {timetableLabel}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setLocationModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-200/80 transition-colors hover:text-white"
            >
              <MapPin className="h-3 w-3 text-[#d4af72]" />
              <span>{locationLabel}</span>
            </button>
          </div>
        </div>
      </div>

      <LocationPickerModal
        open={locationModalOpen}
        onOpenChange={setLocationModalOpen}
        selectedCity={selectedCity}
        onSelectCity={handleCitySelect}
      />

      <PrayerTimetableModal
        open={timetableModalOpen}
        onOpenChange={setTimetableModalOpen}
        city={selectedCity}
        schedule={schedule}
      />
    </>
  );
}
