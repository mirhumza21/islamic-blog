import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showTagline = true,
}: {
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5 sm:gap-3", className)}
      aria-label="UmrahZone home"
    >
      {/* Layered Islamic Arch & Crescent Emblem */}
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#064234] to-[#042e24] shadow-xs transition-transform duration-200 group-hover:scale-105">
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

      <span className="flex min-w-0 flex-col justify-center">
        <span className="font-serif text-[1.4rem] font-bold leading-none tracking-tight sm:text-[1.5rem]">
          <span className="text-[#075846]">Umrah</span>
          <span className="text-[#b8894a]">Zone</span>
        </span>
        {showTagline ? (
          <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-muted sm:block">
            Knowledge Today, A Closer Tomorrow
          </span>
        ) : null}
      </span>
    </Link>
  );
}
