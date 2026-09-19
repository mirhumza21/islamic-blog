import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { defaultFeaturedSection } from "@/data/home-sections";
import type { Article, Author, Category } from "@/types/blog";

export function FeaturedArticle({
  article,
  author,
  category,
  content,
}: {
  article: Article;
  author: Author;
  category: Category;
  content?: Partial<typeof defaultFeaturedSection>;
}) {
  const copy = { ...defaultFeaturedSection, ...content };
  return (
    <section className="relative overflow-hidden bg-cream/80 py-16 lg:py-20">
      <div
        className="pointer-events-none absolute inset-0 pattern-geometric-cream opacity-55"
        aria-hidden
      />
      <div className="container-editorial relative grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sand/15 px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-sand">
            {copy.badge}
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-green">
            {category.name}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-[1.15] tracking-tight text-[#141d1a] sm:text-4xl lg:text-[2.75rem]">
            <Link
              href={`/blog/${article.slug}`}
              className="transition-colors hover:text-[#063b2f]"
            >
              {article.title}
            </Link>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            {article.excerpt}
          </p>
          <div className="mt-8">
            <Link
              href={`/blog/${article.slug}`}
              className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#063b2f] px-7 text-[14px] font-semibold text-white shadow-[0_2px_12px_rgba(6,59,47,0.25)] transition-[background-color,box-shadow] duration-200 hover:bg-[#042d24] hover:shadow-[0_4px_16px_rgba(6,59,47,0.38)]"
            >
              {copy.buttonLabel}
              <ArrowRight className="h-4 w-4 text-white/90" strokeWidth={1.8} />
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <Image
              src={author.avatar}
              alt={author.name}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-foreground">{author.name}</p>
              <p className="text-xs text-muted">
                {formatDate(article.publishedAt)} · {article.readingTime} min read
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Link
            href={`/blog/${article.slug}`}
            className="group relative block overflow-hidden rounded-[28px] border border-[#e6dfd3] shadow-[0_12px_40px_-16px_rgba(6,59,47,0.18)] transition-colors duration-200 hover:border-[#c59a53]/50"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[28px] [clip-path:inset(0)] [transform:translateZ(0)]">
              <Image
                src={article.image}
                alt={article.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
