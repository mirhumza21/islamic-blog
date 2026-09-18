"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Users,
  Settings,
  Layers,
  ExternalLink,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "All Articles", href: "/admin/articles", icon: FileText },
  { name: "Pages", href: "/admin/pages", icon: Layers },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Authors", href: "/admin/authors", icon: Users },
  { name: "Site & SEO Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

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
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 select-none shadow-sm sticky top-0 h-screen overflow-y-auto">
      <div>
        {/* Logo / Brand */}
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base text-gray-900 tracking-tight block leading-tight">
              UmrahZone
            </span>
            <span className="text-[11px] uppercase tracking-wider text-emerald-600 font-semibold block">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Navigation items - rock solid stable without layout shifts */}
        <nav className="p-3 space-y-1">
          {navigation.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium border transition-colors duration-150 ${
                  isActive
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 border-transparent"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-emerald-700" : "text-gray-400"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            View Live Site
          </span>
          <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
            ↗ Open
          </span>
        </a>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-50"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
        </button>
      </div>
    </aside>
  );
}
