"use client";

import { usePathname, useRouter } from "next/navigation";
import { ExternalLink, LogOut, Menu } from "lucide-react";
import { useEffect, useState } from "react";

function getSectionLabel(pathname: string) {
  if (pathname === "/admin") return "Dashboard";
  if (pathname.startsWith("/admin/articles/new")) return "New Article";
  if (pathname.includes("/admin/articles/") && pathname.includes("/edit")) {
    return "Edit Article";
  }
  if (pathname.startsWith("/admin/articles")) return "Articles";
  if (pathname.startsWith("/admin/pages")) return "Pages";
  if (pathname.startsWith("/admin/global")) return "Global";
  if (pathname.startsWith("/admin/categories")) return "Categories";
  if (pathname.startsWith("/admin/authors")) return "Authors";
  if (pathname.startsWith("/admin/settings")) return "Settings";
  return "Admin";
}

export function AdminTopNav({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [routeBusy, setRouteBusy] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    setRouteBusy(true);
    const timer = window.setTimeout(() => setRouteBusy(false), 450);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.email) setAdminEmail(data.user.email);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <header className="relative h-14 border-b border-gray-200 bg-white px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-sm sticky top-0 z-40">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 overflow-hidden ${
          routeBusy ? "opacity-100" : "opacity-0"
        } transition-opacity`}
      >
        <div className="h-full w-1/3 bg-emerald-600 animate-[admin-progress_0.45s_ease-out]" />
      </div>

      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenu}
          className="md:hidden p-2 -ml-1 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 leading-none">
            Content Management
          </p>
          <p className="text-sm font-semibold text-gray-800 truncate">
            {getSectionLabel(pathname)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {adminEmail && (
          <span className="hidden md:inline text-xs text-gray-500 max-w-[180px] truncate">
            {adminEmail}
          </span>
        )}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Site</span>
        </a>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{loggingOut ? "Signing out..." : "Logout"}</span>
        </button>
      </div>
    </header>
  );
}
