import { BookOpen, Heart, Star, Users } from "lucide-react";
import { heroContent } from "@/data/navigation";
import { cn } from "@/lib/utils";

const icons = {
  book: BookOpen,
  users: Users,
  star: Star,
  heart: Heart,
} as const;

export function HeroTrustItems() {
  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-6 md:gap-x-8 lg:grid-cols-4 lg:gap-0">
      {heroContent.trustItems.map((item, index) => {
        const Icon = icons[item.icon];
        const isLast = index === heroContent.trustItems.length - 1;

        return (
          <li
            key={item.title}
            className={cn(
              "relative flex items-start gap-3 lg:px-5 xl:px-6",
              index === 0 && "lg:pl-0",
              isLast && "lg:pr-0",
              index > 0 &&
                "lg:before:absolute lg:before:bottom-1 lg:before:left-0 lg:before:top-1 lg:before:w-px lg:before:bg-border/70"
            )}
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand/10 text-sand">
              <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold leading-snug text-foreground sm:text-[14px]">
                {item.title}
              </span>
              <span className="mt-1 block text-[12px] leading-snug text-muted">
                {item.description}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
