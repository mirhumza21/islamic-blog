import Image from "next/image";
import { ChevronDown, ExternalLink } from "lucide-react";
import { DuaCard } from "@/components/islamic/DuaCard";
import { HadithQuote } from "@/components/islamic/HadithQuote";
import { IslamicCallout } from "@/components/islamic/IslamicCallout";
import { QuranQuote } from "@/components/islamic/QuranQuote";
import { ensureHeadingIds, getHeadingId } from "@/lib/articles";
import type { ArticleBlock } from "@/types/blog";

export function ArticleBody({ content }: { content: ArticleBlock[] | string }) {
  if (!content) return null;

  // 1. If full HTML string
  if (typeof content === "string") {
    return (
      <div
        className="prose-editorial max-w-none blog-article-body"
        dangerouslySetInnerHTML={{ __html: ensureHeadingIds(content) }}
      />
    );
  }

  // 2. If single HTML block saved from full editor
  if (Array.isArray(content) && content.length === 1 && content[0]?.type === "html") {
    return (
      <div
        className="prose-editorial max-w-none blog-article-body"
        dangerouslySetInnerHTML={{ __html: ensureHeadingIds(content[0].text) }}
      />
    );
  }

  let hasRenderedFirstParagraph = false;

  return (
    <div className="prose-editorial max-w-none">
      {content.map((block, index) => {
        switch (block.type) {
          case "html":
            return (
              <div
                key={index}
                className="my-6 blog-article-body"
                dangerouslySetInnerHTML={{ __html: ensureHeadingIds(block.text) }}
              />
            );
          case "paragraph": {
            const isFirst = !hasRenderedFirstParagraph;
            hasRenderedFirstParagraph = true;
            // Support HTML from Tiptap (contains tags) or legacy plain text
            const isHtml = block.text?.includes("<");

            if (isHtml) {
              return (
                <div
                  key={index}
                  className={`my-6 text-[17.5px] leading-[1.85] text-foreground/85 sm:text-[18.5px] [&_strong]:font-bold [&_em]:italic [&_a]:text-emerald-700 [&_a]:underline [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 ${
                    isFirst
                      ? "first-letter:float-left first-letter:mr-3.5 first-letter:mt-1 first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:leading-none first-letter:text-green-dark sm:first-letter:text-6xl"
                      : ""
                  }`}
                  dangerouslySetInnerHTML={{ __html: block.text }}
                />
              );
            }

            return (
              <p
                key={index}
                className={`my-6 text-[17.5px] leading-[1.85] text-foreground/85 sm:text-[18.5px] ${
                  isFirst
                    ? "first-letter:float-left first-letter:mr-3.5 first-letter:mt-1 first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:leading-none first-letter:text-green-dark sm:first-letter:text-6xl"
                    : ""
                }`}
              >
                {block.text}
              </p>
            );
          }
          case "heading": {
            const id = block.id ?? getHeadingId(block.text);
            if (block.level === 2) {
              return (
                <div key={index} className="group mt-14 mb-6 scroll-mt-28 first:mt-0">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-sand">
                    <span>Part</span>
                    <span className="h-px w-8 bg-sand/40" />
                  </div>
                  <h2
                    id={id}
                    className="mt-1 pb-3 font-serif text-2xl font-bold tracking-tight text-foreground border-b border-border/80 sm:text-3xl lg:text-[2.2rem]"
                  >
                    <a
                      href={`#${id}`}
                      className="inline-flex items-baseline gap-2 transition-colors hover:text-green no-underline group-hover:text-green"
                    >
                      <span>{block.text}</span>
                      <span className="opacity-0 transition-opacity group-hover:opacity-60 text-sm font-sans text-sand">
                        #
                      </span>
                    </a>
                  </h2>
                </div>
              );
            }
            return (
              <div key={index} className="group mt-10 mb-4 scroll-mt-28">
                <h3
                  id={id}
                  className="font-serif text-xl font-bold tracking-tight text-foreground sm:text-2xl"
                >
                  <a
                    href={`#${id}`}
                    className="inline-flex items-baseline gap-2 transition-colors hover:text-green no-underline group-hover:text-green"
                  >
                    <span>{block.text}</span>
                    <span className="opacity-0 transition-opacity group-hover:opacity-60 text-xs font-sans text-sand">
                      #
                    </span>
                  </a>
                </h3>
              </div>
            );
          }
          case "list":
            return block.style === "ordered" ? (
              <ol key={index} className="my-6 space-y-3 pl-6 text-[17px] leading-relaxed text-foreground/85 list-decimal marker:font-bold marker:text-green">
                {block.items.map((item) => (
                  <li key={item} className="pl-1">{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={index} className="my-6 space-y-3 pl-6 text-[17px] leading-relaxed text-foreground/85 list-disc marker:text-sand">
                {block.items.map((item) => (
                  <li key={item} className="pl-1">{item}</li>
                ))}
              </ul>
            );
          case "image":
            return (
              <figure key={index} className="my-10">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] border border-border/80 bg-cream shadow-xs [clip-path:inset(0)]">
                  <Image
                    src={block.src}
                    alt={block.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 900px"
                    className="object-cover"
                  />
                </div>
                {block.caption ? (
                  <figcaption className="mt-3 text-center font-serif text-sm italic text-muted">
                    {block.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          case "blockquote": {
            const isHtml = block.text?.includes("<");
            return (
              <blockquote
                key={index}
                className="my-9 rounded-[22px] border-l-4 border-sand bg-gradient-to-r from-cream/80 to-card px-7 py-6 not-italic shadow-xs"
              >
                {isHtml ? (
                  <div
                    className="font-serif text-lg leading-relaxed text-foreground sm:text-xl [&_strong]:font-bold [&_em]:italic [&_a]:text-emerald-700 [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: block.text }}
                  />
                ) : (
                  <p className="font-serif text-lg leading-relaxed text-foreground sm:text-xl">
                    “{block.text}”
                  </p>
                )}
                {block.cite ? (
                  <cite className="mt-3 block text-xs font-semibold uppercase tracking-wider text-sand not-italic">
                    — {block.cite}
                  </cite>
                ) : null}
              </blockquote>
            );
          }
          case "quran":
            return (
              <QuranQuote
                key={index}
                arabic={block.arabic}
                translation={block.translation}
                surah={block.surah}
                ayah={block.ayah}
                note={block.note}
              />
            );
          case "hadith":
            return (
              <HadithQuote
                key={index}
                text={block.text}
                source={block.source}
                grade={block.grade}
                note={block.note}
              />
            );
          case "dua":
            return (
              <DuaCard
                key={index}
                title={block.title}
                arabic={block.arabic}
                transliteration={block.transliteration}
                translation={block.translation}
              />
            );
          case "callout":
            return (
              <IslamicCallout
                key={index}
                variant={block.variant}
                title={block.title}
                text={block.text}
              />
            );
          case "table":
            return (
              <div
                key={index}
                className="my-8 overflow-x-auto rounded-[22px] border border-border/80 shadow-xs"
              >
                <table className="w-full min-w-[500px] border-collapse text-left text-sm">
                  <thead className="border-b border-border bg-cream/90">
                    <tr>
                      {block.headers.map((header) => (
                        <th
                          key={header}
                          className="px-5 py-3.5 font-serif text-sm font-bold text-foreground"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 bg-card">
                    {block.rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="transition-colors hover:bg-cream/40"
                      >
                        {row.map((cell) => (
                          <td key={cell} className="px-5 py-3.5 text-muted">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "faq":
            return (
              <div key={index} className="my-12 space-y-3.5 not-prose">
                <div className="mb-5">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-green">
                    Common Questions
                  </span>
                  <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Frequently Asked Questions
                  </h2>
                </div>
                {block.items.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-[20px] border border-border/80 bg-card p-5 shadow-xs transition-colors hover:border-green/40 open:border-green/50 open:bg-cream/20"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between font-serif text-base font-bold text-foreground sm:text-lg">
                      <span>{item.question}</span>
                      <ChevronDown className="h-4 w-4 text-muted transition-transform duration-200 group-open:rotate-180 group-open:text-green" />
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted border-t border-border/60 pt-3">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            );
          case "video":
            return (
              <div
                key={index}
                className="my-8 overflow-hidden rounded-[22px] border border-border/80 shadow-xs"
              >
                <div className="aspect-video bg-cream">
                  <iframe
                    src={block.src}
                    title={block.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
