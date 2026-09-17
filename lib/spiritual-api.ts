import { curatedDuas, DuaItem, namesOfAllah, NameOfAllah } from "@/data/islamic-data";

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
}

// Helper to compute day of year (1 to 365)
function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// Fetch real Word / Name of the Day from Aladhan Asmaul Husna API
export async function fetchLiveWordOfTheDay(date: Date = new Date()): Promise<LiveDailyWord> {
  const dayOfYear = getDayOfYear(date);
  const fallbackIndex = dayOfYear % namesOfAllah.length;
  const fallback = namesOfAllah[fallbackIndex] || namesOfAllah[0];

  try {
    const targetNumber = ((dayOfYear - 1) % 99) + 1;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://api.aladhan.com/v1/asmaAlHusna/${targetNumber}`, {
      signal: controller.signal,
      next: { revalidate: 86400 },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return { ...fallback, isLive: false };
    }

    const json = await res.json();
    if (json.code === 200 && json.data && json.data[0]) {
      const item = json.data[0];
      return {
        number: item.number,
        arabic: item.name,
        transliteration: item.transliteration.toUpperCase(),
        meaning: item.en?.meaning || fallback.meaning,
        explanation: fallback.explanation,
        isLive: true,
      };
    }
    return { ...fallback, isLive: false };
  } catch {
    return { ...fallback, isLive: false };
  }
}

// Fetch real Dua / Verse of the Day from Quran & Hadith Cloud API
export async function fetchLiveDuaOfTheDay(date: Date = new Date()): Promise<LiveDailyDua> {
  const dayOfYear = getDayOfYear(date);
  const fallbackIndex = dayOfYear % curatedDuas.length;
  const fallback = curatedDuas[fallbackIndex] || curatedDuas[0];

  // Specific Quranic Duas (Ayah IDs that are supplications)
  const duaAyahs = [
    { ayah: 201, surah: "Surah Al-Baqarah 2:201", category: "Guidance", title: "Dua for Good in this Life & Hereafter" },
    { ayah: 286, surah: "Surah Al-Baqarah 2:286", category: "Forgiveness", title: "Dua for Forgiveness & Protection" },
    { ayah: 358, surah: "Surah Ali 'Imran 3:8", category: "Guidance", title: "Dua for Steadfastness of Heart" },
    { ayah: 376, surah: "Surah Ali 'Imran 3:26", category: "Praise", title: "Dua Acknowledging Allah's Sovereignty" },
    { ayah: 1054, surah: "Surah Al-A'raf 7:23", category: "Forgiveness", title: "Dua of Adam & Hawwa for Mercy" },
    { ayah: 1918, surah: "Surah Ibrahim 14:40", category: "Prayer", title: "Dua for Establishing Regular Prayer" },
    { ayah: 2154, surah: "Surah Al-Isra 17:24", category: "Family", title: "Dua of Mercy for Parents" },
    { ayah: 2424, surah: "Surah Ta-Ha 20:114", category: "Knowledge", title: "Dua for Increase in Beneficial Knowledge" },
    { ayah: 2714, surah: "Surah Al-Furqan 25:74", category: "Family", title: "Dua for Comfort in Spouse & Children" },
    { ayah: 3000, surah: "Surah Ash-Shu'ara 26:83", category: "Wisdom", title: "Dua of Ibrahim for Wisdom and Righteous Companionship" }
  ];

  const target = duaAyahs[dayOfYear % duaAyahs.length];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://api.alquran.cloud/v1/ayah/${target.ayah}/editions/quran-uthmani,en.sahih`, {
      signal: controller.signal,
      next: { revalidate: 86400 },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return { ...fallback, isLive: false };
    }

    const json = await res.json();
    if (json.code === 200 && Array.isArray(json.data) && json.data.length >= 2) {
      const arabicAyah = json.data[0].text;
      const translation = json.data[1].text;

      return {
        id: `live-ayah-${target.ayah}`,
        category: target.category,
        title: target.title,
        arabic: arabicAyah,
        transliteration: fallback.transliteration,
        translation: translation,
        reference: target.surah,
        isLive: true,
      };
    }
    return { ...fallback, isLive: false };
  } catch {
    return { ...fallback, isLive: false };
  }
}
