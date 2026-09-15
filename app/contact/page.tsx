import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, PenLine, Users } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Newsletter } from "@/components/home/Newsletter";
import { siteConfig } from "@/data/categories";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with UmrahZone for questions, content corrections, collaboration, or feedback.",
  alternates: { canonical: "/contact" },
};

const contactReasons = [
  {
    icon: MessageSquare,
    title: "General questions",
    text: "Ask about our articles, guides, or how to find content on UmrahZone.",
  },
  {
    icon: PenLine,
    title: "Content corrections",
    text: "Spotted an error in a verse, reference, or factual detail? Let us know.",
  },
  {
    icon: Users,
    title: "Collaboration",
    text: "Writers, educators, and partners with aligned values are welcome to reach out.",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-border bg-cream/50 py-16 lg:py-20">
        <div className="container-editorial max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green">
            Contact
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            We&apos;d love to hear from you
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Questions, corrections, or thoughtful feedback — send us a message
            and we&apos;ll get back to you as soon as we can.
          </p>
        </div>
      </section>

      <section className="container-editorial py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Send a message
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Fill in the form below and your email app will open with everything
                ready to send.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-border bg-cream/60 p-6">
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Direct email
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Prefer email? Write to us directly.
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
                What can we help with?
              </h2>
              <ul className="mt-6 space-y-5">
                {contactReasons.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-cream/80 text-sand">
                      <item.icon className="h-4 w-4" strokeWidth={1.6} aria-hidden />
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
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card/80 p-6">
              <h2 className="text-sm font-semibold text-foreground">
                Before you write
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                UmrahZone is a content platform. We do not offer travel booking,
                visa services, or package sales. For sacred text corrections,
                please include the article link and source if possible.
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

      <Newsletter />
    </>
  );
}
