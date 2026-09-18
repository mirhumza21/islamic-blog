"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { curatedDuas, namesOfAllah } from "@/data/islamic-data";
import type { LiveDailyDua, LiveDailyWord, SpiritualDailyPayload } from "@/lib/spiritual-api";

interface SpiritualDailyContextValue {
  loading: boolean;
  word: LiveDailyWord;
  dua: LiveDailyDua;
  names: LiveDailyWord[];
  duas: LiveDailyDua[];
}

const fallbackNames: LiveDailyWord[] = namesOfAllah.map((item) => ({ ...item, isLive: false }));
const fallbackDuas: LiveDailyDua[] = curatedDuas.map((item) => ({ ...item, isLive: false }));
const fallbackWord = fallbackNames[0];
const fallbackDua = fallbackDuas[0];

const SpiritualDailyContext = createContext<SpiritualDailyContextValue>({
  loading: true,
  word: fallbackWord,
  dua: fallbackDua,
  names: fallbackNames,
  duas: fallbackDuas,
});

export function SpiritualDailyProvider({ children }: { children: React.ReactNode }) {
  const [payload, setPayload] = useState<SpiritualDailyPayload>({
    word: fallbackWord,
    dua: fallbackDua,
    names: fallbackNames,
    duas: fallbackDuas,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/spiritual/daily")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load spiritual content");
        return res.json() as Promise<SpiritualDailyPayload>;
      })
      .then((data) => {
        if (cancelled) return;
        setPayload({
          word: data.word || fallbackWord,
          dua: data.dua || fallbackDua,
          names: data.names?.length ? data.names : fallbackNames,
          duas: data.duas?.length ? data.duas : fallbackDuas,
        });
      })
      .catch(() => {
        // Keep curated fallbacks if the API is unreachable.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      loading,
      ...payload,
    }),
    [loading, payload]
  );

  return (
    <SpiritualDailyContext.Provider value={value}>{children}</SpiritualDailyContext.Provider>
  );
}

export function useSpiritualDaily() {
  return useContext(SpiritualDailyContext);
}
