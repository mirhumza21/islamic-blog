"use client";

import { FormEvent, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { defaultNewsletterSection } from "@/data/home-sections";
import { GoldUnderline, underlineLastWord } from "@/components/home/GoldUnderline";

type Status = "idle" | "loading" | "success" | "error";

export function Newsletter({
  className,
  content,
}: {
  className?: string;
  content?: Partial<typeof defaultNewsletterSection>;
}) {
  const copy = { ...defaultNewsletterSection, ...content };
  const { lead, last } = underlineLastWord(copy.title);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: "newsletter",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      setStatus("success");
      setMessage(data.message || copy.successMessage);
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  };

  return (
    <section
      id="newsletter"
      className={cn("relative overflow-hidden bg-cream/80", className)}
    >
      <div
        className="pointer-events-none absolute inset-0 pattern-geometric-cream opacity-50"
        aria-hidden
      />
      <div className="container-editorial relative py-16 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sand/15 px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-sand">
            <Mail className="h-3 w-3" />
            Stay Connected
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-[#141d1a] sm:text-4xl lg:text-[2.65rem]">
            {lead ? `${lead} ` : null}
            <span className="relative inline-block text-[#063b2f]">
              {last}
              <GoldUnderline />
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            {copy.description}
          </p>

          <form
            onSubmit={onSubmit}
            className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-center"
            noValidate
          >
            <Input
              type="email"
              name="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={copy.placeholder}
              aria-label="Email address"
              aria-invalid={status === "error"}
              className="h-12 rounded-full border-[#e6dfd3] bg-white px-5 text-foreground shadow-2xs placeholder:text-muted focus-visible:ring-[#063b2f]"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex h-12 min-w-[150px] items-center justify-center gap-2 rounded-full bg-[#063b2f] px-7 text-[14px] font-semibold text-white shadow-[0_2px_12px_rgba(6,59,47,0.25)] transition-[background-color,box-shadow] duration-200 hover:bg-[#042d24] disabled:opacity-50"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {copy.loadingLabel}
                </>
              ) : (
                copy.buttonLabel
              )}
            </button>
          </form>

          {message ? (
            <p
              className={cn(
                "mt-4 text-sm",
                status === "success" ? "text-green" : "text-red-600"
              )}
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
