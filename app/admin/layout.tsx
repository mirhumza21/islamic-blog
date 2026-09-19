"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopNav } from "@/components/admin/AdminTopNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {children}
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex font-sans overflow-hidden">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <AdminTopNav onMenu={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-gray-50 min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
