import { curatedDuas, namesOfAllah } from "@/data/islamic-data";

export interface LiveDailyWord {
  number: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  explanation: string;
  isLive: boolean;
}

export interface LiveDailyDua {
  id: string;
  category: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  isLive: boolean;
  audioUrl?: string;
}

export interface SpiritualDailyPayload {
  word: LiveDailyWord;
  dua: LiveDailyDua;
  names: LiveDailyWord[];
  duas: LiveDailyDua[];
}

const QURANIC_DUAS: Array<{
  key: string;
  category: string;
  title: string;
}> = [
  { key: "2:201", category: "Guidance", title: "Dua for good in this life and the Hereafter" },
  { key: "3:8", category: "Guidance", title: "Dua for a steadfast heart" },
  { key: "7:23", category: "Forgiveness", title: "Dua of Adam for forgiveness" },
  { key: "14:40", category: "Prayer", title: "Dua to establish prayer" },
  { key: "17:24", category: "Family", title: "Dua of mercy for parents" },
  { key: "18:10", category: "Guidance", title: "Dua of the People of the Cave" },
  { key: "20:114", category: "Knowledge", title: "Dua for increase in knowledge" },
  { key: "21:83", category: "Patience", title: "Dua of Ayyub in hardship" },
  { key: "21:87", category: "Forgiveness", title: "Dua of Yunus" },
  { key: "23:118", category: "Forgiveness", title: "Dua for forgiveness and mercy" },
  { key: "26:83", category: "Wisdom", title: "Dua of Ibrahim for wisdom" },
  { key: "28:16", category: "Forgiveness", title: "Dua of Musa for forgiveness" },
];

function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

async function fetchJson<T>(url: string, timeoutMs = 8000): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeoutId);
  }
}

function fallbackNames(): LiveDailyWord[] {
  return namesOfAllah.map((item) => ({
    ...item,
    isLive: false,
  }));
}

function fallbackDuas(): LiveDailyDua[] {
  return curatedDuas.map((item) => ({
    ...item,
    isLive: false,
  }));
}

function mapAsmaName(item: {
  number: number;
  name: string;
  transliteration: string;
  en?: { meaning?: string };
}): LiveDailyWord {
  const meaning = item.en?.meaning?.trim() || "A beautiful name of Allah";
  const local = namesOfAllah.find((n) => n.number === item.number);
  return {
    number: item.number,
    arabic: item.name,
    transliteration: (item.transliteration || "").toUpperCase().trim(),
    meaning,
    explanation: local?.explanation || `One of the beautiful names of Allah — ${meaning}.`,
    isLive: true,
  };
}

export async function fetchAllAsmaAlHusna(): Promise<LiveDailyWord[]> {
  try {
    const json = await fetchJson<{
      code: number;
      data?: Array<{
        number: number;
        name: string;
        transliteration: string;
        en?: { meaning?: string };
      }>;
    }>("https://api.aladhan.com/v1/asmaAlHusna");

    if (json.code === 200 && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map(mapAsmaName);
    }
  } catch {
    // Use local names if Aladhan is unavailable.
  }
  return fallbackNames();
}

async function fetchQuranicDua(entry: (typeof QURANIC_DUAS)[number]): Promise<LiveDailyDua | null> {
  try {
    const json = await fetchJson<{
      code: number;
      data?: Array<{
        number?: number;
        numberInSurah?: number;
        text?: string;
        surah?: { number?: number; englishName?: string };
      }>;
    }>(
      `https://api.alquran.cloud/v1/ayah/${entry.key}/editions/quran-uthmani,en.transliteration,en.sahih`
    );

    if (json.code !== 200 || !Array.isArray(json.data) || json.data.length < 3) {
      return null;
    }

    const [arabicAyah, transliterationAyah, translationAyah] = json.data;
    const arabic = arabicAyah.text?.trim();
    const translation = translationAyah.text
      ?.trim()
      .replace(/^\[[^\]]+\][,\s]*/g, "")
      .replace(/^"+|"+$/g, "")
      .trim();
    if (!arabic || !translation) return null;

    const surahName = arabicAyah.surah?.englishName || "Qur'an";

    const ayahNumber = arabicAyah.number;
    const audioUrl =
      typeof ayahNumber === "number"
        ? `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahNumber}.mp3`
        : undefined;

    return {
      id: `quran-${entry.key}`,
      category: entry.category,
      title: entry.title,
      arabic,
      transliteration: transliterationAyah.text?.trim() || "",
      translation,
      reference: `Surah ${surahName} ${entry.key}`,
      isLive: true,
      audioUrl,
    };
  } catch {
    return null;
  }
}

export async function fetchQuranicDuas(): Promise<LiveDailyDua[]> {
  const results = await Promise.allSettled(QURANIC_DUAS.map((entry) => fetchQuranicDua(entry)));
  const live = results
    .map((result) => (result.status === "fulfilled" ? result.value : null))
    .filter((item): item is LiveDailyDua => Boolean(item));

  const sunnah = fallbackDuas();
  const combined = [...live, ...sunnah];
  return combined.length > 0 ? combined : sunnah;
}

export async function fetchSpiritualDaily(date: Date = new Date()): Promise<SpiritualDailyPayload> {
  const dayOfYear = getDayOfYear(date);
  const [names, duas] = await Promise.all([fetchAllAsmaAlHusna(), fetchQuranicDuas()]);

  const safeNames = names.length > 0 ? names : fallbackNames();
  const safeDuas = duas.length > 0 ? duas : fallbackDuas();
  const liveDuas = safeDuas.filter((dua) => dua.isLive);
  const dailyDuaPool = liveDuas.length > 0 ? liveDuas : safeDuas;

  return {
    names: safeNames,
    duas: safeDuas,
    word: safeNames[(dayOfYear - 1) % safeNames.length],
    dua: dailyDuaPool[dayOfYear % dailyDuaPool.length],
  };
}
