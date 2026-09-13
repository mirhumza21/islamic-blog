import { cn } from "@/lib/utils";

export function DuaCard({
  title,
  arabic,
  transliteration,
  translation,
  className,
}: {
  title: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "my-8 rounded-2xl border border-border bg-gradient-to-br from-card to-cream p-5 sm:p-6",
        className
      )}
    >
      <h3 className="font-serif text-2xl font-semibold text-foreground">{title}</h3>
      <p
        dir="rtl"
        lang="ar"
        className="mt-4 font-arabic text-[1.55rem] leading-[2] text-green"
      >
        {arabic}
      </p>
      {transliteration ? (
        <p className="mt-3 text-sm italic text-muted">{transliteration}</p>
      ) : null}
      <p className="mt-3 text-base leading-relaxed text-foreground/90">
        {translation}
      </p>
    </div>
  );
}
