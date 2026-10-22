"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Heart, Luggage, PenTool, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { heroContent } from "@/data/navigation";

const dockIcons: Record<string, ReactNode> = {
  compass: <Compass className="h-5 w-5 text-[#b8894a]" strokeWidth={1.6} />,
  book: <BookOpen className="h-5 w-5 text-[#b8894a]" strokeWidth={1.6} />,
  heart: <Heart className="h-5 w-5 text-[#b8894a]" strokeWidth={1.6} />,
  luggage: <Luggage className="h-5 w-5 text-[#b8894a]" strokeWidth={1.6} />,
  pen: <PenTool className="h-5 w-5 text-[#b8894a]" strokeWidth={1.6} />,
  sparkles: <Sparkles className="h-5 w-5 text-[#b8894a]" strokeWidth={1.6} />,
};

export function HeroFloatingDock({ content }: { content?: typeof heroContent }) {
  const items =
    Array.isArray(content?.dockItems) && content.dockItems.length > 0
      ? content.dockItems
      : heroContent.dockItems;

  return (
    <div className="relative flex w-full items-center">
      <div className="min-w-0 flex-1 overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200/85 bg-white/95 p-1.5 sm:p-2 lg:p-1.5 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)] backdrop-blur-md">
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:flex lg:flex-nowrap lg:items-center lg:gap-0 lg:divide-x lg:divide-stone-200/60">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href || "/blog"}
              className="group flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2.5 py-1.5 transition-colors duration-200 hover:bg-[#f7f4ed] lg:px-3"
            >
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center text-[#b8894a]">
                {dockIcons[item.icon] || dockIcons.sparkles}
              </span>
              <span className="min-w-0 text-left">
                <span className="block truncate text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-foreground transition-colors duration-200 group-hover:text-[#064234]">
                  {item.title}
                </span>
                <span className="block truncate text-[10px] text-muted">
                  {item.subtitle}
                </span>
              </span>
            </Link>
          ))}

          <div className="hidden pl-2 pr-1 lg:block">
            <a
              href="#daily-spiritual-hub"
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById("daily-spiritual-hub");
                if (!target) return;
                const header = document.querySelector("header");
                const offset = header instanceof HTMLElement ? header.offsetHeight : 72;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: "smooth" });
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#064234] text-white shadow-xs transition-colors duration-200 hover:bg-[#043328]"
              aria-label="Scroll to explore more"
            >
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
