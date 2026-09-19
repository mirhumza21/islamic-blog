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
  Plus,
  Trash2,
  LayoutGrid,
  LayoutTemplate,
  Info,
  CalendarDays,
  FolderTree,
  Star,
  Newspaper,
} from "lucide-react";
import { FormPageSkeleton } from "@/components/admin/AdminSkeletons";
import { AdminAccordion } from "@/components/admin/AdminAccordion";
import { AdminTextFields } from "@/components/admin/AdminTextFields";
import {
  heroContent as defaultHeroContent,
  HERO_SLIDE_SPECS,
} from "@/data/navigation";
import { defaultDailySpiritual } from "@/data/daily-spiritual";
import {
  defaultCalendar,
  defaultCategoriesSection,
  defaultFeaturedSection,
  defaultLatestSection,
  mergeHomeCopy,
} from "@/data/home-sections";

const DOCK_ICON_OPTIONS = [
  { value: "compass", label: "Compass" },
  { value: "book", label: "Book" },
  { value: "heart", label: "Heart" },
  { value: "luggage", label: "Luggage" },
  { value: "pen", label: "Pen" },
  { value: "sparkles", label: "Sparkles" },
];

const emptySlide = {
  src: "",
  alt: "",
  caption: "",
  objectPosition: "50% 50%",
};

const emptyVerse = {
  arabic: "",
  text: "",
  reference: "",
};

