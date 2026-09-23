"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArticleFaq } from "@/types/blog";

export function ArticleFaqSection({ faq }: { faq?: ArticleFaq }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (!faq?.items?.length) return null;

  const hasImage = Boolean(faq.image?.trim());

  return (
    <section className="mt-14 rounded-[28px] border border-[#e6dfd3] bg-[#f6f1e8] p-6 sm:p-8">
      {(faq.title || faq.description) && (
        <div className="mb-6 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#c59a53]">
            Common Questions
          </span>
          {faq.title ? (
            <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#141d1a] sm:text-3xl">
              {faq.title}
            </h2>
          ) : null}
          {faq.description ? (
            <p className="mt-2 text-sm leading-relaxed text-[#647470]">{faq.description}</p>
          ) : null}
        </div>
      )}

      <div className={cn("grid gap-6", hasImage ? "lg:grid-cols-12" : "")}>
        {hasImage ? (
          <figure className="lg:col-span-5">
            <div className="relative aspect-[1.4] overflow-hidden rounded-[22px] border border-[#c59a53]/40 bg-[#efe7d8]">
              <Image
                src={faq.image!}
                alt={faq.imageAlt || faq.title || "FAQ illustration"}
                title={faq.imageTitle}
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover"
              />
            </div>
            {faq.imageCaption ? <figcaption className="sr-only">{faq.imageCaption}</figcaption> : null}
            {faq.imageDescription ? <p className="sr-only">{faq.imageDescription}</p> : null}
          </figure>
        ) : null}

        <div className={cn("space-y-2", hasImage ? "lg:col-span-7" : "")}>
          {faq.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={`${item.question}-${index}`}
                className={cn(
                  "overflow-hidden rounded-[18px] border transition-colors",
                  isOpen
                    ? "border-[#c59a53] bg-[#fcf9f2]"
                    : "border-[#eadfc8] bg-white/70 hover:border-[#c59a53]/50"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <h3 className="font-serif text-sm font-bold text-[#141d1a] sm:text-base">
                    {item.question}
                  </h3>
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                      isOpen ? "bg-[#c59a53] text-white" : "border border-[#c59a53] text-[#c59a53]"
                    )}
                  >
                    {isOpen ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                  </span>
                </button>
                {isOpen && item.answer ? (
                  <p className="border-t border-[#eadfc8] px-4 py-3 text-sm leading-relaxed text-[#647470]">
                    {item.answer}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
