import { AlertTriangle, Info, Lightbulb, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  tip: {
    icon: Lightbulb,
    className: "border-green/25 bg-green/5",
    iconClass: "text-green",
    label: "Tip",
  },
  note: {
    icon: StickyNote,
    className: "border-border bg-cream/80",
    iconClass: "text-muted",
    label: "Note",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-amber-300/70 bg-amber-50",
    iconClass: "text-amber-700",
    label: "Warning",
  },
  info: {
    icon: Info,
    className: "border-sand/50 bg-sand/10",
    iconClass: "text-sand",
    label: "Info",
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
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <aside
      className={cn(
        "my-8 flex gap-3 rounded-2xl border px-4 py-4 sm:px-5",
        config.className,
        className
      )}
    >
      <span className={cn("mt-0.5 shrink-0", config.iconClass)}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">
          {title ?? config.label}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-foreground/85">{text}</p>
      </div>
    </aside>
  );
}
