import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { ArticleFeedback } from "@/components/blog/ArticleFeedback";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { ArticleTakeaways } from "@/components/blog/ArticleTakeaways";
import { AuthorBioCard } from "@/components/blog/AuthorBioCard";
import { PrevNextNavigation } from "@/components/blog/PrevNextNavigation";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { Newsletter } from "@/components/home/Newsletter";
import {
  extractTableOfContents,
  fetchAllArticles,
  fetchAllCategories,
  fetchArticleBySlug,
  fetchAuthorById,
  fetchCategoryBySlug,
  fetchPrevNextArticles,
  fetchRelatedArticles,
} from "@/lib/articles";
import { absoluteUrl } from "@/lib/utils";
import { Tag } from "lucide-react";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article) return {};

  const title = article.seo?.title ?? article.title;
  const description = article.seo?.description ?? article.excerpt;
  const url = absoluteUrl(`/blog/${article.slug}`);

  return {
    title,
    description,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      images: [{ url: article.image, alt: article.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [article.image],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article) notFound();

  const [author, category, allArticles, categories] = await Promise.all([
    fetchAuthorById(article.authorId),
    fetchCategoryBySlug(article.categorySlug),
    fetchAllArticles(),
    fetchAllCategories(),
  ]);
  const resolvedAuthor = author ?? {
    id: article.authorId || "umrahzone",
    name: "UmrahZone",
    avatar: "",
    bio: "UmrahZone editorial team",
  };
  const resolvedCategory = category ?? {
    id: article.categorySlug || "guides",
    slug: article.categorySlug || "umrah-guides",
    name: "Guides",
    description: "",
    shortDescription: "",
    image: article.image,
    icon: "kaaba",
  };

  const toc = extractTableOfContents(article);
  const related = await fetchRelatedArticles(article, 3, allArticles);
  const { prev, next } = await fetchPrevNextArticles(article.slug, allArticles);
  const url = absoluteUrl(`/blog/${article.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: [article.image],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: {
      "@type": "Person",
      name: resolvedAuthor.name,
    },
    publisher: {
      "@type": "Organization",
      name: "UmrahZone",
      url: absoluteUrl("/"),
    },
    mainEntityOfPage: url,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: absoluteUrl("/blog"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: url,
      },
    ],
  };

  const faqBlock = article.content.find((block) => block.type === "faq");
  const faqJsonLd =
    faqBlock && faqBlock.type === "faq"
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqBlock.items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <ReadingProgress />

      <main className="mx-auto w-full max-w-[1160px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Centered Editorial Header with Featured Image */}
        <ArticleHeader
          article={article}
          author={resolvedAuthor}
          category={resolvedCategory}
        />

        {/* 2-Column Editorial Reading Layout */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-10 xl:gap-12 items-start">
          {/* Left Column: Main Article Content Stream */}
          <div className="min-w-0 order-last lg:order-1 lg:col-span-8 xl:col-span-8.5">
            {/* Quick Takeaways Box */}
            <ArticleTakeaways article={article} />

            {/* Main Rich Content */}
            <article id="article-content" className="w-full">
              <ArticleBody content={article.content} />
            </article>

            {/* Article Tags */}
            {article.tags && article.tags.length > 0 ? (
              <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-border/80 pt-6">
                <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted mr-1">
                  <Tag className="h-3.5 w-3.5 text-sand" />
                  Related Topics:
                </span>
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-border/80 bg-card px-3.5 py-1 text-xs font-medium text-foreground/80 transition-colors hover:border-green hover:bg-cream hover:text-green shadow-xs"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            ) : null}

            {/* Reader Feedback (Helpful?) */}
            <ArticleFeedback />

            {/* Author Bio Card */}
            <div className="mt-8">
              <AuthorBioCard author={resolvedAuthor} />
            </div>

            {/* Previous / Next Article Navigation */}
            <div className="mt-8">
              <PrevNextNavigation prev={prev} next={next} />
            </div>
          </div>

          {/* Right Column: Sticky Table of Contents & Quick Share */}
          <aside className="min-w-0 order-first lg:order-2 lg:col-span-4 xl:col-span-3.5">
            <TableOfContents items={toc} articleTitle={article.title} shareUrl={url} />
          </aside>
        </div>

        {/* Related Articles Section */}
        <div className="mx-auto max-w-5xl">
          <RelatedArticles articles={related} categories={categories} />
        </div>
      </main>

      <Newsletter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            [jsonLd, breadcrumbJsonLd, faqJsonLd].filter(Boolean)
          ),
        }}
      />
    </>
  );
}
