import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of Use for UmrahZone.com",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <section className="container-editorial max-w-3xl py-14 lg:py-16">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground">
        Terms of Use
      </h1>
      <p className="mt-4 text-muted">Last updated: March 10, 2026</p>
      <div className="prose-editorial mt-8">
        <p>
          By using UmrahZone, you agree to read content for personal educational
          and inspirational purposes. Articles are general information and are
          not a substitute for qualified scholarly or legal advice.
        </p>
        <h2>Content accuracy</h2>
        <p>
          We strive for clarity and care. Ritual details can vary by school of
          thought. Always verify important religious rulings with a trusted
          scholar.
        </p>
        <h2>Intellectual property</h2>
        <p>
          Site design and original editorial content belong to UmrahZone unless
          otherwise noted. Please do not republish substantial content without
          permission.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent to{" "}
          <a href="mailto:hello@umrahzone.com">hello@umrahzone.com</a>.
        </p>
      </div>
    </section>
  );
}
