import Image from "next/image";
import Link from "next/link";
import { Sparkles, UserCheck } from "lucide-react";
import type { Author } from "@/types/blog";

export function AuthorBioCard({ author }: { author: Author }) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-border/80 bg-gradient-to-br from-card via-card to-cream/40 p-6 sm:p-7 shadow-xs">
      <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 -translate-y-6 translate-x-6 rounded-full bg-sand/10 blur-xl" />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          <Image
            src={author.avatar}
            alt={author.name}
            width={72}
            height={72}
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover ring-4 ring-sand/20"
          />
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green text-[10px] font-bold text-white shadow-xs">
            ✓
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-sand flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              About the Author
            </span>
            <span className="rounded-md bg-cream px-2 py-0.5 text-[11px] font-semibold text-green">
              {author.role}
            </span>
          </div>

          <h3 className="mt-1.5 font-serif text-xl font-bold text-foreground sm:text-2xl">
            {author.name}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-muted">
            {author.bio}
          </p>
        </div>
      </div>
    </div>
  );
}
