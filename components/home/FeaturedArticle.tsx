import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { Article, Author, Category } from "@/types/blog";

export function FeaturedArticle({
  article,
  author,
  category,
}: {
  article: Article;
  author: Author;
  category: Category;
}) {
  return (
    <section className="bg-cream/60 py-16 lg:py-20">
      <div className="container-editorial grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Badge>Featured Story</Badge>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-green">
            {category.name}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
            <Link
              href={`/blog/${article.slug}`}
              className="transition-colors hover:text-green"
            >
              {article.title}
            </Link>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            {article.excerpt}
          </p>
          <div className="mt-7">
            <Button asChild size="lg">
              <Link href={`/blog/${article.slug}`}>
                Read Full Article
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
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
            className="group relative block overflow-hidden rounded-2xl border border-border transition-colors duration-200 hover:border-green/30"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src={article.image}
                alt={article.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
