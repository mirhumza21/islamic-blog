export interface DuaItem {
  id: string;
  category: "Health" | "Guidance" | "Forgiveness" | "Protection" | "Morning & Evening" | "Travel";
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}

export interface NameOfAllah {
  number: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  explanation: string;
}

export interface IslamicEvent {
  id: string;
  name: string;
  hijriDate: string;
  hijriMonth: number; // 1 to 12
  hijriDay: number;
  description: string;
  targetDate: string; // ISO date string for countdown target
  badge?: string;
}

export interface PrayerCity {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
  method: "Karachi" | "UmmAlQura" | "MWL" | "ISNA" | "Egypt";
}

export const prayerCities: PrayerCity[] = [
  { id: "lahore", name: "Lahore", country: "Pakistan", lat: 31.5204, lng: 74.3587, timezone: "Asia/Karachi", method: "Karachi" },
  { id: "karachi", name: "Karachi", country: "Pakistan", lat: 24.8607, lng: 67.0011, timezone: "Asia/Karachi", method: "Karachi" },
  { id: "islamabad", name: "Islamabad", country: "Pakistan", lat: 33.6844, lng: 73.0479, timezone: "Asia/Karachi", method: "Karachi" },
  { id: "makkah", name: "Makkah", country: "Saudi Arabia", lat: 21.3891, lng: 39.8579, timezone: "Asia/Riyadh", method: "UmmAlQura" },
  { id: "madinah", name: "Madinah", country: "Saudi Arabia", lat: 24.5247, lng: 39.5692, timezone: "Asia/Riyadh", method: "UmmAlQura" },
  { id: "dubai", name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, timezone: "Asia/Dubai", method: "UmmAlQura" },
  { id: "london", name: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, timezone: "Europe/London", method: "MWL" },
  { id: "newyork", name: "New York", country: "United States", lat: 40.7128, lng: -74.0060, timezone: "America/New_York", method: "ISNA" },
  { id: "istanbul", name: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784, timezone: "Europe/Istanbul", method: "MWL" },
  { id: "cairo", name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357, timezone: "Africa/Cairo", method: "Egypt" },
  { id: "toronto", name: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, timezone: "America/Toronto", method: "ISNA" },
  { id: "kualalumpur", name: "Kuala Lumpur", country: "Malaysia", lat: 3.1390, lng: 101.6869, timezone: "Asia/Kuala_Lumpur", method: "MWL" }
];

export const curatedDuas: DuaItem[] = [
  {
    id: "dua-health",
    category: "Health",
    title: "Dua for Health in Body, Hearing & Sight",
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي",
    transliteration: "Allahumma 'afini fi badani, fi sam'i, fi basari",
    translation: "O Allah, grant me health in my body, my hearing, and my sight.",
    reference: "ABU DAWUD: 5090"
  },
  {
    id: "dua-guidance",
    category: "Guidance",
    title: "Dua for Beneficial Knowledge & Sustenance",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا",
    transliteration: "Allahumma inni as'aluka 'ilman nafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan",
    translation: "O Allah, I ask You for beneficial knowledge, good and pure provision, and deeds that are accepted.",
    reference: "IBN MAJAH: 925"
  },
  {
    id: "dua-forgiveness",
    category: "Forgiveness",
    title: "Sayyid al-Istighfar (Chief Supplication for Forgiveness)",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ",
    transliteration: "Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika ma stata'tu",
    translation: "O Allah, You are my Lord; none has the right to be worshipped but You. You created me and I am Your servant, and I remain upon Your covenant as best as I am able.",
    reference: "SAHIH AL-BUKHARI: 6306"
  },
  {
    id: "dua-protection",
    category: "Protection",
    title: "Dua Against Harm & Evil",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Bismillahil-ladhi la yadurru ma'as-mihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim",
    translation: "In the Name of Allah with Whose Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.",
    reference: "AT-TIRMIDHI: 3388"
  },
  {
    id: "dua-travel",
    category: "Travel",
    title: "Supplication for Traveling (Safar)",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    transliteration: "Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun",
    translation: "Glory be to Him Who has brought this under our control though we were unable to subdue it, and to our Lord we shall return.",
    reference: "SURAH AZ-ZUKHRUF: 13-14"
  },
  {
    id: "dua-anxiety",
    category: "Protection",
    title: "Dua for Relief from Worry and Grief",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْجُبْنِ وَالْبُخْلِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazani, wal-'ajzi wal-kasali, wal-jubni wal-bukhli, wa dala'id-dayni wa ghalabatir-rijal",
    translation: "O Allah, I seek refuge in You from anxiety and grief, weakness and laziness, miserliness and cowardice, the burden of debts, and being overpowered by men.",
    reference: "SAHIH AL-BUKHARI: 2893"
  }
];

