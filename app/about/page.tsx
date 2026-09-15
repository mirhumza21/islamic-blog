import type { Metadata } from "next";
import Link from "next/link";
import { Newsletter } from "@/components/home/Newsletter";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/categories";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about UmrahZone’s mission, editorial standards, and commitment to practical Islamic knowledge.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    title: "Clarity over complexity",
    text: "We explain rites, travel, and faith topics in plain language without diluting meaning.",
  },
  {
    title: "Practical before performative",
    text: "Every article should help a reader prepare, understand, or grow — not merely fill a page.",
  },
  {
    title: "Respect for sacred knowledge",
    text: "Quran and Hadith references must be verified. Until verified, we mark content clearly as demo.",
  },
  {
    title: "Calm, trustworthy tone",
    text: "We write for everyday Muslims with warmth, dignity, and zero sensationalism.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border bg-cream/50 py-16 lg:py-20">
        <div className="container-editorial max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green">
            About UmrahZone
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Knowledge today, a closer tomorrow
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            UmrahZone is a premium editorial platform for Muslims seeking clear
            guidance on Umrah, Hajj, Quran & duas, travel, and everyday Islamic
            living.
          </p>
        </div>
      </section>

      <section className="container-editorial grid gap-12 py-14 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-7">
          <h2 className="font-serif text-3xl font-semibold text-foreground">
            Our Mission
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            We exist to make trusted Islamic knowledge feel approachable —
            especially for people preparing for sacred journeys or rebuilding
            daily habits of faith. Our work aims to reduce confusion, deepen
            intention, and accompany readers with calm, practical writing.
          </p>

          <h2 className="mt-12 font-serif text-3xl font-semibold text-foreground">
            Why UmrahZone Exists
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            Too many Umrah resources feel either overly commercial or difficult
            to follow. We built UmrahZone as a content-first home: no package
            pressure, no checkout noise — just guidance you can read, trust, and
            return to.
          </p>

          <h2 className="mt-12 font-serif text-3xl font-semibold text-foreground">
            Authenticity & Sources
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            Sacred texts deserve precision. Sample Quran and Hadith blocks in
            early content are clearly marked as demo placeholders until replaced
            with verified wording from reliable sources and scholarly review.
          </p>

          <h2 className="mt-12 font-serif text-3xl font-semibold text-foreground">
            Editorial Standards
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            Articles are written for readability, structured for scanning, and
            reviewed for tone, usefulness, and factual care. We prioritize
            humility over certainty when rulings may differ.
          </p>
        </div>

        <aside className="lg:col-span-5">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              Our Content Principles
            </h2>
            <ul className="mt-6 space-y-5">
              {principles.map((item) => (
                <li key={item.title}>
                  <h3 className="text-sm font-semibold text-green">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-cream/70 p-6">
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              Contact
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Questions, corrections, or collaboration ideas are welcome.
            </p>
            <p className="mt-4 text-sm font-medium text-foreground">
              {siteConfig.email}
            </p>
            <Button asChild className="mt-5">
              <Link href="/contact">Go to contact page</Link>
            </Button>
          </div>
        </aside>
      </section>

      <Newsletter />
    </>
  );
}
