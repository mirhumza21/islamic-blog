import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for UmrahZone.com",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="container-editorial max-w-3xl py-14 lg:py-16">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground">
        Privacy Policy
      </h1>
      <p className="mt-4 text-muted">Last updated: March 10, 2026</p>
      <div className="prose-editorial mt-8">
        <p>
          UmrahZone respects your privacy. This page explains what information
          we may collect when you browse the site or subscribe to updates.
        </p>
        <h2>Information we collect</h2>
        <p>
          If you subscribe to our newsletter, we collect the email address you
          provide. Standard analytics or hosting logs may collect technical data
          such as browser type and approximate location.
        </p>
        <h2>How we use information</h2>
        <p>
          Email addresses are used only to send requested updates. We do not sell
          personal information.
        </p>
        <h2>Contact</h2>
        <p>
          For privacy questions, email{" "}
          <a href="mailto:hello@umrahzone.com">hello@umrahzone.com</a>.
        </p>
      </div>
    </section>
  );
}
