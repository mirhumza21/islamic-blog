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
          "sticky top-0 z-40 h-20 w-full border-b bg-ivory transition-colors duration-200",
          scrolled
            ? "border-border/70 bg-ivory/95 backdrop-blur-md"
            : "border-border/50"
        )}
      >
        <div className="container-editorial flex h-full items-center justify-between gap-3">
          <Logo />

          <nav
            className="hidden items-center gap-0.5 lg:flex"
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
                    "rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors xl:px-3 xl:text-sm",
                    active
                      ? "text-green"
                      : "text-foreground/75 hover:text-green"
                  )}
                >
                  <span className="relative inline-block pb-0.5">
                    {item.label}
                    <span
                      className={cn(
                        "absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-green transition-transform duration-200",
                        active ? "scale-x-100" : "scale-x-0"
                      )}
                    />
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-cream hover:text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/#newsletter"
              className="hidden h-11 items-center gap-2 rounded-full bg-green px-4 text-sm font-medium text-white transition-colors hover:bg-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:inline-flex xl:px-5"
            >
              <Mail className="h-4 w-4" />
              Subscribe
            </Link>

            <Button
              type="button"
              size="icon"
              variant="outline"
              className="rounded-full lg:hidden"
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
