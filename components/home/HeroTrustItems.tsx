import { BookOpen, Heart, Star, Users } from "lucide-react";
import { heroContent } from "@/data/navigation";

const icons = {
  book: BookOpen,
  users: Users,
  star: Star,
  heart: Heart,
} as const;

export function HeroTrustItems({ content }: { content?: typeof heroContent }) {
  const data = content || heroContent;
  const items = data.trustItems || heroContent.trustItems;

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
      {items.map((item: any, index: number) => {
        const Icon = (icons as any)[item.icon] || BookOpen;

        return (
          <li
            key={item.title}
            className={`flex items-start gap-3 lg:px-8 first:lg:pl-0 last:lg:pr-0 ${
              index > 0 ? "lg:border-l lg:border-border" : ""
            }`}
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center text-gold">
              <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-[13.5px] font-semibold leading-snug text-foreground">
                {item.title}
              </span>
              <span className="mt-1 block text-[12.5px] leading-snug text-muted">
                {item.description}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
