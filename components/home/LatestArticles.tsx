import Link from "next/link";
import { ArticleGrid } from "@/components/blog/ArticleGrid";
import { PopularArticles } from "@/components/home/PopularArticles";
import { SidebarSearch } from "@/components/home/SidebarSearch";
import type { Article, Category } from "@/types/blog";

export function LatestArticles({
  articles,
  popular,
  categories,
}: {
  articles: Article[];
  popular: Article[];
  categories: Category[];
}) {
  return (
    <section className="container-editorial py-16 lg:py-20">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green">
            Fresh Reading
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Latest Articles
          </h2>
        </div>
        <Link
          href="/blog"
          className="text-sm font-medium text-green hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ArticleGrid articles={articles} categories={categories} />
        </div>
        <aside className="space-y-6 lg:col-span-4">
          <SidebarSearch />
          <div className="overflow-hidden rounded-2xl border border-border">
            <div
              className="relative flex min-h-[180px] flex-col justify-end bg-cover bg-center p-5 text-white"
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(6,59,50,0.88), rgba(6,59,50,0.25)), url(https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80)",
              }}
            >
              <p className="font-serif text-2xl font-semibold leading-snug">
                Small Steps. A Closer You.
              </p>
              <p className="mt-2 text-sm text-white/80">
                Read with intention. Grow with consistency.
              </p>
            </div>
          </div>
          <PopularArticles articles={popular} />
        </aside>
      </div>
    </section>
  );
}
