import { siteConfig } from "@/data/categories";

export const SOCIAL_PLATFORMS = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "x", label: "X / Twitter" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "tiktok", label: "TikTok" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "telegram", label: "Telegram" },
  { id: "pinterest", label: "Pinterest" },
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]["id"];

export type SocialLink = {
  id: string;
  platform: SocialPlatform;
  url: string;
};

const PLATFORM_IDS = new Set<string>(SOCIAL_PLATFORMS.map((item) => item.id));

function isPlatform(value: string): value is SocialPlatform {
  return PLATFORM_IDS.has(value);
}

export function socialPlatformLabel(platform: SocialPlatform) {
  return SOCIAL_PLATFORMS.find((item) => item.id === platform)?.label || platform;
}

export function createSocialLink(platform: SocialPlatform, url = ""): SocialLink {
  return {
    id: `social_${platform}_${Math.random().toString(36).slice(2, 8)}`,
    platform,
    url,
  };
}

function defaultSocialLinks(): SocialLink[] {
  return (Object.entries(siteConfig.social) as [SocialPlatform, string][])
    .filter(([platform, url]) => isPlatform(platform) && url.trim())
    .map(([platform, url]) => createSocialLink(platform, url));
}

export function normalizeSocialLinks(settings?: {
  socialLinks?: SocialLink[] | null;
  social?: Record<string, string> | null;
} | null): SocialLink[] {
  if (settings && Array.isArray(settings.socialLinks)) {
    return settings.socialLinks.flatMap((item) => {
      const platform = String(item?.platform || "");
      if (!isPlatform(platform)) return [];
      return [
        {
          id: item.id || createSocialLink(platform).id,
          platform,
          url: String(item.url || "").trim(),
        },
      ];
    });
  }

  const social = settings?.social;
  if (social && typeof social === "object") {
    const fromObject = SOCIAL_PLATFORMS.flatMap((item) => {
      const url = String(social[item.id] || "").trim();
      return url ? [createSocialLink(item.id, url)] : [];
    });
    if (fromObject.length) return fromObject;
  }

  return defaultSocialLinks();
}

export function publicSocialLinks(settings?: {
  socialLinks?: SocialLink[] | null;
  social?: Record<string, string> | null;
} | null): SocialLink[] {
  return normalizeSocialLinks(settings).filter((item) => item.url);
}

export function socialObjectFromLinks(links: SocialLink[]) {
  return {
    facebook: links.find((item) => item.platform === "facebook")?.url || "",
    instagram: links.find((item) => item.platform === "instagram")?.url || "",
    youtube: links.find((item) => item.platform === "youtube")?.url || "",
    x: links.find((item) => item.platform === "x")?.url || "",
  };
}

export function nextSocialPlatform(links: SocialLink[]): SocialPlatform | null {
  const used = new Set(links.map((item) => item.platform));
  return SOCIAL_PLATFORMS.find((item) => !used.has(item.id))?.id ?? null;
}
