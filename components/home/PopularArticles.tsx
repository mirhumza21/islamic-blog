import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types/blog";

export function PopularArticles({ articles }: { articles: Article[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="font-serif text-2xl font-semibold text-foreground">
        Popular Articles
      </h2>
      <ol className="mt-5 space-y-4">
        {articles.map((article, index) => (
          <li key={article.id} className="flex gap-3">
            <span className="w-8 shrink-0 font-serif text-2xl font-semibold text-sand">
              {String(index + 1).padStart(2, "0")}
            </span>
            <Link
              href={`/blog/${article.slug}`}
              className="group flex min-w-0 flex-1 gap-3"
            >
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  sizes="56px"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </span>
              <span className="min-w-0">
                <span className="line-clamp-2 font-serif text-base leading-snug text-foreground transition-colors group-hover:text-green">
                  {article.title}
                </span>
                <span className="mt-1 block text-xs text-muted">
                  {article.readingTime} min read
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
