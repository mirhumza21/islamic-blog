import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { ArticleFaqSection } from "@/components/blog/ArticleFaqSection";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { ArticleVideoEmbed } from "@/components/blog/ArticleVideoEmbed";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { TableOfContents } from "@/components/blog/TableOfContents";
import {
  extractTableOfContents,
  fetchAllArticles,
  fetchAllCategories,
  fetchArticleBySlug,
  fetchAuthorById,
  fetchRelatedArticles,
} from "@/lib/articles";
import { SocialIcons } from "@/components/layout/SocialIcons";
import { getSocialLinks } from "@/lib/pages";
import { absoluteUrl } from "@/lib/utils";

function normalizeJsonLdObject(raw: any): any[] {
  if (!raw || typeof raw !== "object") return [];
  if (Array.isArray(raw)) {
    return raw.flatMap(normalizeJsonLdObject);
  }
  // Handles SEO extension export format { microdata: null, jsonld: [...], graph: null }
  if (Array.isArray(raw.jsonld) || Array.isArray(raw.graph)) {
    const list = [...(raw.jsonld || []), ...(raw.graph || [])];
    return list.flatMap(normalizeJsonLdObject);
  }
  if (raw["@graph"] && Array.isArray(raw["@graph"])) {
    const ctx = raw["@context"] || "https://schema.org";
    return [{ ...raw, "@context": ctx }];
  }
  if (raw["@type"] || raw["@context"]) {
    const ctx = raw["@context"] || "https://schema.org";
    return [{ ...raw, "@context": ctx }];
  }
  const ctx = raw["@context"] || "https://schema.org";
  return [{ ...raw, "@context": ctx }];
}

function extractJsonLdPayloads(script?: string): string[] {
  if (!script?.trim()) return [];
  let text = script.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  const fromTags: string[] = [];
  const scriptRe = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = scriptRe.exec(text))) {
    const inner = match[1]?.trim();
    if (inner) fromTags.push(inner);
  }

  const chunks = fromTags.length
    ? fromTags
    : [text.replace(/<\/?script[^>]*>/gi, "").trim()];

  const parsedItems: any[] = [];
  for (const chunk of chunks) {
    const trimmedChunk = chunk.trim();
    if (!trimmedChunk) continue;
    try {
      const parsed = JSON.parse(trimmedChunk);
      parsedItems.push(...normalizeJsonLdObject(parsed));
    } catch {
      try {
        const cleaned = trimmedChunk.replace(/,\s*([}\]])/g, "$1");
        const parsed = JSON.parse(cleaned);
        parsedItems.push(...normalizeJsonLdObject(parsed));
      } catch {
        if (trimmedChunk.startsWith("{") || trimmedChunk.startsWith("[")) {
          parsedItems.push(trimmedChunk);
        }
      }
    }
  }

  return parsedItems
    .map((item) => (typeof item === "string" ? item : JSON.stringify(item)))
    .filter(Boolean);
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
  const heroPath = article.coverImage || article.image;
  const heroImage = heroPath.startsWith("/") ? absoluteUrl(heroPath) : heroPath;
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
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
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

  const [author, allArticles, categories, socialLinks] = await Promise.all([
    fetchAuthorById(article.authorId),
    fetchAllArticles(),
    fetchAllCategories(),
    getSocialLinks(),
  ]);
  const resolvedAuthor = author ?? {
    id: article.authorId || "umrahzone",
    name: "UmrahZone",
    avatar: "",
    bio: "UmrahZone editorial team",
  };

  const toc = extractTableOfContents(article);
  const related = await fetchRelatedArticles(article, 4, allArticles);
  const url = absoluteUrl(`/blog/${article.slug}`);

  const heroPath = article.coverImage || article.image;
  const heroImage = heroPath.startsWith("/") ? absoluteUrl(heroPath) : heroPath;
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

  const customSchemas = extractJsonLdPayloads(article.seo?.schemaScript);

  let pageSchemas: string[];
  if (customSchemas.length > 0) {
    const customText = customSchemas.join(" ");
    const hasFaq = /"FAQPage"/i.test(customText);
    const hasBreadcrumb = /"BreadcrumbList"/i.test(customText);
    const supplementary = [
      !hasBreadcrumb ? breadcrumbJsonLd : null,
      !hasFaq ? faqJsonLd : null,
    ]
      .filter(Boolean)
      .map((schema) => JSON.stringify(schema));

    // Custom schemas take priority, replace the automatic BlogPosting schema, and render FIRST
    pageSchemas = [...customSchemas, ...supplementary];
  } else {
    // Default fallback: automatic BlogPosting + Breadcrumbs + FAQ
    pageSchemas = [jsonLd, breadcrumbJsonLd, faqJsonLd]
      .filter(Boolean)
      .map((schema) => JSON.stringify(schema));
  }

  return (
    <>
      <ReadingProgress />

      <main className="relative overflow-clip bg-ivory">
        <div
          className="pointer-events-none absolute inset-0 pattern-geometric-cream opacity-35"
          aria-hidden
        />
        <div className="container-editorial relative pt-3 pb-12 sm:pt-4 lg:pb-16">
        <ArticleHeader article={article} author={resolvedAuthor} />

        <div className="mt-10 grid items-start gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-12">
          <div className="order-last min-w-0 lg:order-1 lg:col-span-8">
            <article id="article-content" className="w-full">
              <ArticleBody content={article.content} />
            </article>

            <ArticleVideoEmbed url={article.videoUrl} title={article.videoTitle} />

            {socialLinks.length > 0 ? (
              <div className="mt-10 flex flex-col gap-4 border-t border-[#e6dfd3] pt-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#063b2f]">Follow UmrahZone</p>
                  <p className="mt-1 text-sm text-muted">Guides, reminders, and updates on our social pages.</p>
                </div>
                <SocialIcons links={socialLinks} />
              </div>
            ) : null}
          </div>

          <aside className="order-first min-w-0 lg:order-2 lg:col-span-4 lg:self-stretch">
            <TableOfContents items={toc} />
          </aside>
        </div>

        <div className="mt-14 sm:mt-16">
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
        </div>

        <RelatedArticles
          articles={related}
          categories={categories}
          title={article.relatedTitle}
          description={article.relatedDescription}
        />
        </div>
      </main>

      {pageSchemas.map((schema, index) => (
        <script
          key={`article-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema }}
        />
      ))}
    </>
  );
}
