import type { Category } from "@/types/blog";

export const categories: Category[] = [
  {
    id: "1",
    slug: "umrah-guides",
    name: "Umrah Guides",
    shortDescription: "Step-by-step help",
    description:
      "Practical, easy-to-follow Umrah guides covering preparation, Ihram, Tawaf, Sa’i, and returning home with clarity and confidence.",
    image:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200&q=80",
    icon: "kaaba",
  },
  {
    id: "2",
    slug: "travel-tips",
    name: "Travel Tips",
    shortDescription: "Before You Go",
    description:
      "Trusted travel advice for flights, packing, hotels near the Haram, and staying comfortable throughout your sacred journey.",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80",
    icon: "plane",
  },
  {
    id: "3",
    slug: "quran-duas",
    name: "Quran & Duas",
    shortDescription: "Spiritual Guidance",
    description:
      "Meaningful Quran reflections and carefully presented duas to strengthen your heart before, during, and after Umrah.",
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1200&q=80",
    icon: "book",
  },
  {
    id: "4",
    slug: "islamic-lifestyle",
    name: "Islamic Lifestyle",
    shortDescription: "Everyday Inspiration",
    description:
      "Guidance on habits, character, family life, and spiritual routines that help you live Islam with sincerity and balance.",
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200&q=80",
    icon: "heart",
  },
  {
    id: "5",
    slug: "hajj",
    name: "Hajj",
    shortDescription: "The Greater Journey",
    description:
      "Clear explanations of Hajj rites, preparation, and spiritual focus so you approach the pilgrimage with understanding.",
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200&q=80",
    icon: "mountain",
  },
  {
    id: "6",
    slug: "real-stories",
    name: "Real Stories",
    shortDescription: "Experiences & Reflections",
    description:
      "Personal Umrah and faith journeys shared with honesty — moments of struggle, gratitude, and spiritual renewal.",
    image:
      "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1200&q=80",
    icon: "sparkles",
  },
  {
    id: "7",
    slug: "tips-advice",
    name: "Tips & Advice",
    shortDescription: "Helpful Insights",
    description:
      "Short, actionable advice covering common mistakes, packing lists, etiquette, and ways to make the most of your time.",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80",
    icon: "lightbulb",
  },
];

export const siteConfig = {
  name: "UmrahZone",
  tagline: "Knowledge Today, A Closer Tomorrow",
  description:
    "UmrahZone shares practical guidance, trusted knowledge and meaningful Islamic content for Muslims preparing for Umrah, Hajj and everyday life.",
  url: "https://umrahzone.com",
  email: "hello@umrahzone.com",
  social: {
    facebook: "https://facebook.com/umrahzone",
    instagram: "https://instagram.com/umrahzone",
    youtube: "https://youtube.com/@umrahzone",
    x: "https://x.com/umrahzone",
  },
};

export { mainNav, heroContent } from "./navigation";

export const popularSearches = [
  "Umrah guide",
  "Duas for travel",
  "What to pack",
  "First Umrah",
  "Tawaf tips",
];
