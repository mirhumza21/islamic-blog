export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Blogs", href: "/blog" },
  { label: "Guides", href: "/category/umrah-guides" },
  { label: "Hajj", href: "/category/hajj" },
  { label: "Quran & Duas", href: "/category/quran-duas" },
  { label: "Islamic Lifestyle", href: "/category/islamic-lifestyle" },
  { label: "About", href: "/about" },
] as const;

export const heroContent = {
  eyebrow: "Faith • Knowledge • A Better You",
  titleLines: ["Guidance for", "Every Step of"] as const,
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
  decorativeTagline: ["Same Destination,", "A Better You"] as const,
  quote: {
    text: "[Verified Quran verse or Islamic quote]",
    reference: "[Reference]",
    note: "Placeholder — replace with verified content before publishing.",
    isPlaceholder: true as const,
  },
  image: {
    src: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=2400&h=1600&q=90&crop=focalpoint&fp-x=0.78&fp-y=0.72",
    alt: "Al-Masjid an-Nabawi in Madinah at sunset with minarets and the green dome",
  },
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
