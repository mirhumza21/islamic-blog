import type { Metadata } from "next";
import Link from "next/link";
import { GlobalNewsletter } from "@/components/home/GlobalNewsletter";
import { PageHero } from "@/components/layout/PageHero";
import { siteConfig } from "@/data/categories";
import { getAboutPageContent } from "@/lib/pages";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about UmrahZone’s mission, editorial standards, and commitment to practical Islamic knowledge.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const content = await getAboutPageContent();
  const principles = content.principles || [];

  return (
    <>
      <PageHero
        eyebrow={content.eyebrow || "About UmrahZone"}
        title={content.headline || "Knowledge today, a closer tomorrow"}
        subtitle={
          content.subheadline ||
          "UmrahZone is a premium editorial platform for Muslims seeking clear guidance on Umrah, Hajj, Quran & duas, travel, and everyday Islamic living."
        }
        icon={<Sparkles className="h-3 w-3" />}
      />

      <section className="relative overflow-hidden bg-ivory">
        <div
          className="pointer-events-none absolute inset-0 pattern-geometric-cream opacity-40"
          aria-hidden
        />
        <div className="container-editorial relative grid gap-12 py-14 lg:grid-cols-12 lg:py-16">
          <div className="lg:col-span-7">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-[#141d1a]">
              {content.missionTitle || "Our Mission"}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg whitespace-pre-line">
              {content.missionText ||
                "We exist to make trusted Islamic knowledge feel approachable — especially for people preparing for sacred journeys or rebuilding daily habits of faith. Our work aims to reduce confusion, deepen intention, and accompany readers with calm, practical writing."}
            </p>

            <h2 className="mt-12 font-serif text-3xl font-bold tracking-tight text-[#141d1a]">
              {content.whyWeExistTitle || "Why UmrahZone Exists"}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg whitespace-pre-line">
              {content.whyWeExistText ||
                "Too many Umrah resources feel either overly commercial or difficult to follow. We built UmrahZone as a content-first home: no package pressure, no checkout noise — just guidance you can read, trust, and return to."}
            </p>

            <h2 className="mt-12 font-serif text-3xl font-bold tracking-tight text-[#141d1a]">
              {content.authenticityTitle || "Authenticity & Sources"}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg whitespace-pre-line">
              {content.authenticityText ||
                "Sacred texts deserve precision. Sample Quran and Hadith blocks in early content are clearly marked as demo placeholders until replaced with verified wording from reliable sources and scholarly review."}
            </p>

            <h2 className="mt-12 font-serif text-3xl font-bold tracking-tight text-[#141d1a]">
              {content.editorialStandardsTitle || "Editorial Standards"}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg whitespace-pre-line">
              {content.editorialStandardsText ||
                "Articles are written for readability, structured for scanning, and reviewed for tone, usefulness, and factual care. We prioritize humility over certainty when rulings may differ."}
            </p>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-[26px] border border-[#e6dfd3] bg-white/80 p-6 shadow-[0_8px_28px_-16px_rgba(6,59,47,0.14)] sm:p-7">
              <h2 className="font-serif text-2xl font-bold tracking-tight text-[#141d1a]">
                {content.principlesTitle || "Our Content Principles"}
              </h2>
              <ul className="mt-6 space-y-5">
                {principles.map((item: { title: string; text: string }, idx: number) => (
                  <li key={idx}>
                    <h3 className="text-sm font-semibold text-[#063b2f]">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 overflow-hidden rounded-[26px] border border-[#ecdcc3] bg-gradient-to-br from-[#faf6ef] to-[#f5ede0] p-6 shadow-[0_8px_28px_-16px_rgba(6,59,47,0.1)] sm:p-7">
              <h2 className="font-serif text-2xl font-bold tracking-tight text-[#141d1a]">
                {content.contactTitle || "Contact"}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {content.contactText ||
                  "Questions, corrections, or collaboration ideas are welcome."}
              </p>
              <p className="mt-4 text-sm font-medium text-[#141d1a]">
                {content.contactEmail || siteConfig.email}
              </p>
              <Link
                href={content.contactButtonUrl || "/contact"}
                className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#063b2f] px-7 text-[14px] font-semibold text-white shadow-[0_2px_12px_rgba(6,59,47,0.25)] transition-[background-color,box-shadow] duration-200 hover:bg-[#042d24]"
              >
                {content.contactButtonText || "Go to contact page"}
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <GlobalNewsletter />
    </>
  );
}
