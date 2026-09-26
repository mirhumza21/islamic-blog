"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MessageSquare,
  Trash2,
  RefreshCw,
  Mail,
  Check,
  Archive,
} from "lucide-react";
import { TableSkeleton } from "@/components/admin/AdminSkeletons";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "archived";
  created_at: string;
};

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contact-messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateStatus = async (
    id: string,
    status: ContactMessage["status"]
  ) => {
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/contact-messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status } : m))
        );
        setSelected((prev) =>
          prev && prev.id === id ? { ...prev, status } : prev
        );
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update");
      }
    } catch (err: any) {
      alert(err.message || "Failed to update");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (msg: ContactMessage) => {
    if (!confirm(`Delete message from "${msg.name}"?`)) return;
    setBusyId(msg.id);
    try {
      const res = await fetch(`/api/admin/contact-messages?id=${msg.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== msg.id));
        if (selected?.id === msg.id) setSelected(null);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    } finally {
      setBusyId(null);
    }
  };

  const openMessage = (msg: ContactMessage) => {
    setSelected(msg);
    if (msg.status === "new") {
      updateStatus(msg.id, "read");
    }
  };

  const statusBadge = (status: ContactMessage["status"]) => {
    if (status === "new") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (status === "archived") {
      return "bg-gray-100 text-gray-600 border-gray-200";
    }
    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/pages/contact"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Contact page
          </Link>
          <h1 className="mt-2 text-2xl font-serif font-bold text-gray-900">
            Contact Messages
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Inquiries submitted through the public contact form.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/pages/contact"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
          >
            Edit contact copy
          </Link>
          <button
            type="button"
            onClick={fetchMessages}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-gray-900">
              Inbox ({messages.length})
            </span>
          </div>

          {loading ? (
            <div className="p-4">
              <TableSkeleton rows={6} />
            </div>
          ) : messages.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Mail className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700">No messages yet</p>
              <p className="mt-1 text-xs text-gray-500">
                Contact form submissions will show up here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
              {messages.map((msg) => (
                <li key={msg.id}>
                  <button
                    type="button"
                    onClick={() => openMessage(msg)}
                    className={`w-full text-left px-4 py-3.5 hover:bg-gray-50 transition-colors ${
                      selected?.id === msg.id ? "bg-emerald-50/60" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {msg.name}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">
                          {msg.email} · {msg.subject}
                        </p>
                        <p className="mt-1 text-xs text-gray-600 line-clamp-1">
                          {msg.message}
                        </p>
                      </div>
                      <div className="shrink-0 text-right space-y-1">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBadge(
                            msg.status
                          )}`}
                        >
                          {msg.status}
                        </span>
                        <p className="text-[10px] text-gray-400 whitespace-nowrap">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm min-h-[320px]">
          {!selected ? (
            <div className="h-full flex items-center justify-center text-center px-4 py-12">
              <div>
                <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  Select a message to read it.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  From
                </p>
                <p className="mt-1 text-sm font-bold text-gray-900">
                  {selected.name}
                </p>
                <a
                  href={`mailto:${selected.email}`}
                  className="text-xs text-emerald-700 hover:underline"
                >
                  {selected.email}
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Subject
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {selected.subject}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Message
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>
              <p className="text-[11px] text-gray-400">
                Received {new Date(selected.created_at).toLocaleString()}
              </p>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                {selected.status !== "read" ? (
                  <button
                    type="button"
                    disabled={busyId === selected.id}
                    onClick={() => updateStatus(selected.id, "read")}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark read
                  </button>
                ) : null}
                {selected.status !== "archived" ? (
                  <button
                    type="button"
                    disabled={busyId === selected.id}
                    onClick={() => updateStatus(selected.id, "archived")}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    Archive
                  </button>
                ) : null}
                <button
                  type="button"
                  disabled={busyId === selected.id}
                  onClick={() => handleDelete(selected)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
