"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const subjects = [
  "General inquiry",
  "Content correction",
  "Collaboration",
  "Feedback",
] as const;

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<string>(subjects[0]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject,
          message: message.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setStatus("success");
      setFeedback(data.message || "Message received. We’ll get back to you soon.");
      setName("");
      setEmail("");
      setSubject(subjects[0]);
      setMessage("");
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error ? error.message : "Failed to send message."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Name
          </label>
          <Input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-11 rounded-full border-[#e6dfd3] bg-white"
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Email
          </label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 rounded-full border-[#e6dfd3] bg-white"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Subject
        </label>
        <select
          id="contact-subject"
          name="subject"
          required
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className={cn(
            "flex h-11 w-full rounded-full border border-[#e6dfd3] bg-white px-4 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#063b2f] focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          )}
        >
          {subjects.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          placeholder="How can we help you?"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={cn(
            "flex w-full resize-y rounded-2xl border border-[#e6dfd3] bg-white px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#063b2f] focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          )}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={status === "loading"}
        className="h-12 w-full rounded-full bg-[#063b2f] px-7 hover:bg-[#042d24] disabled:opacity-50 sm:w-auto"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send message
          </>
        )}
      </Button>

      {feedback ? (
        <p
          className={cn(
            "text-sm",
            status === "success" ? "text-green" : "text-red-600"
          )}
          role="status"
          aria-live="polite"
        >
          {feedback}
        </p>
      ) : (
        <p className="text-xs leading-relaxed text-muted">
          We typically respond within 2–3 business days.
        </p>
      )}
    </form>
  );
}
