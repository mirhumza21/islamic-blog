import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, PenLine, Users } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { GlobalNewsletter } from "@/components/home/GlobalNewsletter";
import { PageHero } from "@/components/layout/PageHero";
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
      <PageHero
        eyebrow={content.eyebrow}
        title={content.headline}
        subtitle={content.subheadline}
        icon={<Mail className="h-3 w-3" />}
      />

      <section className="relative overflow-hidden bg-ivory">
        <div
          className="pointer-events-none absolute inset-0 pattern-geometric-cream opacity-40"
          aria-hidden
        />
        <div className="container-editorial relative py-14 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <div className="rounded-[26px] border border-[#e6dfd3] bg-white/80 p-6 shadow-[0_8px_28px_-16px_rgba(6,59,47,0.14)] sm:p-8">
                <h2 className="font-serif text-2xl font-bold tracking-tight text-[#141d1a]">
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
              <div className="overflow-hidden rounded-[26px] border border-[#ecdcc3] bg-gradient-to-br from-[#faf6ef] to-[#f5ede0] p-6 shadow-[0_8px_28px_-16px_rgba(6,59,47,0.1)]">
                <h2 className="font-serif text-2xl font-bold tracking-tight text-[#141d1a]">
                  {content.emailTitle}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {content.emailText}
                </p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#063b2f] transition-colors hover:text-[#042d24]"
                >
                  <Mail className="h-4 w-4 text-[#c59a53]" />
                  {siteConfig.email}
                </a>
              </div>

              <div className="rounded-[26px] border border-[#e6dfd3] bg-white/80 p-6 shadow-[0_8px_28px_-16px_rgba(6,59,47,0.14)]">
                <h2 className="font-serif text-2xl font-bold tracking-tight text-[#141d1a]">
                  {content.helpTitle}
                </h2>
                <ul className="mt-6 space-y-5">
                  {reasons.map((item: { title: string; text: string }, index: number) => {
                    const Icon = reasonIcons[index] || MessageSquare;
                    return (
                      <li key={item.title} className="flex gap-3">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand/15 text-[#b8894a]">
                          <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden />
                        </span>
                        <span>
                          <h3 className="text-sm font-semibold text-[#141d1a]">
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

              <div className="rounded-[26px] border border-[#e6dfd3] bg-white/80 p-6 shadow-[0_8px_28px_-16px_rgba(6,59,47,0.14)]">
                <h2 className="text-sm font-semibold text-[#141d1a]">
                  {content.noteTitle}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {content.noteText}
                </p>
                <p className="mt-4 text-sm text-muted">
                  See also{" "}
                  <Link href="/about" className="font-medium text-[#063b2f] hover:underline">
                    About UmrahZone
                  </Link>{" "}
                  and our{" "}
                  <Link href="/privacy" className="font-medium text-[#063b2f] hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <GlobalNewsletter />
    </>
  );
}
