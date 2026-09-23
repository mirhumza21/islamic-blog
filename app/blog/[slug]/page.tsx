import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { ArticleFaqSection } from "@/components/blog/ArticleFaqSection";
import { ArticleFeedback } from "@/components/blog/ArticleFeedback";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { ArticleTakeaways } from "@/components/blog/ArticleTakeaways";
import { ArticleVideoEmbed } from "@/components/blog/ArticleVideoEmbed";
import { AuthorBioCard } from "@/components/blog/AuthorBioCard";
import { PrevNextNavigation } from "@/components/blog/PrevNextNavigation";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { GlobalNewsletter } from "@/components/home/GlobalNewsletter";
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

function extractCustomSchema(script?: string): unknown | null {
  if (!script?.trim()) return null;
  const raw = script.trim();
  const match = raw.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  const jsonText = (match?.[1] || raw).trim();
  try {
    return JSON.parse(jsonText);
  } catch {
    return null;
  }
}

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
  const canonicalPath = article.seo?.canonicalUrl?.trim() || `/blog/${article.slug}`;
  const url = canonicalPath.startsWith("http")
    ? canonicalPath
    : absoluteUrl(canonicalPath);
  const heroImage = article.coverImage || article.image;
  const heroAlt = article.coverImageAlt || article.imageAlt;

  return {
    title,
    description,
    keywords: article.seo?.keywords
      ? article.seo.keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : article.tags,
    alternates: {
      canonical: canonicalPath.startsWith("http")
        ? canonicalPath
        : canonicalPath,
    },
    robots: article.seo?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      images: [{ url: heroImage, alt: heroAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [heroImage],
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

  const heroImage = article.coverImage || article.image;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: [heroImage],
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

  const faqItems = article.faq?.items?.length
    ? article.faq.items
    : (() => {
        const faqBlock = article.content.find((block) => block.type === "faq");
        return faqBlock && faqBlock.type === "faq" ? faqBlock.items : [];
      })();

  const faqJsonLd =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  const customSchema = extractCustomSchema(article.seo?.schemaScript);

  return (
    <>
      <ReadingProgress />

      <main className="relative overflow-hidden bg-ivory">
        <div
          className="pointer-events-none absolute inset-0 pattern-geometric-cream opacity-35"
          aria-hidden
        />
        <div className="container-editorial relative py-8 sm:py-10 lg:py-12">
        <ArticleHeader
          article={article}
          author={resolvedAuthor}
          category={resolvedCategory}
        />

        <div className="mt-10 grid items-start gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-12">
          <div className="order-last min-w-0 lg:order-1 lg:col-span-8">
            <ArticleTakeaways article={article} />

            <article id="article-content" className="w-full">
              <ArticleBody content={article.content} />
            </article>

            <ArticleVideoEmbed url={article.videoUrl} title={article.videoTitle} />

            <ArticleFaqSection
              faq={
                article.faq ||
                (() => {
                  const faqBlock = article.content.find((block) => block.type === "faq");
                  if (!faqBlock || faqBlock.type !== "faq" || !faqBlock.items?.length) {
                    return undefined;
                  }
                  return {
                    title: faqBlock.title,
                    description: faqBlock.description,
                    image: faqBlock.image,
                    imageAlt: faqBlock.imageAlt,
                    imageTitle: faqBlock.imageTitle,
                    imageCaption: faqBlock.imageCaption,
                    imageDescription: faqBlock.imageDescription,
                    items: faqBlock.items,
                  };
                })()
              }
            />

            {article.tags && article.tags.length > 0 ? (
              <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-border/80 pt-6">
                <span className="mr-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted">
                  <Tag className="h-3.5 w-3.5 text-sand" />
                  Topics
                </span>
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-[#e6dfd3] bg-white/80 px-3.5 py-1 text-xs font-medium text-foreground/80 transition-colors hover:border-[#c59a53]/50 hover:text-[#063b2f]"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            ) : null}

            <ArticleFeedback />

            <div className="mt-8">
              <AuthorBioCard author={resolvedAuthor} />
            </div>

            <div className="mt-8">
              <PrevNextNavigation prev={prev} next={next} />
            </div>
          </div>

          <aside className="order-first min-w-0 lg:order-2 lg:col-span-4">
            <TableOfContents
              items={toc}
              articleTitle={article.title}
              shareUrl={url}
            />
          </aside>
        </div>

        <RelatedArticles articles={related} categories={categories} />
        </div>
      </main>

      <GlobalNewsletter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            [jsonLd, breadcrumbJsonLd, faqJsonLd, customSchema].filter(Boolean)
          ),
        }}
      />
    </>
  );
}
