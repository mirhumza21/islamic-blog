"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v8h4v-8h3.1l.9-4H13V9c0-.6.4-1 1-1z" />
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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.55.12.17 1.74 2.65 4.21 3.72.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z" />
    </svg>
  );
}

export function ShareArticle({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green">
        <Share2 className="h-4 w-4" />
        <span>Share This Guide</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-ivory px-3.5 py-2 text-xs font-semibold text-foreground/80 shadow-xs transition-colors hover:border-green hover:bg-cream hover:text-green"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green" />
              <span className="text-green font-bold">Link Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="h-3.5 w-3.5 text-sand" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        <a
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-ivory px-3.5 py-2 text-xs font-semibold text-foreground/80 shadow-xs transition-colors hover:border-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366]"
        >
          <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
          <span>WhatsApp</span>
        </a>

        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-ivory px-3.5 py-2 text-xs font-semibold text-foreground/80 shadow-xs transition-colors hover:border-foreground hover:bg-black/5 hover:text-foreground"
        >
          <XIcon className="h-3.5 w-3.5 text-foreground/80" />
          <span>X / Twitter</span>
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-ivory px-3.5 py-2 text-xs font-semibold text-foreground/80 shadow-xs transition-colors hover:border-[#1877F2] hover:bg-[#1877F2]/10 hover:text-[#1877F2]"
        >
          <FacebookIcon className="h-3.5 w-3.5 text-[#1877F2]" />
          <span>Facebook</span>
        </a>
      </div>
    </div>
  );
}
