import type { ReactNode } from "react";
import { GoldUnderline, underlineLastWord } from "@/components/home/GoldUnderline";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  description,
  icon,
  tone = "sand",
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: ReactNode;
  tone?: "sand" | "green";
  action?: ReactNode;
}) {
  const { lead, last } = underlineLastWord(title);
  const pill =
    tone === "green"
      ? "bg-green/10 text-green"
      : "bg-sand/15 text-sand";

  return (
    <div className="mb-7 flex flex-col justify-between gap-4 lg:mb-8 lg:flex-row lg:items-end">
      <div className="min-w-0">
        {eyebrow ? (
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.16em] ${pill}`}
          >
            {icon}
            {eyebrow}
          </div>
        ) : null}
        <h2 className={`${eyebrow ? "mt-2.5" : ""} font-serif text-3xl font-bold tracking-tight text-[#141d1a] sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]`}>
          {lead ? `${lead} ` : null}
          <span className="relative inline-block text-[#063b2f]">
            {last}
            <GoldUnderline />
          </span>
        </h2>
        {description ? (
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#3f4d47] sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {subtitle || action ? (
        <div className="shrink-0 lg:max-w-xs lg:text-right">
          {subtitle ? (
            <p className="text-sm leading-relaxed text-muted">{subtitle}</p>
          ) : null}
          {action}
        </div>
      ) : null}
    </div>
  );
}
