import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Heart,
  Lightbulb,
  Mountain,
  Plane,
  Sparkles,
  Compass,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/types/blog";

const iconMap: Record<string, LucideIcon> = {
  kaaba: Compass,
  plane: Plane,
  book: BookOpen,
  heart: Heart,
  mountain: Mountain,
  sparkles: Sparkles,
  lightbulb: Lightbulb,
};

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => {
        const Icon = iconMap[category.icon] ?? BookOpen;
        return (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-200 hover:border-green/40"
          >
            {/* Image container with subtle inner zoom on hover */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream [clip-path:inset(0)] [transform:translateZ(0)]">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
              />
            </div>

            <div className="flex flex-1 flex-col p-5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cream text-green">
                <Icon className="h-4 w-4" />
              </span>

              <h3 className="mt-3 font-serif text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-green">
                {category.name}
              </h3>

              <p className="mt-1.5 text-sm leading-relaxed text-muted line-clamp-2">
                {category.shortDescription}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
