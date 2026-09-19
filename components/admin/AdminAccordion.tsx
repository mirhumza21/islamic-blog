"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function AdminAccordion({
  title,
  description,
  icon,
  open,
  onToggle,
  children,
}: {
  title: string;
  description?: string;
  icon: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50/80 sm:px-6"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            {icon}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-gray-900">{title}</span>
            {description ? (
              <span className="mt-0.5 block text-xs text-gray-500">{description}</span>
            ) : null}
          </span>
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open ? (
        <div className="space-y-6 border-t border-gray-100 px-5 py-5 sm:px-6 sm:py-6">
          {children}
        </div>
      ) : null}
    </section>
  );
}
