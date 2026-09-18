import type { Metadata } from "next";
import { getTermsPageContent } from "@/lib/pages";

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
    <section className="container-editorial max-w-3xl py-14 lg:py-16">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground">
        {content.title}
      </h1>
      <p className="mt-4 text-muted">Last updated: {content.lastUpdated}</p>
      <div
        className="prose-editorial mt-8"
        dangerouslySetInnerHTML={{ __html: content.body }}
      />
    </section>
  );
}
