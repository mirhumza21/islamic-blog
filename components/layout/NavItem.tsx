"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { NavItem as NavItemType } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function NavItem({
  item,
  pathname,
}: {
  item: NavItemType;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  const active =
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const childActive = hasChildren
    ? item.children!.some(
        (child) => pathname === child.href || pathname.startsWith(`${child.href}/`)
      )
    : false;

  const isActive = active || childActive;

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = () => {
    if (!hasChildren) return;
    clearCloseTimer();
    setOpen(true);
  };

  const closeMenu = (delay = 120) => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), delay);
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  const linkClass = cn(
    "inline-flex items-center whitespace-nowrap rounded-md py-2 text-[13px] font-medium transition-colors xl:text-[13.5px]",
    isActive ? "text-green" : "text-foreground/75 hover:text-green"
  );

  const underline = (
    <span className="relative inline-block pb-1">
      {item.label}
      <span
        className={cn(
          "absolute inset-x-0 bottom-0 h-0.5 origin-left rounded-full bg-green transition-transform duration-200",
          isActive ? "scale-x-100" : "scale-x-0"
        )}
        aria-hidden
      />
    </span>
  );

  if (!hasChildren) {
    return (
      <Link href={item.href} className={cn(linkClass, "px-1.5 xl:px-2")}>
        {underline}
      </Link>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={() => closeMenu()}
    >
      <div className={cn("inline-flex items-center rounded-md px-1.5 xl:px-2", isActive ? "text-green" : "text-foreground/75")}>
        <Link
          href={item.href}
          className={linkClass}
          onFocus={openMenu}
        >
          {underline}
        </Link>
        <button
          type="button"
          className="ml-0.5 inline-flex h-7 w-6 items-center justify-center rounded-md text-current/50 transition-colors hover:text-green"
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls={menuId}
          aria-label={`${open ? "Close" : "Open"} ${item.label} menu`}
          onClick={() => (open ? setOpen(false) : openMenu())}
        >
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
              open && "rotate-180 text-green"
            )}
            aria-hidden
          />
        </button>
      </div>

      <div
        id={menuId}
        role="menu"
        className={cn(
          "absolute left-1/2 top-full z-50 mt-1 w-[240px] -translate-x-1/2 origin-top rounded-2xl border border-border bg-ivory/98 p-1.5 shadow-[0_16px_40px_-18px_rgba(23,32,30,0.28)] backdrop-blur-md transition-all duration-150",
          open
            ? "pointer-events-auto visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-1 opacity-0"
        )}
        onMouseEnter={openMenu}
        onMouseLeave={() => closeMenu()}
      >
        {item.children!.map((child) => {
          const childIsActive =
            pathname === child.href || pathname.startsWith(`${child.href}/`);
          return (
            <Link
              key={`${child.href}-${child.label}`}
              href={child.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-xl px-3 py-2.5 transition-colors",
                childIsActive ? "bg-cream text-green" : "hover:bg-cream"
              )}
            >
              <span className="block text-[13px] font-semibold text-foreground">
                {child.label}
              </span>
              {child.description ? (
                <span className="mt-0.5 block text-[11px] leading-snug text-muted">
                  {child.description}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
