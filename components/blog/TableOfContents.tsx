"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function TableOfContents({
  items,
}: {
  items: { id: string; text: string; level: 2 | 3 }[];
}) {
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  const List = (
    <ol className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className={cn(item.level === 3 && "ml-3")}>
          <a
            href={`#${item.id}`}
            className="text-sm leading-snug text-muted transition-colors hover:text-green"
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <div className="mb-8 rounded-2xl border border-border bg-cream/70 p-4 lg:hidden">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-sm font-semibold text-foreground"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
        >
          Table of contents
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          />
        </button>
        {open ? <div className="mt-3 border-t border-border pt-3">{List}</div> : null}
      </div>

      <nav
        aria-label="Table of contents"
        className="sticky top-28 hidden rounded-2xl border border-border bg-card p-5 lg:block"
      >
        <p className="text-sm font-semibold text-foreground">On this page</p>
        <div className="mt-4">{List}</div>
      </nav>
    </>
  );
}
