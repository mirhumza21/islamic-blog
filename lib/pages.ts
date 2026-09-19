import { getAdminSupabase } from "@/lib/supabase";
import { heroContent as defaultHeroContent } from "@/data/navigation";
import { defaultNewsletterSection, mergeHomeCopy } from "@/data/home-sections";
import { defaultBlogPage } from "@/data/blog-page";

export { defaultDailySpiritual } from "@/data/daily-spiritual";
export type { DailySpiritualContent } from "@/data/daily-spiritual";

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
      const value = data.value as Record<string, any>;
      return {
        ...defaultHeroContent,
        ...value,
        quote: { ...defaultHeroContent.quote, ...(value.quote || {}) },
        image: { ...defaultHeroContent.image, ...(value.image || {}) },
        slides:
          Array.isArray(value.slides) && value.slides.length > 0
            ? value.slides
            : [
                { ...defaultHeroContent.image, ...(value.image || {}) },
                ...defaultHeroContent.slides.slice(1),
              ],
        primaryCta: { ...defaultHeroContent.primaryCta, ...(value.primaryCta || {}) },
        secondaryCta: {
          ...defaultHeroContent.secondaryCta,
          ...(value.secondaryCta || {}),
        },
        trustItems: value.trustItems || defaultHeroContent.trustItems,
        verses:
          Array.isArray(value.verses) && value.verses.length > 0
            ? value.verses
            : defaultHeroContent.verses,
        dockItems:
          Array.isArray(value.dockItems) && value.dockItems.length > 0
            ? value.dockItems
            : defaultHeroContent.dockItems,
        ...mergeHomeCopy(value),
      };
    }
  } catch (err) {
    console.error("Could not fetch page_home from Supabase, using default:", err);
  }

  return {
    ...defaultHeroContent,
    ...mergeHomeCopy(),
  };
}

export async function getAboutPageContent() {
  return getPageSetting("page_about", defaultAboutContent);
}

export const defaultContactContent = {
  eyebrow: "Contact",
  headline: "We'd love to hear from you",
  subheadline:
    "Questions, corrections, or thoughtful feedback — send us a message and we'll get back to you as soon as we can.",
  formTitle: "Send a message",
  formText:
    "Fill in the form below and your email app will open with everything ready to send.",
  emailTitle: "Direct email",
  emailText: "Prefer email? Write to us directly.",
  helpTitle: "What can we help with?",
  reasons: [
    {
      title: "General questions",
      text: "Ask about our articles, guides, or how to find content on UmrahZone.",
    },
    {
      title: "Content corrections",
      text: "Spotted an error in a verse, reference, or factual detail? Let us know.",
    },
    {
      title: "Collaboration",
      text: "Writers, educators, and partners with aligned values are welcome to reach out.",
    },
  ],
  noteTitle: "Before you write",
  noteText:
    "UmrahZone is a content platform. We do not offer travel booking, visa services, or package sales. For sacred text corrections, please include the article link and source if possible.",
};

export const defaultPrivacyContent = {
  title: "Privacy Policy",
  lastUpdated: "March 10, 2026",
  body: `<p>UmrahZone respects your privacy. This page explains what information we may collect when you browse the site or subscribe to updates.</p>
<h2>Information we collect</h2>
<p>If you subscribe to our newsletter, we collect the email address you provide. Standard analytics or hosting logs may collect technical data such as browser type and approximate location.</p>
<h2>How we use information</h2>
<p>Email addresses are used only to send requested updates. We do not sell personal information.</p>
<h2>Contact</h2>
<p>For privacy questions, email <a href="mailto:hello@umrahzone.com">hello@umrahzone.com</a>.</p>`,
};

export const defaultTermsContent = {
  title: "Terms of Use",
  lastUpdated: "March 10, 2026",
  body: `<p>By using UmrahZone, you agree to read content for personal educational and inspirational purposes. Articles are general information and are not a substitute for qualified scholarly or legal advice.</p>
<h2>Content accuracy</h2>
<p>We strive for clarity and care. Ritual details can vary by school of thought. Always verify important religious rulings with a trusted scholar.</p>
<h2>Intellectual property</h2>
<p>Site design and original editorial content belong to UmrahZone unless otherwise noted. Please do not republish substantial content without permission.</p>
<h2>Contact</h2>
<p>Questions about these terms can be sent to <a href="mailto:hello@umrahzone.com">hello@umrahzone.com</a>.</p>`,
};

export async function getPageSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const supabase = getAdminSupabase();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (data?.value && typeof data.value === "object") {
      return { ...fallback, ...data.value };
    }
  } catch (err) {
    console.error(`Could not fetch ${key} from Supabase, using default:`, err);
  }

  return fallback;
}

export async function getContactPageContent() {
  return getPageSetting("page_contact", defaultContactContent);
}

export async function getPrivacyPageContent() {
  return getPageSetting("page_privacy", defaultPrivacyContent);
}

export async function getTermsPageContent() {
  return getPageSetting("page_terms", defaultTermsContent);
}

export async function getBlogPageContent() {
  return getPageSetting("page_blog", defaultBlogPage);
}

export async function getGlobalSubscribe() {
  try {
    const supabase = getAdminSupabase();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "global_subscribe")
      .maybeSingle();

    if (data?.value && typeof data.value === "object") {
      return { ...defaultNewsletterSection, ...(data.value as object) };
    }

    const { data: home } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "page_home")
      .maybeSingle();
    const homeValue = home?.value as Record<string, any> | undefined;
    if (homeValue?.newsletter && typeof homeValue.newsletter === "object") {
      return { ...defaultNewsletterSection, ...homeValue.newsletter };
    }
  } catch (err) {
    console.error("Could not fetch global_subscribe from Supabase, using default:", err);
  }

  return defaultNewsletterSection;
}
