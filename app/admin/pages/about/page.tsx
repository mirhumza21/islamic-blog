"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  RotateCcw,
  BookOpen,
  ShieldCheck,
  HeartHandshake,
  Mail,
  Plus,
  Trash2,
  HelpCircle,
  Layers,
} from "lucide-react";
import { defaultAboutContent } from "@/lib/pages";

export default function EditAboutPage() {
  const [content, setContent] = useState<any>(defaultAboutContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadAboutContent() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/pages/about");
        if (res.ok) {
          const data = await res.json();
          if (data.content) {
            setContent({ ...defaultAboutContent, ...data.content });
          }
        }
      } catch (err) {
        console.error("Failed to load about page content:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAboutContent();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/pages/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!res.ok) throw new Error("Failed to save changes");

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      alert(err.message || "Error saving about page");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset about page fields to the initial defaults?")) {
      setContent(defaultAboutContent);
    }
  };

  const handlePrincipleChange = (index: number, field: "title" | "text", value: string) => {
    const updated = [...(content.principles || [])];
    if (updated[index]) {
      updated[index] = { ...updated[index], [field]: value };
      setContent({ ...content, principles: updated });
    }
  };

  const handleAddPrinciple = () => {
    const updated = [
      ...(content.principles || []),
      {
        title: "New Principle",
        text: "Describe this core editorial standard or value.",
      },
    ];
    setContent({ ...content, principles: updated });
  };

  const handleRemovePrinciple = (index: number) => {
    const updated = (content.principles || []).filter((_: any, i: number) => i !== index);
    setContent({ ...content, principles: updated });
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-gray-400">
        Loading about page editor...
      </div>
    );
  }

  const principles = content.principles || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            title="Back to Pages"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
              Edit About Page
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Customize hero headlines, mission statements, authenticity standards, principles, and contact details
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-medium animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saved to live site!
            </span>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-semibold transition-colors"
            title="Reset to default content"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live</span>
          </a>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Hero Header & Introduction */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Hero Header & Mission Tagline</span>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Eyebrow Badge Text
            </label>
            <input
              type="text"
              value={content.eyebrow || ""}
              onChange={(e) => setContent({ ...content, eyebrow: e.target.value })}
              placeholder="e.g. About UmrahZone"
              className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Main Page Headline
            </label>
            <input
              type="text"
              value={content.headline || ""}
              onChange={(e) => setContent({ ...content, headline: e.target.value })}
              placeholder="e.g. Knowledge today, a closer tomorrow"
              className="w-full font-serif text-base font-bold bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Introductory Subheadline / Summary
            </label>
            <textarea
              rows={3}
              value={content.subheadline || ""}
              onChange={(e) => setContent({ ...content, subheadline: e.target.value })}
              placeholder="Brief introductory statement describing the platform..."
              className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 leading-relaxed outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* Section 2: Narrative Pillars */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Our Narrative & Editorial Identity</span>
          </div>

          {/* Mission */}
          <div className="space-y-2 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-gray-700 font-semibold mb-1">Section Title</label>
                <input
                  type="text"
                  value={content.missionTitle || ""}
                  onChange={(e) => setContent({ ...content, missionTitle: e.target.value })}
                  placeholder="Our Mission"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 outline-none focus:border-emerald-600"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-gray-700 font-semibold mb-1">Section Content</label>
                <textarea
                  rows={3}
                  value={content.missionText || ""}
                  onChange={(e) => setContent({ ...content, missionText: e.target.value })}
                  placeholder="Explain why this platform exists and its core mission..."
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 leading-relaxed outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Why We Exist */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-gray-700 font-semibold mb-1">Section Title</label>
                <input
                  type="text"
                  value={content.whyWeExistTitle || ""}
                  onChange={(e) => setContent({ ...content, whyWeExistTitle: e.target.value })}
                  placeholder="Why UmrahZone Exists"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 outline-none focus:border-emerald-600"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-gray-700 font-semibold mb-1">Section Content</label>
                <textarea
                  rows={3}
                  value={content.whyWeExistText || ""}
                  onChange={(e) => setContent({ ...content, whyWeExistText: e.target.value })}
                  placeholder="Explain the unique background and problem being solved..."
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 leading-relaxed outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Authenticity & Sources */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-gray-700 font-semibold mb-1">Section Title</label>
                <input
                  type="text"
                  value={content.authenticityTitle || ""}
                  onChange={(e) => setContent({ ...content, authenticityTitle: e.target.value })}
                  placeholder="Authenticity & Sources"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 outline-none focus:border-emerald-600"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-gray-700 font-semibold mb-1">Section Content</label>
                <textarea
                  rows={3}
                  value={content.authenticityText || ""}
                  onChange={(e) => setContent({ ...content, authenticityText: e.target.value })}
                  placeholder="Explain your approach to scholarly verification and sacred text precision..."
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 leading-relaxed outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Editorial Standards */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-gray-700 font-semibold mb-1">Section Title</label>
                <input
                  type="text"
                  value={content.editorialStandardsTitle || ""}
                  onChange={(e) =>
                    setContent({ ...content, editorialStandardsTitle: e.target.value })
                  }
                  placeholder="Editorial Standards"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 outline-none focus:border-emerald-600"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-gray-700 font-semibold mb-1">Section Content</label>
                <textarea
                  rows={3}
                  value={content.editorialStandardsText || ""}
                  onChange={(e) =>
                    setContent({ ...content, editorialStandardsText: e.target.value })
                  }
                  placeholder="Describe your writing, scanning, and tone standards..."
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 leading-relaxed outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Content Principles */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Core Content Principles</span>
            </div>
            <button
              type="button"
              onClick={handleAddPrinciple}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Principle</span>
            </button>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Principles Box Heading</label>
            <input
              type="text"
              value={content.principlesTitle || ""}
              onChange={(e) => setContent({ ...content, principlesTitle: e.target.value })}
              placeholder="Our Content Principles"
              className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-3 pt-2">
            {principles.map((item: any, idx: number) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    Principle #{idx + 1}
                  </span>
                  {principles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePrinciple(idx)}
                      className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                      title="Remove principle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title || ""}
                      onChange={(e) => handlePrincipleChange(idx, "title", e.target.value)}
                      placeholder="e.g. Clarity over complexity"
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-gray-900 outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-600 font-medium mb-1">Description</label>
                    <input
                      type="text"
                      value={item.text || ""}
                      onChange={(e) => handlePrincipleChange(idx, "text", e.target.value)}
                      placeholder="e.g. We explain rites in plain language..."
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-gray-900 outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Contact Box */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
            <Mail className="w-4 h-4 text-emerald-600" />
            <span>Contact Card Settings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Contact Card Title</label>
              <input
                type="text"
                value={content.contactTitle || ""}
                onChange={(e) => setContent({ ...content, contactTitle: e.target.value })}
                placeholder="Contact"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Contact Email Address</label>
              <input
                type="email"
                value={content.contactEmail || ""}
                onChange={(e) => setContent({ ...content, contactEmail: e.target.value })}
                placeholder="editorial@umrahzone.example"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Invitation Text</label>
            <input
              type="text"
              value={content.contactText || ""}
              onChange={(e) => setContent({ ...content, contactText: e.target.value })}
              placeholder="Questions, corrections, or collaboration ideas are welcome."
              className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Button Label</label>
              <input
                type="text"
                value={content.contactButtonText || ""}
                onChange={(e) =>
                  setContent({ ...content, contactButtonText: e.target.value })
                }
                placeholder="Go to contact page"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Button Target Link</label>
              <input
                type="text"
                value={content.contactButtonUrl || ""}
                onChange={(e) =>
                  setContent({ ...content, contactButtonUrl: e.target.value })
                }
                placeholder="/contact"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-gray-400">
            Changes made here will instantly update the public About page (/about).
          </p>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save About Page"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
