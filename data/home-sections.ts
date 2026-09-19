import { defaultDailySpiritual } from "@/data/daily-spiritual";

export const defaultCalendar = {
  eyebrow: "Sacred Calendar",
  title: "Hijri Calendar & Sacred Events",
  subtitle: "Umm al-Qura Calculations • Live Event Countdown",
  calendarLabel: "Islamic Calendar",
  eventsLabel: "Today & Upcoming Events",
  todayBlessing:
    "The blessed Islamic day. Increase in good deeds, voluntary fasting, daily dhikr, and regular Quran recitation.",
  countdownLabel: "Event Countdown",
  countdownSubtitle: "Anticipating the blessed moments of the Islamic calendar",
  selectMilestoneLabel: "Select Milestone:",
};

export const defaultCategoriesSection = {
  eyebrow: "Explore Knowledge",
  title: "Browse by Category",
};

export const defaultFeaturedSection = {
  badge: "Featured Story",
  buttonLabel: "Read Full Article",
};

export const defaultLatestSection = {
  eyebrow: "Fresh Publications",
  title: "Latest Articles & Practical Guides",
  viewAllLabel: "View All Articles",
  viewAllHref: "/blog",
  allTopicsLabel: "All Topics",
};

export const defaultNewsletterSection = {
  title: "Join Our Growing Community",
  description:
    "Get the latest blogs, guides and inspiration delivered directly to your inbox.",
  placeholder: "Enter your email",
  buttonLabel: "Subscribe",
  loadingLabel: "Subscribing",
  successMessage: "You’re subscribed. Welcome to the UmrahZone community.",
  headerButtonLabel: "Subscribe",
};

export const defaultHomeCopy = {
  dailySpiritual: defaultDailySpiritual,
  calendar: defaultCalendar,
  categories: defaultCategoriesSection,
  featured: defaultFeaturedSection,
  latest: defaultLatestSection,
  newsletter: defaultNewsletterSection,
};

export function mergeHomeCopy(value?: Record<string, any> | null) {
  const source = value || {};
  return {
    dailySpiritual: { ...defaultDailySpiritual, ...(source.dailySpiritual || {}) },
    calendar: { ...defaultCalendar, ...(source.calendar || {}) },
    categories: { ...defaultCategoriesSection, ...(source.categories || {}) },
    featured: { ...defaultFeaturedSection, ...(source.featured || {}) },
    latest: { ...defaultLatestSection, ...(source.latest || {}) },
    newsletter: { ...defaultNewsletterSection, ...(source.newsletter || {}) },
  };
}
