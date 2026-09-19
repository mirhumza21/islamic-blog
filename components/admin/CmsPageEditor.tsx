"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, RotateCcw, Save } from "lucide-react";
import { FormPageSkeleton } from "@/components/admin/AdminSkeletons";

type Field =
  | { key: string; label: string; type: "text" | "textarea"; rows?: number }
  | { key: string; label: string; type: "html"; rows?: number };

export function CmsPageEditor({
  pageKey,
  title,
  viewUrl,
  defaults,
  fields,
  backHref = "/admin/pages",
  backLabel = "Pages",
  description,
}: {
  pageKey: string;
  title: string;
  viewUrl: string;
  defaults: Record<string, any>;
  fields: Field[];
  backHref?: string;
  backLabel?: string;
  description?: string;
}) {
  const [content, setContent] = useState<Record<string, any>>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/cms/${pageKey}`);
        if (res.ok) {
          const data = await res.json();
          if (data.content) setContent({ ...defaults, ...data.content });
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [pageKey]);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/cms/${pageKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || "Could not save page");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <FormPageSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {backLabel}
          </Link>
          <h1 className="mt-2 text-2xl font-serif font-bold text-gray-900">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View
          </a>
          <button
            type="button"
            onClick={() => setContent(defaults)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving..." : saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
        {fields.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">{field.label}</label>
            {field.type === "text" ? (
              <input
                type="text"
                value={content[field.key] || ""}
                onChange={(e) =>
                  setContent({ ...content, [field.key]: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            ) : (
              <textarea
                rows={field.rows || 5}
                value={content[field.key] || ""}
                onChange={(e) =>
                  setContent({ ...content, [field.key]: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500 leading-relaxed font-mono"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
