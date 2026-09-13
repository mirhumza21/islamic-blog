import { cn } from "@/lib/utils";

export function HadithQuote({
  text,
  source,
  grade,
  note,
  className,
}: {
  text: string;
  source: string;
  grade?: string;
  note?: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "my-8 rounded-2xl border-l-4 border-sand bg-card px-5 py-5 sm:px-6",
        className
      )}
    >
      <figcaption className="text-xs font-semibold uppercase tracking-[0.14em] text-green">
        Hadith
      </figcaption>
      <blockquote className="mt-3 font-serif text-xl leading-relaxed text-foreground">
        “{text}”
      </blockquote>
      <p className="mt-3 text-sm text-muted">
        Source: {source}
        {grade ? ` · ${grade}` : ""}
      </p>
      {note ? <p className="mt-2 text-xs italic text-muted">{note}</p> : null}
    </figure>
  );
}
