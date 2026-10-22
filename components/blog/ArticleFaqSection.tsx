"use client";

import { useState } from "react";
import Image from "next/image";
import { HelpCircle, Minus, Plus } from "lucide-react";
import { SectionHeader } from "@/components/home/SectionHeader";
import { cn } from "@/lib/utils";
import type { ArticleFaq } from "@/types/blog";

const FAQ_PANEL_HEIGHT =
  "h-[250px] sm:h-[300px] lg:h-[min(420px,48vh)] lg:max-h-[420px]";

export function ArticleFaqSection({ faq }: { faq?: ArticleFaq }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (!faq?.items?.length) return null;

  const title = faq.title?.trim() || faq.imageCaption?.trim() || "";
  const description = faq.description?.trim() || faq.imageDescription?.trim() || "";
  const hasImage = Boolean(faq.image?.trim());

  return (
    <section>
      <SectionHeader
        eyebrow="FAQs"
        title={title || "Questions"}
        icon={<HelpCircle className="h-3 w-3" />}
        tone="sand"
      />
      {description ? (
        <p className="-mt-3 mb-8 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          {description}
        </p>
      ) : null}

        <div
          className={cn(
            "grid grid-cols-1 items-start gap-6 lg:gap-8",
            hasImage ? "lg:grid-cols-12 lg:items-stretch" : "max-w-3xl"
          )}
        >
          {hasImage ? (
            <figure className="min-w-0 lg:col-span-5">
              <div
                className={cn(
                  "relative w-full overflow-hidden rounded-[24px] border border-[#e6dfd3] bg-cream shadow-[0_12px_40px_-16px_rgba(6,59,47,0.18)]",
                  FAQ_PANEL_HEIGHT
                )}
              >
                <Image
                  src={faq.image!}
                  alt={faq.imageAlt?.trim() || title || "FAQ illustration"}
                  title={faq.imageTitle?.trim() || undefined}
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover object-center"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
              </div>
              {faq.imageCaption?.trim() && faq.imageCaption.trim() !== title ? (
                <figcaption className="sr-only">{faq.imageCaption}</figcaption>
              ) : null}
              {faq.imageDescription?.trim() &&
              faq.imageDescription.trim() !== description ? (
                <p className="sr-only">{faq.imageDescription}</p>
              ) : null}
            </figure>
          ) : null}

          <div
            className={cn(
              "flex min-w-0 flex-col gap-2",
              hasImage && cn("faq-list-scroll overflow-y-auto pr-1.5", FAQ_PANEL_HEIGHT),
              hasImage && "lg:col-span-7"
            )}
          >
            {faq.items.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={`${item.question}-${index}`}
                  className={cn(
                    "shrink-0 overflow-hidden rounded-[20px] border transition-colors duration-300",
                    isOpen
                      ? "border-[#063b2f]/30 bg-white shadow-[0_8px_28px_-16px_rgba(6,59,47,0.18)]"
                      : "border-[#e6dfd3] bg-white/80 hover:border-[#c59a53]/60"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left sm:px-5 sm:py-3"
                  >
                    <h3
                      className={cn(
                        "min-w-0 flex-1 font-serif text-[15px] font-bold leading-snug sm:text-base",
                        isOpen ? "text-[#063b2f]" : "text-[#141d1a]"
                      )}
                    >
                      {item.question}
                    </h3>
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                        isOpen
                          ? "bg-[#063b2f] text-white"
                          : "border border-[#c59a53] text-[#c59a53]"
                      )}
                    >
                      {isOpen ? (
                        <Minus className="h-3 w-3" strokeWidth={2.5} />
                      ) : (
                        <Plus className="h-3 w-3" strokeWidth={2} />
                      )}
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      {item.answer ? (
                        <div className="px-4 pb-3.5 sm:px-5">
                          <div className="mb-2.5 flex items-center opacity-70">
                            <div className="h-px flex-1 bg-[#c59a53]" />
                            <div className="mx-3 h-1.5 w-1.5 rotate-45 border border-[#c59a53]" />
                            <div className="h-px flex-1 bg-[#c59a53]" />
                          </div>
                          <p className="text-sm font-normal leading-[1.75] text-muted">
                            {item.answer}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
    </section>
  );
}
