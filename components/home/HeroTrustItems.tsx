import { BookOpen, Heart, Star, Users } from "lucide-react";
import { heroContent } from "@/data/navigation";

const icons = {
  book: BookOpen,
  users: Users,
  star: Star,
  heart: Heart,
} as const;

export function HeroTrustItems() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      {heroContent.trustItems.map((item) => {
        const Icon = icons[item.icon];

        return (
          <li key={item.title} className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/80 bg-card text-sand">
              <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden />
            </span>
            <span className="min-w-0 pt-0.5">
              <span className="block text-[14px] font-semibold leading-snug text-foreground">
                {item.title}
              </span>
              <span className="mt-1 block text-[13px] leading-snug text-muted">
                {item.description}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
