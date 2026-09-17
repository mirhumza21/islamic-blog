"use client";

import { useEffect, useState } from "react";
import { BookOpen, ChevronDown, ListFilter, Share2, Check, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.55.12.17 1.74 2.65 4.21 3.72.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.922L1.942 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function TableOfContents({
  items,
  articleTitle,
  shareUrl,
}: {
  items: { id: string; text: string; level: 2 | 3 }[];
  articleTitle?: string;
  shareUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(shareUrl ?? "");

  useEffect(() => {
    if (!shareUrl && typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, [shareUrl]);

  const finalUrl = shareUrl || currentUrl;

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

  const handleCopy = async () => {
    try {
      const target = finalUrl || (typeof window !== "undefined" ? window.location.href : "");
      if (target) {
        await navigator.clipboard.writeText(target);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

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
      <div className="mb-8 rounded-2xl border border-border/80 bg-card p-4 shadow-xs lg:hidden">
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
        <div className="rounded-[24px] border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-border/60 pb-3 text-xs font-bold uppercase tracking-wider text-green">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Table of Contents</span>
            </span>
            <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-bold text-sand">
              {items.length} sections
            </span>
          </div>

          <div className="mt-3.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {renderItems()}
          </div>
        </div>

        {/* Quick Social Share Pill Rail */}
        <div className="rounded-[20px] border border-border/70 bg-card/80 p-4 shadow-xs backdrop-blur-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
              Share Guide
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopy}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-ivory text-foreground/80 transition-colors hover:border-green hover:bg-cream hover:text-green"
                title="Copy link"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green" />
                ) : (
                  <Link2 className="h-3.5 w-3.5 text-sand" />
                )}
              </button>

              <a
                href={
                  finalUrl
                    ? `https://wa.me/?text=${encodeURIComponent(
                        (articleTitle ?? "Umrah Guide") + " " + finalUrl
                      )}`
                    : "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-ivory text-foreground/80 transition-colors hover:border-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366]"
                title="Share on WhatsApp"
              >
                <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
              </a>

              <a
                href={
                  finalUrl
                    ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        finalUrl
                      )}&text=${encodeURIComponent(articleTitle ?? "Umrah Guide")}`
                    : "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-ivory text-foreground/80 transition-colors hover:border-foreground hover:bg-black/5 hover:text-foreground"
                title="Share on X"
              >
                <XIcon className="h-3.5 w-3.5 text-foreground/80" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
