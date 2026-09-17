"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  ExternalLink,
  Upload,
  Sparkles,
  RotateCcw,
  BookOpen,
  Image as ImageIcon,
  Quote,
  ShieldCheck,
} from "lucide-react";
import { heroContent as defaultHeroContent } from "@/data/navigation";

export default function EditHomePage() {
  const [content, setContent] = useState<any>(defaultHeroContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    async function loadHomeContent() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/pages/home");
        if (res.ok) {
          const data = await res.json();
          if (data.content) {
            setContent(data.content);
          }
        }
      } catch (err) {
        console.error("Failed to load home page content:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeContent();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/pages/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!res.ok) throw new Error("Failed to save changes");

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      alert(err.message || "Error saving home page");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset home page fields to the initial defaults?")) {
      setContent(defaultHeroContent);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image upload failed");

      setContent((prev: any) => ({
        ...prev,
        image: {
          ...(prev.image || {}),
          src: data.url,
        },
      }));
    } catch (err: any) {
      alert(err.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-gray-400">
        Loading home page editor...
      </div>
    );
  }

  const titleLines = content.titleLines || ["Guidance for", "Every Step of"];

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
              Edit Home Page
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Customize hero headlines, buttons, cover photo, and spiritual features
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
            href="/"
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Hero Headlines & Description */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Hero Headline & Eyebrow Badge</span>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Eyebrow Badge Text
            </label>
            <input
              type="text"
              value={content.eyebrow || ""}
              onChange={(e) =>
                setContent({ ...content, eyebrow: e.target.value })
              }
              placeholder="e.g. Faith • Knowledge • A Better You"
              className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Headline Line 1
              </label>
              <input
                type="text"
                value={titleLines[0] || ""}
                onChange={(e) => {
                  const newLines = [...titleLines];
                  newLines[0] = e.target.value;
                  setContent({ ...content, titleLines: newLines });
                }}
                placeholder="e.g. Guidance for"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Headline Line 2
              </label>
              <input
                type="text"
                value={titleLines[1] || ""}
                onChange={(e) => {
                  const newLines = [...titleLines];
                  newLines[1] = e.target.value;
                  setContent({ ...content, titleLines: newLines });
                }}
                placeholder="e.g. Every Step of"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Highlighted Accent Word
              </label>
              <input
                type="text"
                value={content.titleAccent || ""}
                onChange={(e) =>
                  setContent({ ...content, titleAccent: e.target.value })
                }
                placeholder="e.g. Your Journey"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-emerald-700 font-bold outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Hero Introductory Description
            </label>
            <textarea
              rows={3}
              value={content.description || ""}
              onChange={(e) =>
                setContent({ ...content, description: e.target.value })
              }
              placeholder="Brief overview explaining the mission and guides offered..."
              className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: Call To Action Buttons */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Call-to-Action Buttons</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
              <p className="font-bold text-gray-800 text-xs">
                Primary Button (Green Fill)
              </p>
              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Button Label
                </label>
                <input
                  type="text"
                  value={content.primaryCta?.label || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      primaryCta: {
                        ...(content.primaryCta || {}),
                        label: e.target.value,
                      },
                    })
                  }
                  placeholder="Explore Latest Articles"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Target Link URL
                </label>
                <input
                  type="text"
                  value={content.primaryCta?.href || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      primaryCta: {
                        ...(content.primaryCta || {}),
                        href: e.target.value,
                      },
                    })
                  }
                  placeholder="/blog"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-emerald-600 font-mono"
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
              <p className="font-bold text-gray-800 text-xs">
                Secondary Button (White Outline)
              </p>
              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Button Label
                </label>
                <input
                  type="text"
                  value={content.secondaryCta?.label || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      secondaryCta: {
                        ...(content.secondaryCta || {}),
                        label: e.target.value,
                      },
                    })
                  }
                  placeholder="Browse Umrah Guides"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Target Link URL
                </label>
                <input
                  type="text"
                  value={content.secondaryCta?.href || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      secondaryCta: {
                        ...(content.secondaryCta || {}),
                        href: e.target.value,
                      },
                    })
                  }
                  placeholder="/category/umrah-guides"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-emerald-600 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Hero Image & Spiritual Quote */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cover Photo */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>Hero Cover Photo</span>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Image Source URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={content.image?.src || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      image: {
                        ...(content.image || {}),
                        src: e.target.value,
                      },
                    })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 outline-none focus:border-emerald-600 text-xs font-mono"
                />
                <label className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? "Uploading..." : "Upload"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Image Alt Text (Accessibility)
              </label>
              <input
                type="text"
                value={content.image?.alt || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    image: {
                      ...(content.image || {}),
                      alt: e.target.value,
                    },
                  })
                }
                placeholder="Al-Masjid an-Nabawi in Madinah at sunset..."
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 outline-none focus:border-emerald-600 text-xs"
              />
            </div>

            {content.image?.src && (
              <div className="relative h-40 rounded-xl overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={content.image.src}
                  alt={content.image.alt || ""}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Spiritual Quote Card */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
              <Quote className="w-4 h-4 text-amber-600" />
              <span>Hero Verse / Spiritual Quote</span>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Quote Content
              </label>
              <textarea
                rows={4}
                value={content.quote?.text || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    quote: {
                      ...(content.quote || {}),
                      text: e.target.value,
                    },
                  })
                }
                placeholder="And those who strive for Us — We will surely guide them to Our ways."
                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 outline-none focus:border-emerald-600 leading-relaxed font-serif"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Quote Reference
              </label>
              <input
                type="text"
                value={content.quote?.reference || ""}
                onChange={(e) =>
                  setContent({
                    ...content,
                    quote: {
                      ...(content.quote || {}),
                      reference: e.target.value,
                    },
                  })
                }
                placeholder="Qur'an 29:69"
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Trust & Value Badges (4 cards) */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Trust & Value Badges (4 Features below Hero)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(content.trustItems || []).map((item: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Feature #{idx + 1}
                </span>
                <div>
                  <label className="block text-[11px] text-gray-600 font-medium mb-0.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={item.title || ""}
                    onChange={(e) => {
                      const updated = [...(content.trustItems || [])];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setContent({ ...content, trustItems: updated });
                    }}
                    className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-600 font-medium mb-0.5">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={item.description || ""}
                    onChange={(e) => {
                      const updated = [...(content.trustItems || [])];
                      updated[idx] = {
                        ...updated[idx],
                        description: e.target.value,
                      };
                      setContent({ ...content, trustItems: updated });
                    }}
                    className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-600 outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/admin/pages"
            className="text-xs font-semibold text-gray-500 hover:text-gray-800"
          >
            ← Back to All Pages
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Home Page"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