export const namesOfAllah: NameOfAllah[] = [
  {
    number: 1,
    arabic: "حَسَن",
    transliteration: "HASSAN",
    meaning: "Handsome, Virtuous",
    explanation: "Embodying moral excellence, physical grace, and high character. Grandson of the Prophet ﷺ; embodies beauty and goodness."
  },
  {
    number: 2,
    arabic: "الرَّحْمَٰنُ",
    transliteration: "AR-RAHMAN",
    meaning: "The All-Merciful",
    explanation: "The One Who possesses vast, boundless, and all-encompassing mercy towards all of creation in this world."
  },
  {
    number: 3,
    arabic: "الرَّحِيمُ",
    transliteration: "AR-RAHEEM",
    meaning: "The Especially Merciful",
    explanation: "The One Who grants continuous, specialized mercy to the believers, particularly on the Day of Judgment."
  },
  {
    number: 4,
    arabic: "الْمَلِكُ",
    transliteration: "AL-MALIK",
    meaning: "The Sovereign King",
    explanation: "The Absolute Ruler, Master, and Owner of the universe, with supreme authority over all creation."
  },
  {
    number: 5,
    arabic: "الْقُدُّوسُ",
    transliteration: "AL-QUDDUS",
    meaning: "The Most Holy",
    explanation: "The One Who is pure, spotless, and completely free from any imperfection, error, or fault."
  },
  {
    number: 6,
    arabic: "السَّلَامُ",
    transliteration: "AS-SALAM",
    meaning: "The Source of Peace",
    explanation: "The One Who is free from all flaws and the granter of safety, tranquility, and peace to His servants."
  },
  {
    number: 7,
    arabic: "الْمُؤْمِنُ",
    transliteration: "AL-MU'MIN",
    meaning: "The Granter of Security",
    explanation: "The One Who inspires faith in believers and provides ultimate sanctuary, safety, and truthfulness."
  },
  {
    number: 8,
    arabic: "الْعَزِيزُ",
    transliteration: "AL-AZIZ",
    meaning: "The Almighty & Invincible",
    explanation: "The All-Powerful and Majestic, Who cannot be defeated, yet governs with wisdom and justice."
  },
  {
    number: 9,
    arabic: "الْغَفَّارُ",
    transliteration: "AL-GHAFFAR",
    meaning: "The Perpetual Forgiver",
    explanation: "The One Who repeatedly forgives the faults and sins of His servants whenever they turn back in sincere repentance."
  },
  {
    number: 10,
    arabic: "الرَّزَّاقُ",
    transliteration: "AR-RAZZAQ",
    meaning: "The All-Provider",
    explanation: "The Sustainer Who creates all provisions and distributes sustenance to every living soul."
  }
];

export const upcomingIslamicEvents: IslamicEvent[] = [
  {
    id: "ramadan",
    name: "Ramadan 1448 AH",
    hijriDate: "1 Ramadan 1448 AH",
    hijriMonth: 9,
    hijriDay: 1,
    description: "The blessed month of fasting, Qur'anic revelation, and immense spiritual purification.",
    targetDate: "2027-02-08T00:00:00Z",
    badge: "Major Milestone"
  },
  {
    id: "laylatul-qadr",
    name: "Laylatul Qadr (Night of Power)",
    hijriDate: "27 Ramadan 1448 AH",
    hijriMonth: 9,
    hijriDay: 27,
    description: "Better than a thousand months. Seek forgiveness and engage in fervent nightly devotion.",
    targetDate: "2027-03-06T00:00:00Z",
    badge: "Sacred Night"
  },
  {
    id: "eid-al-fitr",
    name: "Eid al-Fitr",
    hijriDate: "1 Shawwal 1448 AH",
    hijriMonth: 10,
    hijriDay: 1,
    description: "The joyous celebration of gratitude marking the conclusion of Ramadan fasting.",
    targetDate: "2027-03-10T00:00:00Z",
    badge: "Eid Celebration"
  },
  {
    id: "day-of-arafah",
    name: "Day of Arafah",
    hijriDate: "9 Dhul Hijjah 1448 AH",
    hijriMonth: 12,
    hijriDay: 9,
    description: "The pinnacle of Hajj. Recommended Sunnah fasting expiates sins of the past and coming year.",
    targetDate: "2027-05-16T00:00:00Z",
    badge: "Virtuous Day"
  },
  {
    id: "eid-al-adha",
    name: "Eid al-Adha",
    hijriDate: "10 Dhul Hijjah 1448 AH",
    hijriMonth: 12,
    hijriDay: 10,
    description: "The Feast of Sacrifice honoring the supreme devotion of Prophet Ibrahim (AS).",
    targetDate: "2027-05-17T00:00:00Z",
    badge: "Eid Celebration"
  }
];
