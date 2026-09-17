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

  return (
    <aside
      className={cn(
        "w-full max-w-[280px] rounded-2xl border border-border bg-card p-5 shadow-[0_8px_32px_-12px_rgba(23,32,30,0.18)] sm:max-w-[300px] sm:p-6",
        className
      )}
      aria-label="Quranic verse"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sand">
        Qur&apos;an
      </p>
      <blockquote className="mt-3 font-serif text-[1.05rem] leading-[1.45] text-foreground sm:text-[1.1rem]">
        &ldquo;{data.quote?.text || heroContent.quote.text}&rdquo;
      </blockquote>
      <p className="mt-3 text-[12px] font-medium text-muted">
        {data.quote?.reference || heroContent.quote.reference}
      </p>
    </aside>
  );
}