export default function EditHomePage() {
  const [content, setContent] = useState<any>({
    ...defaultHeroContent,
    ...mergeHomeCopy(),
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingSlideIndex, setUploadingSlideIndex] = useState<number | null>(null);
  const [openSection, setOpenSection] = useState<
    "hero" | "spiritual" | "calendar" | "categories" | "featured" | "latest" | null
  >("hero");

  useEffect(() => {
    async function loadHomeContent() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/pages/home");
        if (res.ok) {
          const data = await res.json();
          if (data.content) {
            setContent({
              ...defaultHeroContent,
              ...data.content,
              slides:
                Array.isArray(data.content.slides) && data.content.slides.length > 0
                  ? data.content.slides
                  : defaultHeroContent.slides,
              verses:
                Array.isArray(data.content.verses) && data.content.verses.length > 0
                  ? data.content.verses
                  : defaultHeroContent.verses,
              dockItems:
                Array.isArray(data.content.dockItems) && data.content.dockItems.length > 0
                  ? data.content.dockItems
                  : defaultHeroContent.dockItems,
              ...mergeHomeCopy(data.content),
            });
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
      const slides = (content.slides || []).filter((slide: any) => slide?.src);
      const payload = {
        ...content,
        slides,
        image: slides[0] || content.image,
        quote: content.verses?.[0] || content.quote,
      };

      const res = await fetch("/api/admin/pages/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      setContent({
        ...defaultHeroContent,
        ...mergeHomeCopy(),
      });
    }
  };

  const uploadFile = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Image upload failed");
    return data.url as string;
  };

  const handleSlideUpload = async (index: number, file: File) => {
    setUploadingSlideIndex(index);
    try {
      const url = await uploadFile(file);
      const slides = [...(content.slides || [])];
      slides[index] = { ...(slides[index] || emptySlide), src: url };
      setContent({ ...content, slides, image: index === 0 ? slides[0] : content.image });
    } catch (err: any) {
      alert(err.message || "Failed to upload image");
    } finally {
      setUploadingSlideIndex(null);
    }
  };

  const updateSlide = (index: number, patch: Record<string, string>) => {
    const slides = [...(content.slides || [])];
    slides[index] = { ...(slides[index] || emptySlide), ...patch };
    setContent({ ...content, slides });
  };

  const removeSlide = (index: number) => {
    const slides = (content.slides || []).filter((_: unknown, i: number) => i !== index);
    setContent({ ...content, slides });
  };

  if (loading) {
    return <FormPageSkeleton titleWidth="w-48" />;
  }

  const titleLines = content.titleLines || ["Guidance for", "Every Step of"];
  const slides = content.slides?.length ? content.slides : [emptySlide];
  const verses = content.verses?.length ? content.verses : [emptyVerse];
  const dockItems = content.dockItems || [];
  const spiritual = { ...defaultDailySpiritual, ...(content.dailySpiritual || {}) };
  const calendar = { ...defaultCalendar, ...(content.calendar || {}) };
  const categoriesCopy = { ...defaultCategoriesSection, ...(content.categories || {}) };
  const featuredCopy = { ...defaultFeaturedSection, ...(content.featured || {}) };
  const latestCopy = { ...defaultLatestSection, ...(content.latest || {}) };

  const updateBlock = (key: string, patch: Record<string, string>) => {
    setContent({
      ...content,
      [key]: { ...(content[key] || {}), ...patch },
    });
  };
  const updateSpiritual = (patch: Partial<typeof defaultDailySpiritual>) => {
    updateBlock("dailySpiritual", patch);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
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
              Edit homepage sections here. Subscribe copy is in Global.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saved to live site!
            </span>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-semibold transition-colors"
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

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <AdminAccordion
          title="Hero Section"
          description="Headline, buttons, slider, verses, dock, and trust badges"
          icon={<LayoutTemplate className="h-4 w-4" />}
          open={openSection === "hero"}
          onToggle={() => setOpenSection(openSection === "hero" ? null : "hero")}
        >
        {/* Headline */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Hero Headline (3 lines)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["Headline Line 1", "Headline Line 2", "Underlined Line 3"].map((label, idx) => (
              <div key={label}>
                <label className="block text-gray-700 font-semibold mb-1">{label}</label>
                {idx < 2 ? (
                  <input
                    type="text"
                    value={titleLines[idx] || ""}
                    onChange={(e) => {
                      const next = [...titleLines];
                      next[idx] = e.target.value;
                      setContent({ ...content, titleLines: next });
                    }}
                    placeholder={idx === 0 ? "Guidance for" : "Every Step of"}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                ) : (
                  <input
                    type="text"
                    value={content.titleAccent || ""}
                    onChange={(e) => setContent({ ...content, titleAccent: e.target.value })}
                    placeholder="Your Journey"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-emerald-700 font-bold outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Hero Description
            </label>
            <textarea
              rows={3}
              value={content.description || ""}
              onChange={(e) => setContent({ ...content, description: e.target.value })}
              className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 leading-relaxed"
            />
          </div>
        </div>

        {/* CTAs */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Call-to-Action Buttons</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: "primaryCta", title: "Primary Button (Green Fill)", placeholder: "Explore Latest Articles", href: "/blog" },
              { key: "secondaryCta", title: "Secondary Button (Outline)", placeholder: "Browse Umrah Guides", href: "/category/umrah-guides" },
            ].map((cta) => (
              <div key={cta.key} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                <p className="font-bold text-gray-800 text-xs">{cta.title}</p>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Button Label</label>
                  <input
                    type="text"
                    value={content[cta.key]?.label || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        [cta.key]: { ...(content[cta.key] || {}), label: e.target.value },
                      })
                    }
                    placeholder={cta.placeholder}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Target Link URL</label>
                  <input
                    type="text"
                    value={content[cta.key]?.href || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        [cta.key]: { ...(content[cta.key] || {}), href: e.target.value },
                      })
                    }
                    placeholder={cta.href}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-emerald-600 font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image Slider */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>Hero Image Slider</span>
            </div>
            <button
              type="button"
              onClick={() =>
                setContent({ ...content, slides: [...slides, { ...emptySlide }] })
              }
              disabled={slides.length >= 6}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Slide
            </button>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-amber-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div className="space-y-1 leading-relaxed">
              <p className="font-semibold">Recommended slider image size</p>
              <p>
                Upload landscape photos at <strong>{HERO_SLIDE_SPECS.width} × {HERO_SLIDE_SPECS.height} px</strong> ({HERO_SLIDE_SPECS.aspectLabel}).
                Minimum {HERO_SLIDE_SPECS.minWidth} × {HERO_SLIDE_SPECS.minHeight} px. {HERO_SLIDE_SPECS.formats}, under {HERO_SLIDE_SPECS.maxSizeMB} MB.
              </p>
              <p className="text-amber-800/90">
                Keep the main subject (Kaaba, mosque, minaret) on the right half — the left side is covered by headline text.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {slides.map((slide: any, idx: number) => (
              <div key={idx} className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Slide #{idx + 1}
                  </span>
                  {slides.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeSlide(idx)}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-[11px] font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  ) : null}
                </div>

                {slide.src ? (
                  <div className="relative h-36 overflow-hidden rounded-lg border border-gray-200 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={slide.src} alt={slide.alt || ""} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-gray-400">
                    No image yet
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={slide.src || ""}
                    onChange={(e) => updateSlide(idx, { src: e.target.value })}
                    placeholder="https://... or upload"
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-emerald-600 font-mono"
                  />
                  <label className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-semibold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingSlideIndex === idx ? "Uploading..." : "Upload"}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/webp,image/png"
                      disabled={uploadingSlideIndex !== null}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleSlideUpload(idx, file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">Alt text</label>
                    <input
                      type="text"
                      value={slide.alt || ""}
                      onChange={(e) => updateSlide(idx, { alt: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">Caption</label>
                    <input
                      type="text"
                      value={slide.caption || ""}
                      onChange={(e) => updateSlide(idx, { caption: e.target.value })}
                      placeholder="Al-Masjid an-Nabawi · al-Madinah"
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verses */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
              <Quote className="w-4 h-4 text-amber-600" />
              <span>Hero Quran Verses Slider</span>
            </div>
            <button
              type="button"
              onClick={() =>
                setContent({ ...content, verses: [...verses, { ...emptyVerse }] })
              }
              disabled={verses.length >= 6}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Verse
            </button>
          </div>
          <p className="text-gray-500">
            These rotate in the frosted glass card on the hero. Use verified mushaf Arabic only.
          </p>

          <div className="space-y-4">
            {verses.map((verse: any, idx: number) => (
              <div key={idx} className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    Verse #{idx + 1}
                  </span>
                  {verses.length > 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setContent({
                          ...content,
                          verses: verses.filter((_: unknown, i: number) => i !== idx),
                        })
                      }
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-[11px] font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  ) : null}
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Arabic ayah</label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    lang="ar"
                    value={verse.arabic || ""}
                    onChange={(e) => {
                      const next = [...verses];
                      next[idx] = { ...next[idx], arabic: e.target.value };
                      setContent({ ...content, verses: next });
                    }}
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 text-right text-base text-gray-900 outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">English translation</label>
                  <textarea
                    rows={2}
                    value={verse.text || ""}
                    onChange={(e) => {
                      const next = [...verses];
                      next[idx] = { ...next[idx], text: e.target.value };
                      setContent({ ...content, verses: next });
                    }}
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Reference</label>
                  <input
                    type="text"
                    value={verse.reference || ""}
                    onChange={(e) => {
                      const next = [...verses];
                      next[idx] = { ...next[idx], reference: e.target.value };
                      setContent({ ...content, verses: next });
                    }}
                    placeholder="Qur'an 29:69"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dock */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
            <LayoutGrid className="w-4 h-4 text-emerald-600" />
            <span>Bottom Category Dock</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dockItems.map((item: any, idx: number) => (
              <div key={idx} className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Item #{idx + 1}
                </span>
                <input
                  type="text"
                  value={item.title || ""}
                  onChange={(e) => {
                    const next = [...dockItems];
                    next[idx] = { ...next[idx], title: e.target.value };
                    setContent({ ...content, dockItems: next });
                  }}
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:border-emerald-600 font-medium"
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={item.subtitle || ""}
                  onChange={(e) => {
                    const next = [...dockItems];
                    next[idx] = { ...next[idx], subtitle: e.target.value };
                    setContent({ ...content, dockItems: next });
                  }}
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-600 outline-none focus:border-emerald-600"
                  placeholder="Subtitle"
                />
                <input
                  type="text"
                  value={item.href || ""}
                  onChange={(e) => {
                    const next = [...dockItems];
                    next[idx] = { ...next[idx], href: e.target.value };
                    setContent({ ...content, dockItems: next });
                  }}
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:border-emerald-600 font-mono"
                  placeholder="/category/..."
                />
                <select
                  value={item.icon || "sparkles"}
                  onChange={(e) => {
                    const next = [...dockItems];
                    next[idx] = { ...next[idx], icon: e.target.value };
                    setContent({ ...content, dockItems: next });
                  }}
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:border-emerald-600"
                >
                  {DOCK_ICON_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Trust & Value Badges</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(content.trustItems || []).map((item: any, idx: number) => (
              <div key={idx} className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Feature #{idx + 1}
                </span>
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
                <input
                  type="text"
                  value={item.description || ""}
                  onChange={(e) => {
                    const updated = [...(content.trustItems || [])];
                    updated[idx] = { ...updated[idx], description: e.target.value };
                    setContent({ ...content, trustItems: updated });
                  }}
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-600 outline-none focus:border-emerald-600"
                />
              </div>
            ))}
          </div>
        </div>
        </AdminAccordion>

        <AdminAccordion
          title="Daily Spiritual Essentials"
          description="Section titles and card labels. Prayer times, duas, and names stay live from APIs."
          icon={<Sparkles className="h-4 w-4" />}
          open={openSection === "spiritual"}
          onToggle={() => setOpenSection(openSection === "spiritual" ? null : "spiritual")}
        >
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Section heading
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={spiritual.eyebrow}
                  onChange={(e) => updateSpiritual({ eyebrow: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={spiritual.title}
                  onChange={(e) => updateSpiritual({ title: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Subtitle</label>
              <input
                type="text"
                value={spiritual.subtitle}
                onChange={(e) => updateSpiritual({ subtitle: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Prayer Times card
              </p>
              <div>
                <label className="block text-gray-600 font-medium mb-1">Card label</label>
                <input
                  type="text"
                  value={spiritual.prayerLabel}
                  onChange={(e) => updateSpiritual({ prayerLabel: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">Timetable button</label>
                <input
                  type="text"
                  value={spiritual.timetableLabel}
                  onChange={(e) => updateSpiritual({ timetableLabel: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">Location button</label>
                <input
                  type="text"
                  value={spiritual.locationLabel}
                  onChange={(e) => updateSpiritual({ locationLabel: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Dua of the Day card
              </p>
              <div>
                <label className="block text-gray-600 font-medium mb-1">Card label</label>
                <input
                  type="text"
                  value={spiritual.duaLabel}
                  onChange={(e) => updateSpiritual({ duaLabel: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">View all button</label>
                <input
                  type="text"
                  value={spiritual.viewAllDuasLabel}
                  onChange={(e) => updateSpiritual({ viewAllDuasLabel: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Word of the Day card
              </p>
              <div>
                <label className="block text-gray-600 font-medium mb-1">Card label</label>
                <input
                  type="text"
                  value={spiritual.wordLabel}
                  onChange={(e) => updateSpiritual({ wordLabel: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">Explore names button</label>
                <input
                  type="text"
                  value={spiritual.exploreNamesLabel}
                  onChange={(e) => updateSpiritual({ exploreNamesLabel: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>
        </AdminAccordion>

        <AdminAccordion
          title="Hijri Calendar & Sacred Events"
          description="Section titles and card labels. Dates and countdowns stay live."
          icon={<CalendarDays className="h-4 w-4" />}
          open={openSection === "calendar"}
          onToggle={() => setOpenSection(openSection === "calendar" ? null : "calendar")}
        >
          <AdminTextFields
            title="Section heading"
            values={calendar}
            onChange={(key, value) => updateBlock("calendar", { [key]: value })}
            fields={[
              { key: "eyebrow", label: "Eyebrow" },
              { key: "title", label: "Title" },
              { key: "subtitle", label: "Subtitle" },
              { key: "calendarLabel", label: "Calendar card label" },
              { key: "eventsLabel", label: "Events card label" },
              { key: "countdownLabel", label: "Countdown card label" },
              { key: "countdownSubtitle", label: "Countdown subtitle" },
              { key: "selectMilestoneLabel", label: "Milestone selector label" },
              { key: "todayBlessing", label: "Today’s blessing text", rows: 3 },
            ]}
          />
        </AdminAccordion>

        <AdminAccordion
          title="Browse by Category"
          description="Heading above the category grid. Categories themselves come from the Categories page."
          icon={<FolderTree className="h-4 w-4" />}
          open={openSection === "categories"}
          onToggle={() => setOpenSection(openSection === "categories" ? null : "categories")}
        >
          <AdminTextFields
            values={categoriesCopy}
            onChange={(key, value) => updateBlock("categories", { [key]: value })}
            fields={[
              { key: "eyebrow", label: "Eyebrow" },
              { key: "title", label: "Title" },
            ]}
          />
        </AdminAccordion>

        <AdminAccordion
          title="Featured Article"
          description="Badge and button text. The article itself is chosen from published posts."
          icon={<Star className="h-4 w-4" />}
          open={openSection === "featured"}
          onToggle={() => setOpenSection(openSection === "featured" ? null : "featured")}
        >
          <AdminTextFields
            values={featuredCopy}
            onChange={(key, value) => updateBlock("featured", { [key]: value })}
            fields={[
              { key: "badge", label: "Badge" },
              { key: "buttonLabel", label: "Button label" },
            ]}
          />
        </AdminAccordion>

        <AdminAccordion
          title="Latest Articles"
          description="Section heading and the View All link."
          icon={<Newspaper className="h-4 w-4" />}
          open={openSection === "latest"}
          onToggle={() => setOpenSection(openSection === "latest" ? null : "latest")}
        >
          <AdminTextFields
            values={latestCopy}
            onChange={(key, value) => updateBlock("latest", { [key]: value })}
            fields={[
              { key: "eyebrow", label: "Eyebrow" },
              { key: "title", label: "Title" },
              { key: "allTopicsLabel", label: "All topics pill" },
              { key: "viewAllLabel", label: "View all label" },
              { key: "viewAllHref", label: "View all link", mono: true },
            ]}
          />
        </AdminAccordion>

        <div className="flex items-center justify-between pt-4">
          <Link href="/admin/pages" className="text-xs font-semibold text-gray-500 hover:text-gray-800">
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
