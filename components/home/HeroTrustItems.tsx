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
    <ul className="grid grid-cols-2 gap-x-5 gap-y-5 lg:grid-cols-2 xl:grid-cols-4 xl:gap-4">
      {heroContent.trustItems.map((item) => {
        const Icon = icons[item.icon];
        return (
          <li key={item.title} className="flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0 text-sand">
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold leading-snug text-foreground">
                {item.title}
              </span>
              <span className="mt-0.5 block text-[11px] leading-snug text-muted">
                {item.description}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
