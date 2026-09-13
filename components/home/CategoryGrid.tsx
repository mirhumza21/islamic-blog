import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Heart,
  Lightbulb,
  Mountain,
  Plane,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/types/blog";

const iconMap: Record<string, LucideIcon> = {
  kaaba: BookOpen,
  plane: Plane,
  book: BookOpen,
  heart: Heart,
  mountain: Mountain,
  sparkles: Sparkles,
  lightbulb: Lightbulb,
};

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => {
        const Icon = iconMap[category.icon] ?? BookOpen;
        return (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group flex min-w-[240px] flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-200 hover:border-green/30 sm:min-w-0"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 240px, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
            </div>
            <div className="p-4">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cream text-green">
                <Icon className="h-4 w-4" />
              </span>
              <h3 className="mt-3 font-serif text-xl font-semibold text-foreground">
                {category.name}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {category.shortDescription}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
