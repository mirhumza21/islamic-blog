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
  const pill = (active: boolean) =>
    cn(
      "inline-flex h-10 shrink-0 items-center rounded-full px-4 text-xs font-semibold transition-all",
      active
        ? "bg-[#063b2f] text-white shadow-xs"
        : "border border-[#e6dfd3] bg-white/80 text-foreground/75 hover:bg-cream hover:text-[#063b2f]"
    );

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      <Link href="/blog" className={pill(!activeSlug)}>
        All Topics
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/blog?category=${category.slug}`}
          className={pill(activeSlug === category.slug)}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
