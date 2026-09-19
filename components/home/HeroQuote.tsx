import { heroContent } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function HeroQuote({
  className,
  content,
}: {
  className?: string;
  content?: typeof heroContent;
}) {
  const data = content || heroContent;
  const arabic = data.quote?.arabic?.trim();
  const text = data.quote?.text || heroContent.quote.text;
  const reference = data.quote?.reference || heroContent.quote.reference;

  return (
    <aside
      className={cn("max-w-[36rem] border-l-2 border-gold/70 pl-4", className)}
      aria-label="Quranic verse"
    >
      {arabic ? (
        <p
          dir="rtl"
          lang="ar"
          className="arabic-verse font-arabic text-[1.25rem] leading-[1.9] text-green-dark sm:text-[1.35rem]"
        >
          {arabic}
        </p>
      ) : null}
      <blockquote
        className={cn(
          "font-serif text-[0.98rem] leading-[1.5] text-foreground italic sm:text-[1.02rem]",
          arabic ? "mt-1.5" : "mt-0"
        )}
      >
        &ldquo;{text}&rdquo;
      </blockquote>
      <p className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-sand">
        {reference}
      </p>
    </aside>
  );
}
