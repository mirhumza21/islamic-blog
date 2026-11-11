"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { prayerCities, PrayerCity } from "@/data/islamic-data";
import { Check, MapPin, Search } from "lucide-react";

interface LocationPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCity: PrayerCity;
  onSelectCity: (city: PrayerCity) => void;
}

export function LocationPickerModal({
  open,
  onOpenChange,
  selectedCity,
  onSelectCity,
}: LocationPickerModalProps) {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState<string>("all");

  const countries = [
    { id: "all", label: "All" },
    { id: "United States", label: "USA" },
    { id: "Saudi Arabia", label: "Saudi Arabia" },
    { id: "Pakistan", label: "Pakistan" },
    { id: "United Kingdom", label: "UK" },
  ];

  const filtered = prayerCities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = countryFilter === "all" || c.country === countryFilter;
    return matchesSearch && matchesCountry;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card p-6 sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-2xl font-semibold text-foreground">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green/10 text-green">
              <MapPin className="h-5 w-5" />
            </span>
            Change Location
          </DialogTitle>
          <p className="text-xs text-muted">
            Select your city for precise astronomical prayer time calculations.
          </p>
        </DialogHeader>

        <div className="relative mt-2">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search city or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-ivory py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted/60 focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
          />
        </div>

        {/* Quick Country Filter Pills */}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {countries.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCountryFilter(c.id)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                countryFilter === c.id
                  ? "bg-green text-white"
                  : "bg-ivory border border-border text-muted hover:text-foreground hover:bg-cream"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-4 max-h-72 space-y-1 overflow-y-auto pr-1">
          {filtered.map((city) => {
            const isSelected = city.id === selectedCity.id;
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => {
                  onSelectCity(city);
                  onOpenChange(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors ${
                  isSelected
                    ? "bg-green text-white"
                    : "hover:bg-cream text-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin
                    className={`h-4 w-4 ${
                      isSelected ? "text-sand-soft" : "text-green"
                    }`}
                  />
                  <div>
                    <div className="font-medium">{city.name}</div>
                    <div
                      className={`text-xs ${
                        isSelected ? "text-white/80" : "text-muted"
                      }`}
                    >
                      {city.country} • {city.method}
                    </div>
                  </div>
                </div>
                {isSelected ? <Check className="h-4 w-4 text-white" /> : null}
              </button>
            );
          })}
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">
              No matching locations found.
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
