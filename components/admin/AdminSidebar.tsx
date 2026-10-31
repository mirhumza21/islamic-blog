"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Users,
  Settings,
  Layers,
  ExternalLink,
  Sparkles,
  Globe,
  Mail,
  MessageSquare,
  X,
} from "lucide-react";
import { toRenderableImageSrc } from "@/lib/mediaUrl";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "All Articles", href: "/admin/articles", icon: FileText },
  { name: "Pages", href: "/admin/pages", icon: Layers },
  { name: "Global", href: "/admin/global", icon: Globe },
  { name: "Subscribers", href: "/admin/subscribers", icon: Mail },
  { name: "Contact Messages", href: "/admin/contact-messages", icon: MessageSquare },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Authors", href: "/admin/authors", icon: Users },
  { name: "Site & SEO Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [brand, setBrand] = useState<{ name?: string; logoUrl?: string }>({});

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings) {
          setBrand({
            name: data.settings.name,
            logoUrl: data.settings.headerLogoUrl || data.settings.logoUrl,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <aside
      className={`fixed md:sticky top-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 select-none shadow-sm h-screen overflow-y-auto transition-transform duration-200 ${
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {brand.logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={toRenderableImageSrc(brand.logoUrl)}
                alt={brand.name || "Logo"}
                className="w-10 h-10 object-contain rounded-xl bg-white border border-gray-100 p-1 shrink-0 shadow-xs"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="min-w-0">
              <span className="font-bold text-base text-gray-900 tracking-tight block leading-tight truncate">
                {brand.name || "UmrahZone"}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-emerald-600 font-semibold block">
                Admin Panel
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

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
                onClick={onClose}
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

      <div className="p-3 border-t border-gray-100">
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
      </div>
    </aside>
  );
}
