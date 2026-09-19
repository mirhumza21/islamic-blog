"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Menu, Search } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { NavItem } from "@/components/layout/NavItem";
import { SearchDialog } from "@/components/search/SearchDialog";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function Header({ subscribeLabel = "Subscribe" }: { subscribeLabel?: string }) {
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
          "sticky top-0 z-50 w-full border-b bg-ivory transition-[height,background-color,backdrop-filter] duration-200",
          scrolled
            ? "h-[72px] border-border/70 bg-ivory/92 backdrop-blur-md"
            : "h-20 border-border/55"
        )}
      >
        <div className="container-editorial flex h-full items-center gap-3 lg:gap-4 xl:gap-8">
          <div className="min-w-0 shrink-0">
            <Logo />
          </div>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center lg:flex"
            aria-label="Primary"
          >
            <div className="flex items-center">
              {mainNav.map((item) => (
                <NavItem key={item.href + item.label} item={item} pathname={pathname} />
              ))}
            </div>
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
              className="hidden h-11 items-center gap-2 rounded-full bg-green px-4 text-sm font-medium text-white shadow-[0_1px_0_rgba(255,255,255,0.12)_inset] transition-colors duration-200 hover:bg-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:inline-flex xl:px-5"
            >
              <Mail className="h-4 w-4" />
              {subscribeLabel}
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
          <MobileMenu onClose={() => setMobileOpen(false)} subscribeLabel={subscribeLabel} />
        ) : null}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
