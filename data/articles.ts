import type { Article } from "@/types/blog";

/**
 * Sample content layer — replace with CMS later (Sanity, Strapi, Payload, etc.).
 * Quran/Hadith blocks below are DEMO placeholders only. Replace with verified sources before production publishing.
 */
export const articles: Article[] = [
  {
    id: "1",
    slug: "complete-guide-to-performing-umrah",
    title: "A Complete Guide to Performing Umrah Step by Step",
    excerpt:
      "Everything you need to know about Umrah — from preparation to return — explained through a simple and practical guide.",
    categorySlug: "umrah-guides",
    authorId: "ayesha-khan",
    publishedAt: "2025-11-12",
    updatedAt: "2026-01-08",
    readingTime: 12,
    image:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1600&q=80",
    imageAlt: "The Kaaba at Masjid al-Haram during soft evening light",
    featured: true,
    popular: true,
    popularRank: 1,
    tags: ["umrah", "guide", "rituals"],
    seo: {
      title: "Complete Guide to Performing Umrah Step by Step | UmrahZone",
      description:
        "A clear, practical Umrah guide covering preparation, Ihram, Tawaf, Sa’i, and returning home with confidence.",
    },
    content: [
      {
        type: "paragraph",
        text: "Umrah is a beautiful opportunity to renew your intention, seek forgiveness, and draw closer to Allah. This guide walks you through the journey in a calm, practical order — so you can focus on worship rather than uncertainty.",
      },
      {
        type: "heading",
        level: 2,
        text: "Before You Begin: Intention and Preparation",
        id: "preparation",
      },
      {
        type: "paragraph",
        text: "Start with a sincere intention (niyyah). Learn the basic rites, arrange travel documents early, and prepare mentally for crowds, walking, and moments of quiet reflection.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Practical tip",
        text: "Create a simple checklist for documents, medications, ihram clothing, and a small pouch for pebbles or personal items you may need near the Haram.",
      },
      {
        type: "heading",
        level: 2,
        text: "Entering the State of Ihram",
        id: "ihram",
      },
      {
        type: "paragraph",
        text: "Ihram begins at the designated miqat. Men wear the two white sheets; women wear modest clothing that meets Islamic guidelines. Make your intention for Umrah and recite the Talbiyah.",
      },
      {
        type: "list",
        style: "ordered",
        items: [
          "Perform ghusl if possible before wearing Ihram.",
          "Put on Ihram clothing at or before the miqat.",
          "Make the intention for Umrah.",
          "Begin reciting the Talbiyah with humility.",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Tawaf Around the Kaaba",
        id: "tawaf",
      },
      {
        type: "paragraph",
        text: "Tawaf consists of seven circuits around the Kaaba, beginning at the Black Stone corner and keeping the Kaaba on your left. Move with patience, protect others from harm, and keep your heart engaged in remembrance.",
      },
      {
        type: "quran",
        arabic: "[Demo Arabic text — replace with verified mushaf text]",
        translation:
          "[Demo translation placeholder — verify against an authentic Quran translation before publishing.]",
        surah: "Demo Surah",
        ayah: "0:0",
        note: "Demo placeholder for layout only. Do not treat as a real Quranic quotation.",
      },
      {
        type: "heading",
        level: 2,
        text: "Sa’i Between Safa and Marwah",
        id: "sai",
      },
      {
        type: "paragraph",
        text: "After Tawaf and the two units of prayer (where appropriate), proceed to Sa’i. Begin at Safa, face the Kaaba for dua, then walk toward Marwah. Complete seven lengths with presence of heart.",
      },
      {
        type: "heading",
        level: 2,
        text: "Halq or Taqsir and Completing Umrah",
        id: "completion",
      },
      {
        type: "paragraph",
        text: "Men typically shave or shorten the hair; women shorten a small portion. With this, your Umrah is complete. Take time afterward for gratitude, quiet dua, and reflection on what you hope to carry home.",
      },
      {
        type: "callout",
        variant: "note",
        title: "Editorial note",
        text: "Ritual details can vary by school of thought. When in doubt, consult a trusted scholar or your local guide for your specific situation.",
      },
      {
        type: "faq",
        items: [
          {
            question: "How long does Umrah usually take?",
            answer:
              "Many pilgrims complete the rites in a few hours, but timing depends on crowds, fitness, and whether you rest between steps.",
          },
          {
            question: "Can I perform Umrah more than once in one trip?",
            answer:
              "Some pilgrims do so after exiting Ihram and returning to a miqat. Seek reliable scholarly guidance for your circumstances.",
          },
          {
            question: "What if I feel overwhelmed in the Haram?",
            answer:
              "Step aside when safe, hydrate, make shorter duas, and remember that sincerity matters more than rushing through every recommended act.",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    slug: "building-good-habits-before-your-umrah",
    title: "Building Good Habits Before Your Umrah",
    excerpt:
      "Strengthen your daily worship, character, and mindset before you travel so your Umrah begins with a prepared heart.",
    categorySlug: "islamic-lifestyle",
    authorId: "fatima-zahra",
    publishedAt: "2025-10-28",
    readingTime: 7,
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200&q=80",
    imageAlt: "Peaceful mosque courtyard at dusk",
    popular: true,
    popularRank: 3,
    tags: ["habits", "preparation", "lifestyle"],
    content: [
      {
        type: "paragraph",
        text: "Umrah is not only a destination — it is a spiritual season. The habits you build before travel often shape the quality of your worship once you arrive.",
      },
      {
        type: "heading",
        level: 2,
        text: "Start With Prayer Consistency",
        id: "prayer",
      },
      {
        type: "paragraph",
        text: "Protect the five daily prayers. If possible, begin praying some sunnah prayers and lengthen your quiet moments after salah with short, sincere duas.",
      },
      {
        type: "heading",
        level: 2,
        text: "Reduce Distractions Gently",
        id: "distractions",
      },
      {
        type: "list",
        style: "unordered",
        items: [
          "Limit unnecessary scrolling in the evenings.",
          "Replace one entertainment session with Quran listening.",
          "Practice patience in small daily frustrations.",
          "Keep a gratitude note each night for one week.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Small steps",
        text: "Choose two habits only. Consistency beats intensity — especially in the weeks before travel.",
      },
    ],
  },
  {
    id: "3",
    slug: "powerful-duas-for-a-blessed-journey",
    title: "Powerful Duas for a Blessed Journey",
    excerpt:
      "A calm collection of travel and journey duas to recite with presence before and during your trip.",
    categorySlug: "quran-duas",
    authorId: "yusuf-ahmed",
    publishedAt: "2025-10-14",
    readingTime: 6,
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1200&q=80",
    imageAlt: "Open Quran pages with soft natural light",
    popular: true,
    popularRank: 2,
    tags: ["duas", "travel"],
    content: [
      {
        type: "paragraph",
        text: "Dua turns travel into worship. Recite with understanding where possible, and keep your heart soft whether your journey is smooth or delayed.",
      },
      {
        type: "heading",
        level: 2,
        text: "Before Leaving Home",
        id: "before-leaving",
      },
      {
        type: "dua",
        title: "Travel dua (demo placeholder)",
        arabic: "[Demo Arabic — replace with verified dua text]",
        transliteration: "[Demo transliteration]",
        translation:
          "[Demo English meaning — verify with a reliable Islamic source before publishing.]",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Authenticity reminder",
        text: "The Arabic and translation above are layout placeholders only. Always confirm duas from trusted books or scholars before sharing publicly.",
      },
      {
        type: "heading",
        level: 2,
        text: "During Your Journey",
        id: "during",
      },
      {
        type: "paragraph",
        text: "Keep short remembrances on your tongue: seeking protection, expressing gratitude, and asking Allah for ease, safety, and an accepted Umrah.",
      },
    ],
  },
  {
    id: "4",
    slug: "travel-tips-for-a-smooth-umrah-trip",
    title: "Travel Tips for a Smooth Umrah Trip",
    excerpt:
      "Practical flight, packing, and arrival tips that reduce stress and help you arrive ready to worship.",
    categorySlug: "travel-tips",
    authorId: "omar-farooq",
    publishedAt: "2025-09-30",
    readingTime: 8,
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80",
    imageAlt: "Airplane wing above clouds during travel",
    popular: true,
    popularRank: 4,
    tags: ["travel", "tips"],
    content: [
      {
        type: "paragraph",
        text: "A smoother trip often means a calmer heart. These practical tips help you manage logistics so worship remains your priority.",
      },
      {
        type: "heading",
        level: 2,
        text: "Documents and Timing",
        id: "documents",
      },
      {
        type: "list",
        style: "unordered",
        items: [
          "Keep passport, visa, and booking confirmations in both digital and paper form.",
          "Arrive at the airport earlier than usual for group travel.",
          "Note hotel address in Arabic and English for taxi drivers.",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "On the Flight",
        id: "flight",
      },
      {
        type: "paragraph",
        text: "Hydrate, stretch when permitted, and use waiting time for quiet dhikr rather than exhausting entertainment. Rest if you can — the first days in Makkah ask a lot of your body.",
      },
      {
        type: "table",
        headers: ["Item", "Why it helps"],
        rows: [
          ["Empty water bottle", "Refill after security and stay hydrated"],
          ["Compression socks", "Reduce stiffness on long flights"],
          ["Lightweight prayer mat", "Useful during transit stops"],
          ["Power bank", "Keep maps and bookings accessible"],
        ],
      },
    ],
  },
  {
    id: "5",
    slug: "my-first-umrah-experience",
    title: "My First Umrah Experience",
    excerpt:
      "A personal reflection on nerves, awe, and the quiet lessons that stayed long after returning home.",
    categorySlug: "real-stories",
    authorId: "ayesha-khan",
    publishedAt: "2025-09-18",
    readingTime: 9,
    image:
      "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1200&q=80",
    imageAlt: "Pilgrims walking toward the mosque at sunset",
    tags: ["story", "reflection"],
    content: [
      {
        type: "paragraph",
        text: "I thought I had prepared for everything — the packing list, the rites, the maps. What I had not prepared for was how small I would feel, and how gently that feeling would soften my heart.",
      },
      {
        type: "heading",
        level: 2,
        text: "The First Glimpse",
        id: "first-glimpse",
      },
      {
        type: "paragraph",
        text: "Seeing the Kaaba for the first time was quieter than I expected. No dramatic soundtrack — just tears, gratitude, and a sudden desire to make dua for everyone I had ever loved.",
      },
      {
        type: "blockquote",
        text: "I came asking for a perfect Umrah. I left asking Allah to accept an imperfect one offered with sincerity.",
        cite: "Ayesha Khan",
      },
      {
        type: "heading",
        level: 2,
        text: "What I Would Tell First-Timers",
        id: "advice",
      },
      {
        type: "list",
        style: "ordered",
        items: [
          "Do not measure your Umrah by how many extras you completed.",
          "Rest without guilt when your body needs it.",
          "Write down duas before you go — crowds can make thoughts scatter.",
          "Be kind to other pilgrims; service is also worship.",
        ],
      },
    ],
  },
  {
    id: "6",
    slug: "essential-duas-for-umrah",
    title: "Essential Duas for Umrah",
    excerpt:
      "Key moments for dua during Ihram, Tawaf, Sa’i, and personal reflection — presented for calm, focused worship.",
    categorySlug: "quran-duas",
    authorId: "yusuf-ahmed",
    publishedAt: "2025-09-02",
    readingTime: 5,
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1200&q=80",
    imageAlt: "Open Quran pages with soft natural light",
    popular: true,
    popularRank: 5,
    tags: ["duas", "umrah"],
    content: [
      {
        type: "paragraph",
        text: "There is no single script that replaces a sincere heart. Still, knowing recommended moments for dua helps you stay present throughout the rites.",
      },
      {
        type: "heading",
        level: 2,
        text: "During Tawaf",
        id: "during-tawaf",
      },
      {
        type: "paragraph",
        text: "Between circuits, ask for forgiveness, guidance, healing, and goodness in this life and the next. Speak to Allah in your own language when Arabic feels distant.",
      },
      {
        type: "hadith",
        text: "[Demo Hadith text — replace with a verified narration and precise wording.]",
        source: "[Demo source placeholder]",
        grade: "Unverified demo content",
        note: "Placeholder for design demonstration only. Do not publish as an authentic Hadith.",
      },
    ],
  },
  {
    id: "7",
    slug: "what-to-pack-for-umrah",
    title: "What to Pack for Umrah",
    excerpt:
      "A thoughtful packing list for comfort, worship, and light travel — without overpacking or forgetting essentials.",
    categorySlug: "tips-advice",
    authorId: "omar-farooq",
    publishedAt: "2025-08-20",
    readingTime: 6,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=80",
    imageAlt: "Neatly packed travel bag and essentials",
    tags: ["packing", "tips"],
    content: [
      {
        type: "paragraph",
        text: "Pack for worship and comfort, not for every possible scenario. A lighter bag often means a freer mind.",
      },
      {
        type: "heading",
        level: 2,
        text: "Worship Essentials",
        id: "worship",
      },
      {
        type: "list",
        style: "unordered",
        items: [
          "Ihram clothing (and a spare set)",
          "Comfortable walking sandals",
          "Compact Quran or dua app offline",
          "Small notebook for personal duas",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Health and Comfort",
        id: "health",
      },
      {
        type: "list",
        style: "unordered",
        items: [
          "Basic medicines and prescriptions",
          "Unscented moisturizer and lip balm",
          "Electrolyte sachets",
          "Reusable water bottle",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Scent reminder",
        text: "While in Ihram, avoid scented products according to the guidelines you follow. Pack unscented alternatives in advance.",
      },
    ],
  },
  {
    id: "8",
    slug: "common-mistakes-to-avoid-during-umrah",
    title: "Common Mistakes to Avoid During Umrah",
    excerpt:
      "Gentle corrections for frequent misunderstandings — so your focus stays on sincerity, safety, and correct practice.",
    categorySlug: "umrah-guides",
    authorId: "ayesha-khan",
    publishedAt: "2025-08-05",
    readingTime: 7,
    image:
      "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1200&q=80",
    imageAlt: "Pilgrims gathered near the sacred mosque",
    tags: ["mistakes", "guidance"],
    content: [
      {
        type: "paragraph",
        text: "Most mistakes come from rushing, crowding anxiety, or incomplete preparation. Awareness helps you worship with more calm.",
      },
      {
        type: "heading",
        level: 2,
        text: "Rushing the Rites",
        id: "rushing",
      },
      {
        type: "paragraph",
        text: "Completing Umrah quickly is not the goal. Move carefully, avoid harming others, and allow your heart to catch up with your steps.",
      },
      {
        type: "heading",
        level: 2,
        text: "Neglecting Rest and Hydration",
        id: "rest",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Take care of your body",
        text: "Dehydration and exhaustion can turn a blessed journey into a medical emergency. Rest is part of responsible worship.",
      },
      {
        type: "heading",
        level: 2,
        text: "Comparing Your Journey to Others",
        id: "comparing",
      },
      {
        type: "paragraph",
        text: "Someone else’s longer dua list or extra Umrah does not diminish your sincerity. Ask Allah for acceptance and keep your gaze inward.",
      },
    ],
  },
  {
    id: "9",
    slug: "how-to-make-the-most-of-your-time-in-makkah",
    title: "How to Make the Most of Your Time in Makkah",
    excerpt:
      "A balanced approach to worship, rest, and meaningful moments in the city of the Kaaba.",
    categorySlug: "tips-advice",
    authorId: "fatima-zahra",
    publishedAt: "2025-07-22",
    readingTime: 8,
    image:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200&q=80",
    imageAlt: "Wide view of Masjid al-Haram and surrounding area",
    tags: ["makkah", "worship"],
    content: [
      {
        type: "paragraph",
        text: "Time in Makkah feels different. Hours pass quickly near the Haram, so a gentle plan helps you receive the gift without burning out.",
      },
      {
        type: "heading",
        level: 2,
        text: "Prioritize the Obligatory",
        id: "prioritize",
      },
      {
        type: "paragraph",
        text: "Protect your prayers first. Then add Quran, tawaf, and personal dua according to your energy — not according to pressure from a group schedule alone.",
      },
      {
        type: "heading",
        level: 2,
        text: "Create Quiet Windows",
        id: "quiet",
      },
      {
        type: "list",
        style: "unordered",
        items: [
          "Arrive earlier for quieter prayer spaces when possible.",
          "Keep one hour daily for unhurried personal dua.",
          "Step away from constant photography.",
          "Sleep enough to return the next day with presence.",
        ],
      },
    ],
  },
  {
    id: "10",
    slug: "understanding-hajj-for-first-time-pilgrims",
    title: "Understanding Hajj for First-Time Pilgrims",
    excerpt:
      "A clear overview of Hajj days, key rites, and how first-time pilgrims can prepare spiritually and practically.",
    categorySlug: "hajj",
    authorId: "omar-farooq",
    publishedAt: "2025-07-01",
    readingTime: 10,
    image:
      "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1200&q=80",
    imageAlt: "Large gathering of pilgrims under open sky",
    tags: ["hajj", "beginners"],
    content: [
      {
        type: "paragraph",
        text: "Hajj is distinct from Umrah in timing, structure, and spiritual intensity. Understanding the flow of days helps reduce fear and increases focus.",
      },
      {
        type: "heading",
        level: 2,
        text: "A Simple Map of the Days",
        id: "map",
      },
      {
        type: "paragraph",
        text: "From Ihram and arrival in Mina to Arafah, Muzdalifah, and the rites that follow — each stage has a purpose. Learn the sequence before memorizing every detail.",
      },
      {
        type: "heading",
        level: 2,
        text: "Spiritual Preparation Matters Most",
        id: "spiritual",
      },
      {
        type: "paragraph",
        text: "Physical fitness helps, but humility, patience, and a willingness to serve others are the provisions that matter most on the journey.",
      },
      {
        type: "callout",
        variant: "note",
        title: "Learn with a teacher",
        text: "Use this article as an orientation, then study with a qualified teacher or trusted guide for rulings specific to your situation.",
      },
    ],
  },
];
