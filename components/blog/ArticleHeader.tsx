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
    <header className="mx-auto max-w-[760px]">
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

      <div className="mt-5">
        <Badge>{category.name}</Badge>
      </div>

      <h1 className="mt-4 font-serif text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.1] tracking-tight text-foreground text-balance">
        {article.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">{article.excerpt}</p>

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

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 760px"
          className="object-cover"
        />
      </div>
    </header>
  );
}
