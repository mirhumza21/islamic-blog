import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Article } from "@/types/blog";

export function PrevNextNavigation({
  prev,
  next,
}: {
  prev?: Article;
  next?: Article;
}) {
  if (!prev && !next) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/blog/${prev.slug}`}
          className="group flex flex-col justify-between rounded-[22px] border border-border/80 bg-card p-5 shadow-xs transition-colors hover:border-green/40 hover:bg-cream/20"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted group-hover:text-green">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Previous Guide</span>
          </div>
          <h4 className="mt-3 font-serif text-base font-bold leading-snug text-foreground transition-colors group-hover:text-green line-clamp-2">
            {prev.title}
          </h4>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="group flex flex-col justify-between items-end text-right rounded-[22px] border border-border/80 bg-card p-5 shadow-xs transition-colors hover:border-green/40 hover:bg-cream/20"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted group-hover:text-green">
            <span>Next Guide</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
          <h4 className="mt-3 font-serif text-base font-bold leading-snug text-foreground transition-colors group-hover:text-green line-clamp-2">
            {next.title}
          </h4>
        </Link>
      ) : null}
    </div>
  );
}
