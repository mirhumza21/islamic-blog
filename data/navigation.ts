export type NavChild = {
  label: string;
  href: string;
  description?: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Blogs", href: "/blog" },
  {
    label: "Guides",
    href: "/category/umrah-guides",
    children: [
      { label: "Umrah Guides", href: "/category/umrah-guides", description: "Step-by-step preparation" },
      { label: "Travel Tips", href: "/category/travel-tips", description: "Flights, packing, and arrival" },
      { label: "Tips & Advice", href: "/category/tips-advice", description: "Common mistakes to avoid" },
    ],
  },
  {
    label: "Hajj",
    href: "/category/hajj",
    children: [
      { label: "Hajj Guides", href: "/category/hajj", description: "The greater journey" },
      { label: "Umrah Guides", href: "/category/umrah-guides", description: "Step-by-step help" },
      { label: "Travel Tips", href: "/category/travel-tips", description: "Practical journey advice" },
    ],
  },
  {
    label: "Quran & Duas",
    href: "/category/quran-duas",
    children: [
      { label: "Quran & Duas", href: "/category/quran-duas", description: "Spiritual guidance" },
      { label: "Islamic Lifestyle", href: "/category/islamic-lifestyle", description: "Everyday inspiration" },
    ],
  },
  {
    label: "Islamic Lifestyle",
    href: "/category/islamic-lifestyle",
    children: [
      { label: "Islamic Lifestyle", href: "/category/islamic-lifestyle", description: "Live your deen daily" },
      { label: "Real Stories", href: "/category/real-stories", description: "Stories and inspiration" },
      { label: "Quran & Duas", href: "/category/quran-duas", description: "Nourish the heart" },
    ],
  },
  { label: "About", href: "/about" },
];

export const HERO_SLIDE_SPECS = {
  width: 2400,
  height: 1350,
  minWidth: 1920,
  minHeight: 1080,
  aspectLabel: "16:9",
  maxSizeMB: 2,
  formats: "JPG or WebP",
};

export const heroContent = {
  eyebrow: "Faith • Knowledge • A Better You",
  titleLines: ["Guidance for", "Every Step of"],
  titleAccent: "Your Journey",
  description:
    "Inspiring blogs, practical guides and authentic knowledge to help you prepare for Umrah and grow closer to Allah.",
  primaryCta: {
    label: "Explore Latest Articles",
    href: "/blog",
  },
  secondaryCta: {
    label: "Browse Umrah Guides",
    href: "/category/umrah-guides",
  },
  quote: {
    arabic: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا ۚ",
    text: "And those who strive for Us — We will surely guide them to Our ways.",
    reference: "Qur'an 29:69",
  },
  verses: [
    {
      arabic: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا ۚ",
      text: "And those who strive for Us — We will surely guide them to Our ways.",
      reference: "Qur'an 29:69",
    },
    {
      arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ",
      text: "And when My servants ask you concerning Me — indeed I am near.",
      reference: "Qur'an 2:186",
    },
    {
      arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      text: "For indeed, with hardship comes ease. Indeed, with hardship comes ease.",
      reference: "Qur'an 94:5-6",
    },
    {
      arabic: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ",
      text: "My success is not but through Allah. Upon Him I rely, and to Him I return.",
      reference: "Qur'an 11:88",
    },
    {
      arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ۗ",
      text: "Unquestionably, by the remembrance of Allah hearts find peace.",
      reference: "Qur'an 13:28",
    },
  ],
  image: {
    src: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=2400&h=1500&q=90",
    alt: "Al-Masjid an-Nabawi in Madinah at sunset with minarets and the green dome",
    caption: "Al-Masjid an-Nabawi · al-Madinah",
    objectPosition: "72% 46%",
  },
  slides: [
    {
      src: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=2400&h=1500&q=90",
      alt: "Al-Masjid an-Nabawi in Madinah at sunset with minarets and the green dome",
      caption: "Al-Masjid an-Nabawi · al-Madinah",
      objectPosition: "72% 46%",
    },
    {
      src: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=2400&h=1500&q=90",
      alt: "The Kaaba at Masjid al-Haram in Makkah surrounded by pilgrims",
      caption: "Al-Masjid al-Haram · Makkah",
      objectPosition: "50% 45%",
    },
    {
      src: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=2400&h=1500&q=90",
      alt: "Open mushaf of the Noble Quran with gold-edged pages",
      caption: "The Noble Qur'an · Light for the path",
      objectPosition: "50% 50%",
    },
    {
      src: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=2400&h=1500&q=90",
      alt: "Grand Islamic arches and lanterns in soft golden light",
      caption: "Sacred Heritage · Spiritual Solace",
      objectPosition: "50% 50%",
    },
  ],
  dockItems: [
    {
      title: "UMRAH PREPARATION",
      subtitle: "Plan with purpose",
      href: "/category/umrah-guides",
      icon: "compass",
    },
    {
      title: "SPIRITUAL GROWTH",
      subtitle: "Nourish your heart",
      href: "/category/quran-duas",
      icon: "book",
    },
    {
      title: "DUAS & REMEMBRANCE",
      subtitle: "Closer to Allah",
      href: "/category/quran-duas",
      icon: "heart",
    },
    {
      title: "TRAVEL & TIPS",
      subtitle: "Practical guidance",
      href: "/category/travel-tips",
      icon: "luggage",
    },
    {
      title: "REFLECTIONS",
      subtitle: "Stories & inspiration",
      href: "/category/real-stories",
      icon: "pen",
    },
    {
      title: "LIFESTYLE",
      subtitle: "Live your deen",
      href: "/category/islamic-lifestyle",
      icon: "sparkles",
    },
  ],
  trustItems: [
    {
      title: "Authentic & Trustworthy",
      description: "Based on reliable sources",
      icon: "book" as const,
    },
    {
      title: "Easy to Understand",
      description: "Clear and practical content",
      icon: "users" as const,
    },
    {
      title: "Practical Guidance",
      description: "For your real journey",
      icon: "star" as const,
    },
    {
      title: "Inspiration for Everyday Muslims",
      description: "Faith beyond the journey",
      icon: "heart" as const,
    },
  ],
};
