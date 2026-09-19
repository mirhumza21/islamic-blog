import type { Metadata } from "next";
import { getTermsPageContent } from "@/lib/pages";
import { PageHero } from "@/components/layout/PageHero";
import { ScrollText } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getTermsPageContent();
  return {
    title: content.title,
    description: "Terms of Use for UmrahZone.com",
    alternates: { canonical: "/terms" },
  };
}

export default async function TermsPage() {
  const content = await getTermsPageContent();

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={content.title}
        subtitle={`Last updated: ${content.lastUpdated}`}
        icon={<ScrollText className="h-3 w-3" />}
      />
      <section className="relative overflow-hidden bg-ivory">
        <div
          className="pointer-events-none absolute inset-0 pattern-geometric-cream opacity-40"
          aria-hidden
        />
        <div className="container-editorial relative max-w-3xl py-12 lg:py-16">
          <div
            className="prose-editorial rounded-[26px] border border-[#e6dfd3] bg-white/80 p-6 shadow-[0_8px_28px_-16px_rgba(6,59,47,0.14)] sm:p-8"
            dangerouslySetInnerHTML={{ __html: content.body }}
          />
        </div>
      </section>
    </>
  );
}
