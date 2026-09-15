"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Menu, Search } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchDialog } from "@/components/search/SearchDialog";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b bg-ivory transition-[height,background-color,backdrop-filter] duration-200",
          scrolled
            ? "h-[72px] border-border/70 bg-ivory/92 backdrop-blur-md"
            : "h-20 border-border/55"
        )}
      >
        <div className="container-editorial flex h-full items-center gap-4 lg:gap-6 xl:gap-10">
          <div className="min-w-0 shrink-0">
            <Logo />
          </div>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1"
            aria-label="Primary"
          >
            {mainNav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "whitespace-nowrap rounded-md px-2 py-2 text-[13px] font-medium transition-colors xl:px-2.5 xl:text-[13.5px]",
                    active
                      ? "text-green"
                      : "text-foreground/70 hover:text-green"
                  )}
                >
                  <span className="relative inline-block pb-1">
                    {item.label}
                    <span
                      className={cn(
                        "absolute inset-x-0 bottom-0 h-0.5 origin-left rounded-full bg-green transition-transform duration-200",
                        active ? "scale-x-100" : "scale-x-0"
                      )}
                      aria-hidden
                    />
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground/75 transition-colors hover:bg-cream hover:text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/#newsletter"
              className="hidden h-11 items-center gap-2 rounded-full bg-green px-4 text-sm font-medium text-white shadow-[0_1px_0_rgba(255,255,255,0.12)_inset] transition-all duration-200 hover:-translate-y-px hover:bg-green-dark hover:shadow-[0_8px_20px_-12px_rgba(7,88,70,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:inline-flex xl:px-5"
            >
              <Mail className="h-4 w-4" />
              Subscribe
            </Link>

            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-11 w-11 rounded-full lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <MobileMenu onClose={() => setMobileOpen(false)} />
        ) : null}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
