import Image from "next/image";
import { DuaCard } from "@/components/islamic/DuaCard";
import { HadithQuote } from "@/components/islamic/HadithQuote";
import { IslamicCallout } from "@/components/islamic/IslamicCallout";
import { QuranQuote } from "@/components/islamic/QuranQuote";
import { getHeadingId } from "@/lib/articles";
import type { ArticleBlock } from "@/types/blog";

export function ArticleBody({ content }: { content: ArticleBlock[] }) {
  return (
    <div className="prose-editorial">
      {content.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return <p key={index}>{block.text}</p>;
          case "heading": {
            const id = block.id ?? getHeadingId(block.text);
            if (block.level === 2) {
              return (
                <h2 key={index} id={id} className="scroll-mt-28">
                  {block.text}
                </h2>
              );
            }
            return (
              <h3 key={index} id={id} className="scroll-mt-28">
                {block.text}
              </h3>
            );
          }
          case "list":
            return block.style === "ordered" ? (
              <ol key={index}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={index}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "image":
            return (
              <figure key={index} className="my-8">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                  <Image
                    src={block.src}
                    alt={block.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 900px"
                    className="object-cover"
                  />
                </div>
                {block.caption ? (
                  <figcaption className="mt-2 text-center text-sm text-muted">
                    {block.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          case "blockquote":
            return (
              <blockquote key={index}>
                <p>{block.text}</p>
                {block.cite ? <cite>— {block.cite}</cite> : null}
              </blockquote>
            );
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
              <div key={index} className="my-8 overflow-x-auto rounded-2xl border border-border">
                <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                  <thead className="bg-cream">
                    <tr>
                      {block.headers.map((header) => (
                        <th key={header} className="px-4 py-3 font-semibold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-t border-border">
                        {row.map((cell) => (
                          <td key={cell} className="px-4 py-3 text-muted">
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
              <div key={index} className="my-8 space-y-3 not-prose">
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  Frequently asked questions
                </h2>
                {block.items.map((item) => (
                  <details
                    key={item.question}
                    className="rounded-2xl border border-border bg-card px-4 py-3"
                  >
                    <summary className="cursor-pointer list-none font-medium text-foreground">
                      {item.question}
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            );
          case "video":
            return (
              <div key={index} className="my-8 overflow-hidden rounded-2xl border border-border">
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
