import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { ShareArticle } from "@/components/blog/ShareArticle";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { Newsletter } from "@/components/home/Newsletter";
import {
  extractTableOfContents,
  getAllArticles,
  getAllCategories,
  getArticleBySlug,
  getAuthorById,
  getCategoryBySlug,
  getRelatedArticles,
} from "@/lib/articles";
import { absoluteUrl } from "@/lib/utils";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
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
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const author = getAuthorById(article.authorId);
  const category = getCategoryBySlug(article.categorySlug);
  if (!author || !category) notFound();

  const toc = extractTableOfContents(article);
  const related = getRelatedArticles(article, 3);
  const categories = getAllCategories();
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
      name: author.name,
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
      <article className="container-editorial py-10 lg:py-14">
        <ArticleHeader
          article={article}
          author={author}
          category={category}
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3 lg:order-1">
            <TableOfContents items={toc} />
          </div>

          <div className="mx-auto w-full max-w-[720px] lg:col-span-9 lg:order-2 xl:max-w-[740px]">
            <div id="article-content">
              <ArticleBody content={article.content} />
            </div>

            <div className="mt-10 border-t border-border pt-6">
              <ShareArticle title={article.title} url={url} />
            </div>

            <RelatedArticles articles={related} categories={categories} />
          </div>
        </div>
      </article>

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
