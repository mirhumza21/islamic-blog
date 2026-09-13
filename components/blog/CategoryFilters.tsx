import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/blog";

export function CategoryFilters({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      <Link
        href="/blog"
        className={cn(
          "inline-flex h-11 shrink-0 items-center rounded-xl border px-4 text-sm font-medium transition-colors",
          !activeSlug
            ? "border-green bg-green text-white"
            : "border-border bg-card text-foreground hover:border-green/30"
        )}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/blog?category=${category.slug}`}
          className={cn(
            "inline-flex h-11 shrink-0 items-center rounded-xl border px-4 text-sm font-medium transition-colors",
            activeSlug === category.slug
              ? "border-green bg-green text-white"
              : "border-border bg-card text-foreground hover:border-green/30"
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
