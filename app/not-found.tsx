import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <PageHero
        eyebrow="404"
        title="Page not found"
        subtitle="The page you are looking for may have moved. Try searching or return home."
        align="center"
        icon={<Compass className="h-3 w-3" />}
      />
      <section className="relative overflow-hidden bg-ivory">
        <div
          className="pointer-events-none absolute inset-0 pattern-geometric-cream opacity-40"
          aria-hidden
        />
        <div className="container-editorial relative flex justify-center gap-3 py-10 pb-20">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#063b2f] px-7 text-[14px] font-semibold text-white shadow-[0_2px_12px_rgba(6,59,47,0.25)] transition-colors hover:bg-[#042d24]"
          >
            Go home
          </Link>
          <Link
            href="/search"
            className="inline-flex h-12 items-center justify-center rounded-full border border-[#c59a53]/60 bg-white/70 px-7 text-[14px] font-semibold text-[#141d1a] transition-colors hover:border-[#063b2f] hover:text-[#063b2f]"
          >
            Search
          </Link>
        </div>
      </section>
    </>
  );
}
