import Link from "next/link";
import { cn } from "@/lib/utils";
import { toRenderableImageSrc } from "@/lib/mediaUrl";

export interface LogoProps {
  className?: string;
  logoUrl?: string;
  logoAlt?: string;
  showSiteNameWithLogo?: boolean;
  siteName?: string;
  onClick?: () => void;
}

export function Logo({
  className,
  logoUrl,
  logoAlt,
  showSiteNameWithLogo = false,
  siteName = "UmrahZone",
  onClick,
}: LogoProps) {
  const imgSrc = logoUrl ? toRenderableImageSrc(logoUrl) : null;
  const effectiveAlt = logoAlt || (siteName ? `${siteName} Logo` : "Logo");

  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn("group flex items-center gap-2.5 sm:gap-3", className)}
      aria-label={`${logoAlt || siteName} home`}
    >
      {imgSrc ? (
        <span className="relative flex items-center shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={effectiveAlt}
            className="h-9 sm:h-10 w-auto max-w-[200px] object-contain"
          />
        </span>
      ) : (
        /* Layered Islamic Arch & Crescent Emblem */
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#064234] to-[#042e24] shadow-xs">
          <svg
            viewBox="0 0 32 32"
            className="h-6 w-6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            {/* Outer Islamic Arch */}
            <path
              d="M16 4C11 8 7 13 7 19v8h18v-8c0-6-4-11-9-15z"
              stroke="#d4af72"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Inner Arch */}
            <path
              d="M16 9C12.5 12.5 10 16 10 20.5V27h12v-6.5C22 16 19.5 12.5 16 9z"
              fill="#d4af72"
              fillOpacity="0.2"
              stroke="#ffffff"
              strokeWidth="1.2"
            />
            {/* Central Dome Spire */}
            <circle cx="16" cy="18" r="1.5" fill="#d4af72" />
            <path d="M16 13v2M14 18h4" stroke="#d4af72" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </span>
      )}

      {(!imgSrc || showSiteNameWithLogo) && (
        <span className="flex min-w-0 flex-col justify-center">
          <span className="font-serif text-[1.4rem] font-bold leading-none tracking-tight sm:text-[1.5rem]">
            {siteName === "UmrahZone" ? (
              <>
                <span className="text-[#075846]">Umrah</span>
                <span className="text-[#b8894a]">Zone</span>
              </>
            ) : (
              <span className="text-[#075846]">{siteName}</span>
            )}
          </span>
        </span>
      )}
    </Link>
  );
}
