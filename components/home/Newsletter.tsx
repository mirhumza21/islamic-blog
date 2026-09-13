"use client";

import { FormEvent, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

async function subscribe(email: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  if (!email.includes("@") || !email.includes(".")) {
    throw new Error("Please enter a valid email address.");
  }
}

export function Newsletter({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      await subscribe(email.trim());
      setStatus("success");
      setMessage("You’re subscribed. Welcome to the UmrahZone community.");
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
      className={cn(
        "relative overflow-hidden bg-green text-white pattern-subtle silhouette-mosque",
        className
      )}
    >
      <div className="container-editorial relative py-14 lg:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-sand">
            <Mail className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Join Our Growing Community
          </h2>
          <p className="mt-3 text-base text-white/80 sm:text-lg">
            Get the latest blogs, guides and inspiration delivered directly to
            your inbox.
          </p>

          <form
            onSubmit={onSubmit}
            className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
            noValidate
          >
            <Input
              type="email"
              name="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              aria-label="Email address"
              aria-invalid={status === "error"}
              className="h-12 border-white/20 bg-white/95 text-foreground placeholder:text-muted focus-visible:ring-sand focus-visible:ring-offset-green"
            />
            <Button
              type="submit"
              size="lg"
              variant="secondary"
              disabled={status === "loading"}
              className="h-12 min-w-[140px]"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Subscribing
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </form>

          {message ? (
            <p
              className={cn(
                "mt-4 text-sm",
                status === "success" ? "text-sand-soft" : "text-red-200"
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
