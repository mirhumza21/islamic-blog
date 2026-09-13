import { cn } from "@/lib/utils";

export function QuranQuote({
  arabic,
  translation,
  surah,
  ayah,
  note,
  className,
}: {
  arabic: string;
  translation: string;
  surah: string;
  ayah: string;
  note?: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "my-8 overflow-hidden rounded-2xl border border-border bg-cream/80 px-5 py-6 sm:px-7",
        className
      )}
    >
      <figcaption className="text-xs font-semibold uppercase tracking-[0.14em] text-green">
        Quran {surah} · {ayah}
      </figcaption>
      <blockquote
        dir="rtl"
        lang="ar"
        className="mt-4 font-arabic text-[1.65rem] leading-[2.1] text-foreground sm:text-[1.85rem]"
      >
        {arabic}
      </blockquote>
      <p className="mt-4 text-base leading-relaxed text-muted">{translation}</p>
      {note ? (
        <p className="mt-3 text-xs italic text-muted/90">{note}</p>
      ) : null}
    </figure>
  );
}
