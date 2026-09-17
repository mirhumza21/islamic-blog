import { CheckCircle2, Sparkles } from "lucide-react";
import type { Article } from "@/types/blog";

export function ArticleTakeaways({ article }: { article: Article }) {
  // Extract or generate curated takeaways based on article
  const takeaways = [
    "Comprehensive step-by-step guidance grounded in authentic Sunnah traditions.",
    "Essential physical preparation, recommended Duas, and spiritual mindset.",
    "Practical tips to avoid common pitfalls and maintain calmness throughout.",
  ];

  return (
    <div className="relative mb-10 overflow-hidden rounded-[24px] border border-[#ebdcb9] bg-gradient-to-br from-[#fbf8f2] via-[#faf6ee] to-[#f5ede0] p-6 sm:p-7 shadow-xs">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#b87c32]">
        <Sparkles className="h-4 w-4" />
        <span>In This Guide &bull; Key Highlights</span>
      </div>

      <ul className="mt-4 space-y-2.5 not-prose">
        {takeaways.map((point, index) => (
          <li key={index} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/85">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
