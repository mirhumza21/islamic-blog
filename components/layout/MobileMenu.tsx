"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function MobileMenu({
  onClose,
  subscribeLabel = "Subscribe",
}: {
  onClose: () => void;
  subscribeLabel?: string;
}) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <motion.div
      className="fixed inset-0 z-50 lg:hidden"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-green-dark/40 backdrop-blur-sm"
        aria-label="Close menu"
        onClick={onClose}
      />
      <motion.aside
        className="absolute inset-y-0 right-0 flex w-[min(100%,360px)] flex-col bg-ivory shadow-2xl"
        initial={reduceMotion ? false : { x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Logo showTagline={false} />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
          <ul className="space-y-1">
            {mainNav.map((item) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;
              const itemKey = item.href + item.label;
              const expanded = openKey === itemKey;
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={itemKey}>
                  {hasChildren ? (
                    <div>
                      <div className="flex items-center gap-1">
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "flex min-h-12 flex-1 items-center rounded-xl px-4 text-base font-medium transition-colors",
                            active ? "bg-cream text-green" : "text-foreground hover:bg-cream"
                          )}
                        >
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          aria-expanded={expanded}
                          aria-label={`${expanded ? "Collapse" : "Expand"} ${item.label} menu`}
                          onClick={() => setOpenKey(expanded ? null : itemKey)}
                          className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-foreground/60 transition-colors hover:bg-cream hover:text-green"
                        >
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform duration-200",
                              expanded && "rotate-180"
                            )}
                          />
                        </button>
                      </div>
                      {expanded ? (
                        <ul className="mb-1 ml-3 space-y-1 border-l border-border pl-3">
                          {item.children!.map((child) => {
                            const childActive =
                              pathname === child.href ||
                              pathname.startsWith(`${child.href}/`);
                            return (
                              <li key={`${child.href}-${child.label}`}>
                                <Link
                                  href={child.href}
                                  onClick={onClose}
                                  className={cn(
                                    "flex min-h-11 flex-col justify-center rounded-xl px-3 py-2 text-sm transition-colors",
                                    childActive
                                      ? "bg-cream text-green"
                                      : "text-foreground/80 hover:bg-cream"
                                  )}
                                >
                                  <span className="font-semibold">{child.label}</span>
                                  {child.description ? (
                                    <span className="text-[11px] text-muted">
                                      {child.description}
                                    </span>
                                  ) : null}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex min-h-12 items-center rounded-xl px-4 text-base font-medium transition-colors",
                        active ? "bg-cream text-green" : "text-foreground hover:bg-cream"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-5">
          <Button asChild className="w-full" size="lg">
            <Link href="/#newsletter" onClick={onClose}>
              {subscribeLabel}
            </Link>
          </Button>
        </div>
      </motion.aside>
    </motion.div>
  );
}
