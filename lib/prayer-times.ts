import { PrayerCity } from "@/data/islamic-data";

export interface PrayerTimeSchedule {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  sunset: string;
  maghrib: string;
  isha: string;
  midnight: string;
  lastThird: string;
  // Raw Date objects for internal calculations
  rawDates: {
    fajr: Date;
    sunrise: Date;
    dhuhr: Date;
    asr: Date;
    maghrib: Date;
    isha: Date;
    nextFajr: Date;
  };
}

export interface LiveHijriInfo {
  day: string;
  monthName: string;
  monthNumber: number;
  year: string;
  readableDate: string;
  holidays: string[];
}

export type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export interface CurrentPrayerStatus {
  currentPrayer: PrayerKey;
  currentPrayerName: string;
  nextPrayer: PrayerKey;
  nextPrayerName: string;
  nextPrayerTime: string;
  timeRemainingSeconds: number;
  timeRemainingFormatted: string;
}

// Map city calculation method to Aladhan API method IDs
const methodIdMap: Record<PrayerCity["method"], number> = {
  Karachi: 1,
  ISNA: 2,
  MWL: 3,
  UmmAlQura: 4,
  Egypt: 5,
};

function toRad(deg: number): number {
  return (deg * Math.PI) / 180.0;
}

function toDeg(rad: number): number {
  return (rad * 180.0) / Math.PI;
}

function normalize(value: number, max: number): number {
  let val = value - max * Math.floor(value / max);
  if (val < 0) val += max;
  return val;
}

