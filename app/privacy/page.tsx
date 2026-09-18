import type { Metadata } from "next";
import { getPrivacyPageContent } from "@/lib/pages";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPrivacyPageContent();
  return {
    title: content.title,
    description: "Privacy Policy for UmrahZone.com",
    alternates: { canonical: "/privacy" },
  };
}

export default async function PrivacyPage() {
  const content = await getPrivacyPageContent();

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
