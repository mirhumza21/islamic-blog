"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function MobileMenu({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

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
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex min-h-12 items-center rounded-xl px-4 text-base font-medium transition-colors",
                      active
                        ? "bg-cream text-green"
                        : "text-foreground hover:bg-cream"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-5">
          <Button asChild className="w-full" size="lg">
            <Link href="/#newsletter" onClick={onClose}>
              Subscribe
            </Link>
          </Button>
        </div>
      </motion.aside>
    </motion.div>
  );
}
