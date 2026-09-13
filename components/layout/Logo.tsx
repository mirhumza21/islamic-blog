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
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-green/20 bg-cream text-green transition-colors group-hover:bg-green group-hover:text-white">
        <svg
          viewBox="0 0 32 32"
          className="h-5 w-5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M16 5.5c1.8 2.2 3 4.8 3 7.4 0 1.7-.5 3.2-1.4 4.4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M10 26V16.5c0-1.4.8-2.6 2-3.2L16 11l4 2.3c1.2.6 2 1.8 2 3.2V26"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M8 26h16M13 26v-4h6v4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="16" cy="8" r="1.4" fill="currentColor" />
        </svg>
      </span>
      <span className="flex min-w-0 flex-col justify-center">
        <span className="font-serif text-[1.25rem] font-semibold leading-none tracking-tight text-green sm:text-[1.35rem]">
          UmrahZone
        </span>
        {showTagline ? (
          <span className="mt-1.5 hidden text-[10px] font-medium leading-none tracking-[0.02em] text-muted sm:block">
            Knowledge Today, A Closer Tomorrow
          </span>
        ) : null}
      </span>
    </Link>
  );
}
