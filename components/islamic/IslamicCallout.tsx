import { AlertTriangle, Info, Lightbulb, StickyNote, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  tip: {
    icon: Lightbulb,
    badgeBg: "bg-emerald-100 text-emerald-800",
    borderClass: "border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 to-emerald-50/30",
    titleColor: "text-emerald-950",
    label: "Practical Advice",
  },
  note: {
    icon: StickyNote,
    badgeBg: "bg-cream text-sand",
    borderClass: "border-border/80 bg-card",
    titleColor: "text-foreground",
    label: "Important Note",
  },
  warning: {
    icon: AlertTriangle,
    badgeBg: "bg-amber-100 text-amber-800",
    borderClass: "border-amber-200/80 bg-gradient-to-br from-amber-50/80 to-amber-50/30",
    titleColor: "text-amber-950",
    label: "Cautions & Reminders",
  },
  info: {
    icon: Sparkles,
    badgeBg: "bg-sand/20 text-sand",
    borderClass: "border-sand/40 bg-gradient-to-br from-[#faf6ef] to-[#f4ebe0]",
    titleColor: "text-[#6b4716]",
    label: "Spiritual Insight",
  },
} as const;

export function IslamicCallout({
  variant = "note",
  title,
  text,
  className,
}: {
  variant?: keyof typeof variants;
  title?: string;
  text: string;
  className?: string;
}) {
  const config = variants[variant] ?? variants.note;
  const Icon = config.icon;

  return (
    <aside
      className={cn(
        "my-8 rounded-[22px] border p-5 sm:p-6 shadow-xs not-prose",
        config.borderClass,
        className
      )}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-xs",
            config.badgeBg
          )}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <h4
            className={cn(
              "font-serif text-base font-bold sm:text-lg",
              config.titleColor
            )}
          >
            {title ?? config.label}
          </h4>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
            {text}
          </p>
        </div>
      </div>
    </aside>
  );
}