function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = hours < 10 ? `0${hours}` : `${hours}`;
  const strMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${strHours}:${strMinutes} ${ampm}`;
}

function convert24to12(time24: string): string {
  if (!time24) return "";
  const parts = time24.split(" ")[0].split(":");
  if (parts.length < 2) return time24;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = hours < 10 ? `0${hours}` : `${hours}`;
  return `${strHours}:${minutes} ${ampm}`;
}

function parseTimeToDate(time24: string, baseDate: Date = new Date()): Date {
  const d = new Date(baseDate);
  const parts = time24.split(" ")[0].split(":");
  if (parts.length >= 2) {
    d.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);
  }
  return d;
}

// Fallback solar astronomical calculation
export function calculatePrayerTimes(city: PrayerCity, date: Date = new Date()): PrayerTimeSchedule {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  const d = jd - 2451545.0;

  const q = normalize(280.459 + 0.98564736 * d, 360);
  const g = normalize(357.529 + 0.98560028 * d, 360);
  const L = normalize(q + 1.915 * Math.sin(toRad(g)) + 0.02 * Math.sin(toRad(2 * g)), 360);
  const e = 23.439 - 0.00000036 * d;

  const sinDec = Math.sin(toRad(e)) * Math.sin(toRad(L));
  const dec = Math.asin(sinDec);
  const cosDec = Math.cos(dec);

  const RA = toDeg(Math.atan2(Math.cos(toRad(e)) * Math.sin(toRad(L)), Math.cos(toRad(L)))) / 15.0;
  const eqt = (q / 15.0 - normalize(RA, 24)) * 60;

  let fajrAngle = 18.0;
  let ishaAngle = 18.0;
  let ishaIntervalMin: number | null = null;

  if (city.method === "UmmAlQura") {
    fajrAngle = 18.5;
    ishaIntervalMin = 90;
  } else if (city.method === "ISNA") {
    fajrAngle = 15.0;
    ishaAngle = 15.0;
  } else if (city.method === "MWL") {
    fajrAngle = 18.0;
    ishaAngle = 17.0;
  } else if (city.method === "Egypt") {
    fajrAngle = 19.5;
    ishaAngle = 17.5;
  }

  const baseDhuhrUtcMinutes = 720 - city.lng * 4 - eqt;

  const tzOffsets: Record<string, number> = {
    "Asia/Karachi": 300,
    "Asia/Riyadh": 180,
    "Asia/Dubai": 240,
    "Europe/London": 60,
    "America/New_York": -240,
    "Europe/Istanbul": 180,
    "Africa/Cairo": 180,
    "America/Toronto": -240,
    "Asia/Kuala_Lumpur": 480,
  };

  const tzOffset = tzOffsets[city.timezone] ?? 300;
  const dhuhrLocalMin = baseDhuhrUtcMinutes + tzOffset;

  const hourAngle = (angle: number): number => {
    const latRad = toRad(city.lat);
    const cosHA =
      (-Math.sin(toRad(angle)) - Math.sin(latRad) * sinDec) / (Math.cos(latRad) * cosDec);
    if (cosHA > 1) return 0;
    if (cosHA < -1) return 180;
    return toDeg(Math.acos(cosHA));
  };

  const latRad = toRad(city.lat);
  const asrAngle = toDeg(
    Math.atan(1 / (1 + Math.tan(Math.abs(latRad - dec))))
  );
  const asrHA = hourAngle(90 - asrAngle);

  const sunriseHA = hourAngle(0.833);
  const fajrHA = hourAngle(fajrAngle);
  const ishaHA = hourAngle(ishaAngle);

  const fajrLocalMin = dhuhrLocalMin - (fajrHA * 4);
  const sunriseLocalMin = dhuhrLocalMin - (sunriseHA * 4);
  const asrLocalMin = dhuhrLocalMin + (asrHA * 4);
  const sunsetLocalMin = dhuhrLocalMin + (sunriseHA * 4);
  const maghribLocalMin = sunsetLocalMin + 2;
  const ishaLocalMin = ishaIntervalMin
    ? maghribLocalMin + ishaIntervalMin
    : dhuhrLocalMin + (ishaHA * 4);

  const makeDate = (totalMinutes: number, addDays: number = 0): Date => {
    const dObj = new Date(date);
    dObj.setDate(dObj.getDate() + addDays);
    const normalizedMin = normalize(totalMinutes, 1440);
    const h = Math.floor(normalizedMin / 60);
    const m = Math.floor(normalizedMin % 60);
    dObj.setHours(h, m, 0, 0);
    return dObj;
  };

  const fajrDate = makeDate(fajrLocalMin);
  const sunriseDate = makeDate(sunriseLocalMin);
  const dhuhrDate = makeDate(dhuhrLocalMin);
  const asrDate = makeDate(asrLocalMin);
  const sunsetDate = makeDate(sunsetLocalMin);
  const maghribDate = makeDate(maghribLocalMin);
  const ishaDate = makeDate(ishaLocalMin);
  const nextFajrDate = makeDate(fajrLocalMin, 1);

  const nightDurationMs = nextFajrDate.getTime() - maghribDate.getTime();
  const midnightDate = new Date(maghribDate.getTime() + nightDurationMs / 2);
  const lastThirdDate = new Date(maghribDate.getTime() + (nightDurationMs * 2) / 3);

  return {
    fajr: formatTime(fajrDate),
    sunrise: formatTime(sunriseDate),
    dhuhr: formatTime(dhuhrDate),
    asr: formatTime(asrDate),
    sunset: formatTime(sunsetDate),
    maghrib: formatTime(maghribDate),
    isha: formatTime(ishaDate),
    midnight: formatTime(midnightDate),
    lastThird: formatTime(lastThirdDate),
    rawDates: {
      fajr: fajrDate,
      sunrise: sunriseDate,
      dhuhr: dhuhrDate,
      asr: asrDate,
      maghrib: maghribDate,
      isha: ishaDate,
      nextFajr: nextFajrDate,
    },
  };
}

// REAL LIVE API Integration (Aladhan Global Islamic API)
export async function fetchLivePrayerData(
  city: PrayerCity,
  date: Date = new Date()
): Promise<{ schedule: PrayerTimeSchedule; hijri: LiveHijriInfo }> {
  const fallbackSchedule = calculatePrayerTimes(city, date);
  const fallbackHijri: LiveHijriInfo = {
    day: "5",
    monthName: "Rabīʿ al-thānī",
    monthNumber: 4,
    year: "1448",
    readableDate: "5 Rabīʿ al-thānī 1448 AH",
    holidays: [],
  };

  try {
    const dayStr = String(date.getDate()).padStart(2, "0");
    const monthStr = String(date.getMonth() + 1).padStart(2, "0");
    const yearStr = date.getFullYear();
    const methodId = methodIdMap[city.method] ?? 1;

    const url = `https://api.aladhan.com/v1/timingsByCity/${dayStr}-${monthStr}-${yearStr}?city=${encodeURIComponent(
      city.name
    )}&country=${encodeURIComponent(city.country)}&method=${methodId}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return { schedule: fallbackSchedule, hijri: fallbackHijri };
    }

    const json = await res.json();
    if (json.code !== 200 || !json.data?.timings) {
      return { schedule: fallbackSchedule, hijri: fallbackHijri };
    }

    const t = json.data.timings;
    const h = json.data.date?.hijri;

    const fajrDate = parseTimeToDate(t.Fajr, date);
    const sunriseDate = parseTimeToDate(t.Sunrise, date);
    const dhuhrDate = parseTimeToDate(t.Dhuhr, date);
    const asrDate = parseTimeToDate(t.Asr, date);
    const sunsetDate = parseTimeToDate(t.Sunset, date);
    const maghribDate = parseTimeToDate(t.Maghrib, date);
    const ishaDate = parseTimeToDate(t.Isha, date);

    // Calculate tomorrow's Fajr for accurate countdowns
    const nextFajrDate = new Date(fajrDate);
    nextFajrDate.setDate(nextFajrDate.getDate() + 1);

    const schedule: PrayerTimeSchedule = {
      fajr: convert24to12(t.Fajr),
      sunrise: convert24to12(t.Sunrise),
      dhuhr: convert24to12(t.Dhuhr),
      asr: convert24to12(t.Asr),
      sunset: convert24to12(t.Sunset),
      maghrib: convert24to12(t.Maghrib),
      isha: convert24to12(t.Isha),
      midnight: convert24to12(t.Midnight || "23:57"),
      lastThird: convert24to12(t.Lastthird || "02:15"),
      rawDates: {
        fajr: fajrDate,
        sunrise: sunriseDate,
        dhuhr: dhuhrDate,
        asr: asrDate,
        maghrib: maghribDate,
        isha: ishaDate,
        nextFajr: nextFajrDate,
      },
    };

    const hijri: LiveHijriInfo = {
      day: h?.day ?? "5",
      monthName: h?.month?.en ?? "Rabīʿ al-thānī",
      monthNumber: h?.month?.number ?? 4,
      year: h?.year ?? "1448",
      readableDate: `${h?.day ?? "5"} ${h?.month?.en ?? "Rabīʿ al-thānī"} ${h?.year ?? "1448"} AH`,
      holidays: h?.holidays ?? [],
    };

    return { schedule, hijri };
  } catch {
    return { schedule: fallbackSchedule, hijri: fallbackHijri };
  }
}

