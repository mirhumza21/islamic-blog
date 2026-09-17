import { getAdminSupabase } from "@/lib/supabase";
import { heroContent as defaultHeroContent } from "@/data/navigation";

export const defaultAboutContent = {
  eyebrow: "About UmrahZone",
  headline: "Knowledge today, a closer tomorrow",
  subheadline:
    "UmrahZone is a premium editorial platform for Muslims seeking clear guidance on Umrah, Hajj, Quran & duas, travel, and everyday Islamic living.",
  missionTitle: "Our Mission",
  missionText:
    "We exist to make trusted Islamic knowledge feel approachable — especially for people preparing for sacred journeys or rebuilding daily habits of faith. Our work aims to reduce confusion, deepen intention, and accompany readers with calm, practical writing.",
  whyWeExistTitle: "Why UmrahZone Exists",
  whyWeExistText:
    "Too many Umrah resources feel either overly commercial or difficult to follow. We built UmrahZone as a content-first home: no package pressure, no checkout noise — just guidance you can read, trust, and return to.",
  authenticityTitle: "Authenticity & Sources",
  authenticityText:
    "Sacred texts deserve precision. Sample Quran and Hadith blocks in early content are clearly marked as demo placeholders until replaced with verified wording from reliable sources and scholarly review.",
  editorialStandardsTitle: "Editorial Standards",
  editorialStandardsText:
    "Articles are written for readability, structured for scanning, and reviewed for tone, usefulness, and factual care. We prioritize humility over certainty when rulings may differ.",
  principlesTitle: "Our Content Principles",
  principles: [
    {
      title: "Clarity over complexity",
      text: "We explain rites, travel, and faith topics in plain language without diluting meaning.",
    },
    {
      title: "Practical before performative",
      text: "Every article should help a reader prepare, understand, or grow — not merely fill a page.",
    },
    {
      title: "Respect for sacred knowledge",
      text: "Quran and Hadith references must be verified. Until verified, we mark content clearly as demo.",
    },
    {
      title: "Calm, trustworthy tone",
      text: "We write for everyday Muslims with warmth, dignity, and zero sensationalism.",
    },
  ],
  contactTitle: "Contact",
  contactText: "Questions, corrections, or collaboration ideas are welcome.",
  contactEmail: "editorial@umrahzone.example",
  contactButtonText: "Go to contact page",
  contactButtonUrl: "/contact",
};

export async function getHomePageContent() {
  try {
    const supabase = getAdminSupabase();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "page_home")
      .maybeSingle();

    if (data?.value) {
      return data.value;
    }
  } catch (err) {
    console.error("Could not fetch page_home from Supabase, using default:", err);
  }

  return defaultHeroContent;
}

export async function getAboutPageContent() {
  try {
    const supabase = getAdminSupabase();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "page_about")
      .maybeSingle();

    if (data?.value) {
      return { ...defaultAboutContent, ...data.value };
    }
  } catch (err) {
    console.error("Could not fetch page_about from Supabase, using default:", err);
  }

  return defaultAboutContent;
}
