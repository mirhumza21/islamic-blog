"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Trash2,
  RefreshCw,
  Download,
  Users,
} from "lucide-react";
import { TableSkeleton } from "@/components/admin/AdminSkeletons";

type Subscriber = {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
};

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subscribers");
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.subscribers || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (sub: Subscriber) => {
    if (!confirm(`Remove subscriber "${sub.email}"?`)) return;
    setDeletingId(sub.id);
    try {
      const res = await fetch(`/api/admin/subscribers?id=${sub.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== sub.id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const exportCsv = () => {
    const rows = [
      ["email", "source", "subscribed_at"],
      ...subscribers.map((s) => [
        s.email,
        s.source || "newsletter",
        new Date(s.created_at).toISOString(),
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/global"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Global
          </Link>
          <h1 className="mt-2 text-2xl font-serif font-bold text-gray-900">
            Subscribers
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Emails collected from the site-wide subscribe form.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/global/subscribe"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
          >
            <Mail className="w-3.5 h-3.5" />
            Edit copy
          </Link>
          <button
            type="button"
            onClick={fetchSubscribers}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={subscribers.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-gray-900">
              All subscribers ({subscribers.length})
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-4">
            <TableSkeleton rows={6} />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Mail className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700">No subscribers yet</p>
            <p className="mt-1 text-xs text-gray-500">
              When someone subscribes on the site, their email will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Subscribed</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/80">
                    <td className="py-3.5 px-4 font-medium text-gray-900">
                      {sub.email}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {sub.source || "newsletter"}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                      {new Date(sub.created_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(sub)}
                        disabled={deletingId === sub.id}
                        className="inline-flex items-center gap-1 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