export function getCurrentPrayerStatus(schedule: PrayerTimeSchedule, now: Date = new Date()): CurrentPrayerStatus {
  const { fajr, dhuhr, asr, maghrib, isha, nextFajr } = schedule.rawDates;
  const nowMs = now.getTime();

  let currentPrayer: PrayerKey = "isha";
  let currentPrayerName = "Isha";
  let nextPrayer: PrayerKey = "fajr";
  let nextPrayerName = "Fajr";
  let nextTarget = nextFajr;

  if (nowMs < fajr.getTime()) {
    currentPrayer = "isha";
    currentPrayerName = "Isha";
    nextPrayer = "fajr";
    nextPrayerName = "Fajr";
    nextTarget = fajr;
  } else if (nowMs < dhuhr.getTime()) {
    currentPrayer = "fajr";
    currentPrayerName = "Fajr";
    nextPrayer = "dhuhr";
    nextPrayerName = "Dhuhr";
    nextTarget = dhuhr;
  } else if (nowMs < asr.getTime()) {
    currentPrayer = "dhuhr";
    currentPrayerName = "Dhuhr";
    nextPrayer = "asr";
    nextPrayerName = "Asr";
    nextTarget = asr;
  } else if (nowMs < maghrib.getTime()) {
    currentPrayer = "asr";
    currentPrayerName = "Asr";
    nextPrayer = "maghrib";
    nextPrayerName = "Maghrib";
    nextTarget = maghrib;
  } else if (nowMs < isha.getTime()) {
    currentPrayer = "maghrib";
    currentPrayerName = "Maghrib";
    nextPrayer = "isha";
    nextPrayerName = "Isha";
    nextTarget = isha;
  } else {
    currentPrayer = "isha";
    currentPrayerName = "Isha";
    nextPrayer = "fajr";
    nextPrayerName = "Fajr";
    nextTarget = nextFajr;
  }

  const diffMs = Math.max(0, nextTarget.getTime() - nowMs);
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  let formatted = "";
  if (hours > 0) {
    formatted = `${hours}h ${minutes}m`;
  } else {
    formatted = `${minutes}m`;
  }

  return {
    currentPrayer,
    currentPrayerName,
    nextPrayer,
    nextPrayerName,
    nextPrayerTime: schedule[nextPrayer],
    timeRemainingSeconds: totalSeconds,
    timeRemainingFormatted: formatted,
  };
}
