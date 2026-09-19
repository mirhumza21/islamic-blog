import type { ReactNode } from "react";
import { GoldUnderline, underlineLastWord } from "@/components/home/GoldUnderline";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  align = "left",
  icon,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  icon?: ReactNode;
}) {
  const { lead, last } = underlineLastWord(title);

  return (
    <section className="relative overflow-hidden bg-ivory">
      <div
        className="pointer-events-none absolute inset-0 pattern-geometric-cream opacity-50"
        aria-hidden
      />
      <div
        className={cn(
          "container-editorial relative py-14 lg:py-20",
          align === "center" && "text-center"
        )}
      >
        <div className={cn(align === "left" && "max-w-3xl")}>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sand/15 px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-sand">
            {icon}
            {eyebrow}
          </div>
          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-[#141d1a] sm:text-5xl lg:text-[3.15rem] lg:leading-[1.12]">
            {lead ? `${lead} ` : null}
            <span className="relative inline-block text-[#063b2f]">
              {last}
              <GoldUnderline />
            </span>
          </h1>
          {subtitle ? (
            <p
              className={cn(
                "mt-4 text-base leading-relaxed text-muted sm:text-lg",
                align === "center" && "mx-auto max-w-2xl"
              )}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
