import { heroContent } from "@/data/navigation";

export function HeroQuote() {
  return (
    <aside
      className="rounded-[20px] border border-white/50 bg-ivory/95 p-5 backdrop-blur-md"
      aria-label={heroContent.quote.note}
    >
      <span
        className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-sand/15 text-sand"
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M12.2 3.4c-3.8 0-6.8 2.4-6.8 5.8 0 2.2 1.2 4 3.1 5-.4 1.6-1.4 3-2.9 4.1-.2.1-.1.4.1.4 2.6-.2 4.9-1.5 6.4-3.5 3.5-.3 6.1-2.8 6.1-5.9 0-3.5-2.7-5.9-6-5.9z" />
        </svg>
      </span>
      <blockquote className="font-serif text-[1.15rem] leading-snug text-foreground sm:text-[1.25rem]">
        “{heroContent.quote.text}”
      </blockquote>
      <p className="mt-3 text-sm italic text-muted">
        — {heroContent.quote.reference}
      </p>
    </aside>
  );
}
