import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Article, Author, Category } from "@/types/blog";

export function ArticleHeader({
  article,
  author,
  category,
}: {
  article: Article;
  author: Author;
  category: Category;
}) {
  return (
    <header>
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-green">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/blog" className="hover:text-green">
              Blog
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href={`/category/${category.slug}`}
              className="hover:text-green"
            >
              {category.name}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="mt-5 max-w-4xl">
        <Badge>{category.name}</Badge>

        <h1 className="mt-4 font-serif text-[clamp(2.1rem,4.2vw,3.6rem)] font-semibold leading-[1.08] tracking-tight text-foreground text-balance">
          {article.title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted lg:text-xl lg:leading-relaxed">
          {article.excerpt}
        </p>

        <div className="mt-6 flex items-center gap-3 border-y border-border py-4">
          <Image
            src={author.avatar}
            alt={author.name}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">{author.name}</p>
            <p className="text-xs text-muted">
              {formatDate(article.publishedAt)}
              {article.updatedAt
                ? ` · Updated ${formatDate(article.updatedAt)}`
                : ""}{" "}
              · {article.readingTime} min read
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border sm:aspect-[21/9] lg:rounded-[1.35rem]">
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1360px) 92vw, 1360px"
          className="object-cover"
        />
      </div>
    </header>
  );
}
