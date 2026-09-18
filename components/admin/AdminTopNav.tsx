"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Database, CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function AdminTopNav() {
  const pathname = usePathname();
  const [routeBusy, setRouteBusy] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    setRouteBusy(true);
    const timer = window.setTimeout(() => setRouteBusy(false), 450);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const handleSyncDatabase = async () => {
    if (
      !confirm(
        "Do you want to sync/seed existing articles, authors, and categories to your Supabase database?"
      )
    ) {
      return;
    }

    setSeeding(true);
    setSeedStatus({ type: null, message: "" });

    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setSeedStatus({
          type: "success",
          message: data.message || "Database seeded successfully!",
        });
        setTimeout(() => setSeedStatus({ type: null, message: "" }), 6000);
      } else {
        setSeedStatus({
          type: "error",
          message: data.error || "Failed to seed database.",
        });
      }
    } catch (err: any) {
      setSeedStatus({
        type: "error",
        message: err.message || "Network error while seeding.",
      });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header className="relative h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between shrink-0 shadow-sm sticky top-0 z-40">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 overflow-hidden ${
          routeBusy ? "opacity-100" : "opacity-0"
        } transition-opacity`}
      >
        <div className="h-full w-1/3 bg-emerald-600 animate-[admin-progress_0.45s_ease-out]" />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-700">
          Content Management
        </span>
        {seedStatus.type && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              seedStatus.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            {seedStatus.type === "success" ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            <span>{seedStatus.message}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleSyncDatabase}
          disabled={seeding}
          title="Seed and sync default static data into Supabase"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition-colors disabled:opacity-50"
        >
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>{seeding ? "Syncing..." : "Sync DB / Seed"}</span>
        </button>

        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>
    </header>
  );
}
