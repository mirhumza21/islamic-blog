import { cn } from "@/lib/utils";

export function GoldUnderline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "pointer-events-none absolute top-[1.05em] left-0 w-full overflow-visible text-[#c59a53]",
        className
      )}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M2 8C38 3 92 2 178 9"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M14 12C55 6 110 6 168 12"
        stroke="#b8894a"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  );
}

export function underlineLastWord(title: string) {
  const parts = title.trim().split(/\s+/);
  const last = parts.pop() || title;
  return { lead: parts.join(" "), last };
}
