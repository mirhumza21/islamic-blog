"use client";

import { useState } from "react";
import { Check, Heart, ThumbsUp } from "lucide-react";

export function ArticleFeedback() {
  const [voted, setVoted] = useState<"helpful" | "loved" | null>(null);

  return (
    <div className="my-8 flex flex-col items-center justify-between gap-4 rounded-[22px] border border-border/80 bg-card p-5 shadow-xs sm:flex-row sm:px-6">
      <div>
        <p className="font-serif text-base font-bold text-foreground">
          Was this guide beneficial for your journey?
        </p>
        <p className="mt-0.5 text-xs text-muted">
          Your feedback helps us continuously refine and improve our Islamic publications.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => setVoted("helpful")}
          disabled={voted !== null}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold shadow-xs transition-colors ${
            voted === "helpful"
              ? "bg-green text-white"
              : "border border-border/80 bg-ivory text-foreground/80 hover:border-green hover:bg-cream hover:text-green"
          }`}
        >
          {voted === "helpful" ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <ThumbsUp className="h-3.5 w-3.5 text-sand" />
          )}
          <span>{voted === "helpful" ? "Thank You!" : "Helpful"}</span>
        </button>

        <button
          type="button"
          onClick={() => setVoted("loved")}
          disabled={voted !== null}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold shadow-xs transition-colors ${
            voted === "loved"
              ? "bg-sand text-white"
              : "border border-border/80 bg-ivory text-foreground/80 hover:border-sand hover:bg-cream hover:text-sand"
          }`}
        >
          {voted === "loved" ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Heart className="h-3.5 w-3.5 text-red-500" fill="none" />
          )}
          <span>{voted === "loved" ? "Alhamdulillah!" : "Inspiring"}</span>
        </button>
      </div>
    </div>
  );
}
