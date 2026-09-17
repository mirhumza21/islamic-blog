"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopNav } from "@/components/admin/AdminTopNav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AdminTopNav />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
