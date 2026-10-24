"use client";

import { useEffect, useState } from "react";
import { BookOpen, ChevronDown, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";

export function TableOfContents({
  items,
}: {
  items: { id: string; text: string; level: 2 | 3 }[];
}) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0% 0% -65% 0%",
        threshold: 0.1,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const renderItems = () => (
    <nav aria-label="Table of contents navigation">
      <ul className="space-y-1.5 text-xs">
        {items.map((item, index) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={cn(
                "relative transition-all",
                item.level === 3 && "ml-3.5"
              )}
            >
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className={cn(
                  "group flex items-center gap-2 rounded-xl px-3 py-2 text-[12.5px] leading-snug transition-all duration-200",
                  isActive
                    ? "bg-green text-white font-semibold shadow-xs"
                    : "text-foreground/75 hover:bg-cream hover:text-green"
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-border/60 text-muted group-hover:bg-green/15 group-hover:text-green"
                  )}
                >
                  {index + 1}
                </span>
                <span className="line-clamp-2">{item.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Mobile Drawer Accordion */}
      <div className="mb-8 rounded-[26px] border border-[#e6dfd3] bg-white/80 p-4 shadow-[0_8px_28px_-16px_rgba(6,59,47,0.14)] lg:hidden">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-foreground"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
        >
          <span className="inline-flex items-center gap-2">
            <ListFilter className="h-4 w-4 text-green" />
            <span>Table of Contents ({items.length})</span>
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted transition-transform duration-200",
              open && "rotate-180 text-green"
            )}
          />
        </button>
        {open ? (
          <div className="mt-3.5 border-t border-border/60 pt-3.5">
            {renderItems()}
          </div>
        ) : null}
      </div>

      {/* Desktop Sticky Rail */}
      <div className="sticky top-24 hidden space-y-5 lg:block">
        {/* Table of Contents Card */}
        <div className="rounded-[26px] border border-[#e6dfd3] bg-white/80 p-5 shadow-[0_8px_28px_-16px_rgba(6,59,47,0.14)]">
          <div className="flex items-center justify-between border-b border-border/60 pb-3 text-xs font-bold uppercase tracking-wider text-green">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Table of Contents</span>
            </span>
            <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-bold text-sand">
              {items.length} sections
            </span>
          </div>

          <div className="mt-3.5 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
            {renderItems()}
          </div>
        </div>
      </div>
    </>
  );
}
