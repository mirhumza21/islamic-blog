import { socialPlatformLabel, type SocialLink, type SocialPlatform } from "@/lib/socialLinks";
import { toRenderableImageSrc } from "@/lib/mediaUrl";

export function SocialIconGlyph({ platform, className }: { platform: SocialPlatform; className?: string }) {
  const common = { viewBox: "0 0 24 24", className, fill: "currentColor", "aria-hidden": true as const };

  if (platform === "facebook") {
    return (
      <svg {...common}>
        <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v8h4v-8h3.1l.9-4H13V9c0-.6.4-1 1-1z" />
      </svg>
    );
  }
  if (platform === "instagram") {
    return (
      <svg {...common}>
        <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm5.2-.9a1.1 1.1 0 1 0 1.1 1.1 1.1 1.1 0 0 0-1.1-1.1zM12 9.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5z" />
      </svg>
    );
  }
  if (platform === "youtube") {
    return (
      <svg {...common}>
        <path d="M23 12.2s0-3.2-.4-4.7c-.2-.9-.9-1.6-1.8-1.8C19.3 5.2 12 5.2 12 5.2s-7.3 0-8.8.5c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.7c.2.9.9 1.6 1.8 1.8 1.5.4 8.8.4 8.8.4s7.3 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.5.4-4.7.4-4.7zM9.8 15.5v-6.6l6.2 3.3-6.2 3.3z" />
      </svg>
    );
  }
  if (platform === "x") {
    return (
      <svg {...common}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.922L1.942 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (platform === "whatsapp") {
    return (
      <svg {...common}>
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.55.12.17 1.74 2.65 4.21 3.72.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z" />
      </svg>
    );
  }
  if (platform === "tiktok") {
    return (
      <svg {...common}>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.18 8.18 0 0 0 4.76 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
      </svg>
    );
  }
  if (platform === "linkedin") {
    return (
      <svg {...common}>
        <path d="M4.98 3.5A2.5 2.5 0 1 1 2.5 1a2.5 2.5 0 0 1 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.05c.53-1 1.84-2.1 3.79-2.1 4.05 0 4.8 2.67 4.8 6.14V24h-4v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.06V24h-4V8.5z" />
      </svg>
    );
  }
  if (platform === "telegram") {
    return (
      <svg {...common}>
        <path d="M21.5 4.5 2.8 11.7c-1.3.5-1.3 1.2-.2 1.5l4.8 1.5 11.1-7c.5-.3 1-.1.6.2l-9 8.1-.3 4.6c.5 0 .7-.2 1-.5l2.4-2.3 5 3.7c.9.5 1.6.2 1.8-.9l3.3-15.6c.3-1.3-.5-1.9-1.8-1.5z" />
      </svg>
    );
  }
  if (platform === "pinterest") {
    return (
      <svg {...common}>
        <path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.3 9.2-.1-.8-.2-2 0-2.8.2-.8 1.3-5.5 1.3-5.5s-.3-.7-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.6 0 1-.6 2.4-.9 3.7-.3 1.1.5 2 1.6 2 1.9 0 3.2-2.4 3.2-5.3 0-2.2-1.5-3.8-4.2-3.8-3 0-4.9 2.3-4.9 4.8 0 .9.3 1.8.7 2.4.1.1.1.2.1.3l-.3 1c0 .2-.1.2-.3.1-1.3-.5-1.9-2-1.9-3.6 0-2.7 2.3-5.9 6.8-5.9 3.6 0 6 2.6 6 5.4 0 3.7-2.1 6.5-5.1 6.5-1 0-2-.5-2.3-1.2l-.6 2.4c-.2.9-.8 2-1.2 2.7.9.3 1.9.4 2.9.4 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
      </svg>
    );
  }

  // Fallback for custom channels or unspecified icons (Globe / Web icon)
  return (
    <svg {...common}>
      <path
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm7.93 9h-3.18a15.7 15.7 0 0 0-1.37-5.06A8.02 8.02 0 0 1 19.93 11zM12 4.07c.97 1.63 1.73 4.14 1.94 6.93H10.06C10.27 8.21 11.03 5.7 12 4.07zM4.07 13h3.18a15.7 15.7 0 0 0 1.37 5.06A8.02 8.02 0 0 1 4.07 13zm3.18-2H4.07a8.02 8.02 0 0 1 4.55-5.06A15.7 15.7 0 0 0 7.25 11zM12 19.93c-.97-1.63-1.73-4.14-1.94-6.93h3.88c-.21 2.79-.97 5.3-1.94 6.93zm3.38-1.87a15.7 15.7 0 0 0 1.37-5.06h3.18a8.02 8.02 0 0 1-4.55 5.06z"
      />
    </svg>
  );
}

export function SocialIcons({
  links,
  className = "flex flex-wrap items-center gap-2",
}: {
  links: SocialLink[];
  className?: string;
}) {
  const visible = links.filter((item) => item.url?.trim());
  if (!visible.length) return null;

  return (
    <div className={className}>
      {visible.map((item) => {
        const label = socialPlatformLabel(item.platform, item.title);
        const iconSrc = item.iconUrl ? toRenderableImageSrc(item.iconUrl) : null;

        return (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e6dfd3] bg-white/80 text-muted transition-colors hover:border-[#c59a53]/50 hover:text-[#063b2f] p-2.5 overflow-hidden shadow-xs hover:shadow-sm"
          >
            {iconSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={iconSrc}
                alt={label}
                className="h-full w-full object-contain"
              />
            ) : (
              <SocialIconGlyph platform={item.platform} className="h-4 w-4" />
            )}
          </a>
        );
      })}
    </div>
  );
}
