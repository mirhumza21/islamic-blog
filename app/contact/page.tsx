import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, PenLine, Users } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { GlobalNewsletter } from "@/components/home/GlobalNewsletter";
import { siteConfig } from "@/data/categories";
import { getContactPageContent } from "@/lib/pages";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with UmrahZone for questions, content corrections, collaboration, or feedback.",
  alternates: { canonical: "/contact" },
};

const reasonIcons = [MessageSquare, PenLine, Users];

export default async function ContactPage() {
  const content = await getContactPageContent();
  const reasons = content.reasons || [];

  return (
    <>
      <section className="border-b border-border bg-cream/50 py-16 lg:py-20">
        <div className="container-editorial max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green">
            {content.eyebrow}
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {content.headline}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {content.subheadline}
          </p>
        </div>
      </section>

      <section className="container-editorial py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                {content.formTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {content.formText}
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-border bg-cream/60 p-6">
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                {content.emailTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {content.emailText}
              </p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-green transition-colors hover:text-green-dark"
              >
                <Mail className="h-4 w-4" />
                {siteConfig.email}
              </a>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                {content.helpTitle}
              </h2>
              <ul className="mt-6 space-y-5">
                {reasons.map((item: { title: string; text: string }, index: number) => {
                  const Icon = reasonIcons[index] || MessageSquare;
                  return (
                    <li key={item.title} className="flex gap-3">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-cream/80 text-sand">
                        <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden />
                      </span>
                      <span>
                        <h3 className="text-sm font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted">
                          {item.text}
                        </p>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card/80 p-6">
              <h2 className="text-sm font-semibold text-foreground">
                {content.noteTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {content.noteText}
              </p>
              <p className="mt-4 text-sm text-muted">
                See also{" "}
                <Link href="/about" className="font-medium text-green hover:underline">
                  About UmrahZone
                </Link>{" "}
                and our{" "}
                <Link href="/privacy" className="font-medium text-green hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </aside>
        </div>
      </section>

      <GlobalNewsletter />
    </>
  );
}
