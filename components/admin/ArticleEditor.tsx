"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  Upload,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { getHeadingId } from "@/lib/articles";
import { ArticleBlock } from "@/types/blog";

interface ArticleEditorProps {
  initialData?: any;
  isEditing?: boolean;
}

export function ArticleEditor({ initialData, isEditing = false }: ArticleEditorProps) {
  const router = useRouter();

  // Categories & Authors
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);

  // Form fields
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [slugLocked, setSlugLocked] = useState(isEditing);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [categorySlug, setCategorySlug] = useState(
    initialData?.category_slug || initialData?.categorySlug || "umrah-guides"
  );
  const [authorId, setAuthorId] = useState(
    initialData?.author_id || initialData?.authorId || "dr-bilal-mansoor"
  );
  const [image, setImage] = useState(
    initialData?.image ||
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1600&q=80"
  );
  const [imageAlt, setImageAlt] = useState(initialData?.imageAlt || initialData?.image_alt || "");
  const [readingTime, setReadingTime] = useState(initialData?.readingTime || initialData?.reading_time || 5);
  const [featured, setFeatured] = useState(Boolean(initialData?.featured));
  const [popular, setPopular] = useState(Boolean(initialData?.popular));
  const [status, setStatus] = useState(initialData?.status || "published");
  const [tagsInput, setTagsInput] = useState(
    Array.isArray(initialData?.tags) ? initialData.tags.join(", ") : ""
  );

  // SEO fields
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title || initialData?.seo?.title || "");
  const [seoDescription, setSeoDescription] = useState(
    initialData?.seo_description || initialData?.seo?.description || ""
  );

  // Content Blocks
  const [content, setContent] = useState<ArticleBlock[]>(
    initialData?.content && Array.isArray(initialData.content) && initialData.content.length > 0
      ? initialData.content
      : [
          {
            type: "paragraph",
            text: "Write your article opening thoughts here...",
          },
        ]
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"visual" | "json" | "seo">("visual");

  // Image upload
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setImage(data.url);
    } catch (err: any) {
      setUploadError(err.message || "Upload failed. Make sure \'blog-images\' bucket exists in Supabase Storage.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(console.error);

    fetch("/api/admin/authors")
      .then((res) => res.json())
      .then((data) => setAuthors(data.authors || []))
      .catch(console.error);
  }, []);

  // Live generate slug from title when unlocked
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugLocked) {
      setSlug(getHeadingId(val));
    }
  };

  // Block management
  const addBlock = (type: ArticleBlock["type"] | "image") => {
    let newBlock: any;
    switch (type) {
      case "paragraph":
        newBlock = { type: "paragraph", text: "" };
        break;
      case "heading":
        newBlock = { type: "heading", level: 2, text: "", id: "" };
        break;
      case "callout":
        newBlock = { type: "callout", variant: "tip", title: "Key Insight", text: "" };
        break;
      case "quran":
        newBlock = {
          type: "quran",
          arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
          translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
          surah: "Al-Fatihah",
          ayah: "1:1",
        };
        break;
      case "hadith":
        newBlock = {
          type: "hadith",
          text: "Actions are but by intention...",
          source: "Sahih al-Bukhari",
          grade: "Sahih",
        };
        break;
      case "dua":
        newBlock = {
          type: "dua",
          title: "Dua for Guidance",
          arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
          translation: "Our Lord, give us in this world that which is good and in the Hereafter that which is good and save us from the punishment of the Fire.",
        };
        break;
      case "blockquote":
        newBlock = { type: "blockquote", text: "", cite: "" };
        break;
      case "list":
        newBlock = { type: "list", style: "unordered", items: ["Item 1", "Item 2"] };
        break;
      case "faq":
        newBlock = {
          type: "faq",
          items: [{ question: "Frequently asked question?", answer: "Clear detailed answer." }],
        };
        break;
      case "image":
        newBlock = { type: "image", src: "", alt: "", caption: "" };
        break;
      default:
        newBlock = { type: "paragraph", text: "" };
    }
    setContent([...content, newBlock]);
  };

  const updateBlock = (index: number, updatedBlock: ArticleBlock) => {
    const updated = [...content];
    updated[index] = updatedBlock;
    setContent(updated);
  };

  const removeBlock = (index: number) => {
    setContent(content.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === content.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...content];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setContent(updated);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter an article title.");
      return;
    }

    setSaving(true);
    setError("");

    const tags = tagsInput
      .split(",")
      .map((t: string) => t.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      title,
      slug: slug.trim() || getHeadingId(title),
      excerpt,
      category_slug: categorySlug,
      author_id: authorId,
      image,
      image_alt: imageAlt || title,
      reading_time: Number(readingTime) || 5,
      featured,
      popular,
      status,
      tags,
      content,
      seo_title: seoTitle || title,
      seo_description: seoDescription || excerpt,
    };

    try {
      const url = isEditing
        ? `/api/admin/articles/${initialData.id}`
        : "/api/admin/articles";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save article");
      }

      router.push("/admin/articles");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Top Header & Save Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 bg-gray-50/95 backdrop-blur py-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              {isEditing ? "Edit Article" : "Compose New Article"}
            </h1>
            <p className="text-xs text-gray-500">
              {isEditing ? `Editing: ${slug}` : "Draft or publish a new post"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditing && (
            <a
              href={`/blog/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-emerald-700 bg-white border border-gray-200 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </a>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : isEditing ? "Update Article" : "Publish Article"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Left editor (8 cols), Right Meta Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title and Excerpt Card */}
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Article Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. A Complete Guide to Performing Umrah Step by Step"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-4 py-2.5 text-base font-medium text-gray-900 placeholder:text-gray-400 outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  URL Slug
                </label>
                <button
                  type="button"
                  onClick={() => setSlugLocked(!slugLocked)}
                  className="text-[11px] text-emerald-600 hover:underline"
                >
                  {slugLocked ? "Unlock Slug" : "Lock Slug"}
                </button>
              </div>
              <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-500">
                <span className="text-gray-400">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  disabled={slugLocked}
                  onChange={(e) => setSlug(e.target.value)}
                  className="bg-transparent text-gray-800 focus:outline-none flex-1 ml-0.5 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Article Excerpt
              </label>
              <textarea
                rows={2}
                placeholder="A short, engaging 1-2 sentence preview of the article..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 focus:border-emerald-500 rounded-lg p-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none"
              />
            </div>
          </div>

          {/* Content Mode Tabs */}
          <div className="flex items-center gap-1 border-b border-gray-200 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab("visual")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "visual"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              Visual Block Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("seo")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "seo"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              SEO & Google Preview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("json")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "json"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              Raw JSON
            </button>
          </div>

          {/* Visual Block Editor */}
          {activeTab === "visual" && (
            <div className="space-y-4">
              {content.map((block, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-4 relative group shadow-sm"
                >
                  {/* Block Header Toolbar */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 text-[11px] text-gray-500 font-medium">
                    <span className="capitalize px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                      Block #{index + 1}: {block.type}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveBlock(index, "up")}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 text-gray-500"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(index, "down")}
                        disabled={index === content.length - 1}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 text-gray-500"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(index)}
                        className="p-1 text-red-400 hover:bg-red-50 rounded ml-2"
                        title="Delete Block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Block Type Forms */}
                  {block.type === "paragraph" && (
                    <textarea
                      rows={4}
                      value={block.text}
                      onChange={(e) =>
                        updateBlock(index, { ...block, text: e.target.value })
                      }
                      placeholder="Write editorial paragraph text here..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-800 outline-none leading-relaxed focus:border-emerald-400"
                    />
                  )}

                  {(block as any).type === "image" && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={(block as any).src || ""}
                          onChange={(e) => updateBlock(index, { ...block, src: e.target.value } as any)}
                          placeholder="Image URL or upload below..."
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:border-emerald-400"
                        />
                        <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const formData = new FormData();
                              formData.append("file", file);
                              try {
                                const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                                const data = await res.json();
                                if (res.ok) updateBlock(index, { ...block, src: data.url } as any);
                              } catch {}
                            }}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={(block as any).alt || ""}
                        onChange={(e) => updateBlock(index, { ...block, alt: e.target.value } as any)}
                        placeholder="Alt text (accessibility)"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none"
                      />
                      <input
                        type="text"
                        value={(block as any).caption || ""}
                        onChange={(e) => updateBlock(index, { ...block, caption: e.target.value } as any)}
                        placeholder="Caption (optional)"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 outline-none"
                      />
                      {(block as any).src && (
                        <img src={(block as any).src} alt={(block as any).alt || ""} className="w-full rounded-lg object-cover max-h-48 border border-gray-200" />
                      )}
                    </div>
                  )}

                  {block.type === "heading" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={block.level}
                          onChange={(e) =>
                            updateBlock(index, {
                              ...block,
                              level: Number(e.target.value) as 2 | 3,
                            })
                          }
                          className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700"
                        >
                          <option value={2}>Heading H2 (Section)</option>
                          <option value={3}>Heading H3 (Sub-section)</option>
                        </select>
                        <input
                          type="text"
                          value={block.text}
                          onChange={(e) =>
                            updateBlock(index, {
                              ...block,
                              text: e.target.value,
                              id: getHeadingId(e.target.value),
                            })
                          }
                          placeholder="Heading title..."
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 font-semibold"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400">
                        Anchor ID: #{block.id || getHeadingId(block.text)}
                      </p>
                    </div>
                  )}

                  {block.type === "quran" && (
                    <div className="space-y-3 bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/30">
                      <div>
                        <label className="block text-[11px] font-medium text-emerald-400 mb-1">
                          Arabic Ayah Text (Traditional Script)
                        </label>
                        <textarea
                          dir="rtl"
                          rows={2}
                          value={block.arabic}
                          onChange={(e) =>
                            updateBlock(index, { ...block, arabic: e.target.value })
                          }
                          className="w-full bg-slate-950 border border-emerald-800/40 rounded-lg p-2.5 text-sm font-serif text-right text-emerald-100 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">
                          Translation (English)
                        </label>
                        <textarea
                          rows={2}
                          value={block.translation}
                          onChange={(e) =>
                            updateBlock(index, { ...block, translation: e.target.value })
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Surah (e.g. Al-Baqarah)"
                          value={block.surah}
                          onChange={(e) =>
                            updateBlock(index, { ...block, surah: e.target.value })
                          }
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                        />
                        <input
                          type="text"
                          placeholder="Ayah Reference (e.g. 2:158)"
                          value={block.ayah}
                          onChange={(e) =>
                            updateBlock(index, { ...block, ayah: e.target.value })
                          }
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                        />
                      </div>
                    </div>
                  )}

                  {block.type === "hadith" && (
                    <div className="space-y-3 bg-teal-950/20 p-3 rounded-lg border border-teal-900/30">
                      <textarea
                        rows={3}
                        value={block.text}
                        onChange={(e) =>
                          updateBlock(index, { ...block, text: e.target.value })
                        }
                        placeholder="Hadith wording or narration..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Source (e.g. Sahih al-Bukhari 1234)"
                          value={block.source}
                          onChange={(e) =>
                            updateBlock(index, { ...block, source: e.target.value })
                          }
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                        />
                        <input
                          type="text"
                          placeholder="Grade (e.g. Sahih, Hasan)"
                          value={block.grade || ""}
                          onChange={(e) =>
                            updateBlock(index, { ...block, grade: e.target.value })
                          }
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                        />
                      </div>
                    </div>
                  )}

                  {block.type === "dua" && (
                    <div className="space-y-3 bg-amber-950/20 p-3 rounded-lg border border-amber-900/30">
                      <input
                        type="text"
                        placeholder="Dua Title (e.g. Dua for Entering Haram)"
                        value={block.title}
                        onChange={(e) =>
                          updateBlock(index, { ...block, title: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-amber-200"
                      />
                      <textarea
                        dir="rtl"
                        rows={2}
                        value={block.arabic}
                        onChange={(e) =>
                          updateBlock(index, { ...block, arabic: e.target.value })
                        }
                        placeholder="Arabic text..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm font-serif text-right text-amber-100 outline-none"
                      />
                      <textarea
                        rows={2}
                        value={block.translation}
                        onChange={(e) =>
                          updateBlock(index, { ...block, translation: e.target.value })
                        }
                        placeholder="English translation..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none"
                      />
                    </div>
                  )}

                  {block.type === "callout" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={block.variant}
                          onChange={(e) =>
                            updateBlock(index, {
                              ...block,
                              variant: e.target.value as any,
                            })
                          }
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                        >
                          <option value="tip">Tip (Emerald)</option>
                          <option value="note">Note (Blue/Gray)</option>
                          <option value="warning">Warning (Amber)</option>
                          <option value="info">Info (Teal)</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Callout title..."
                          value={block.title || ""}
                          onChange={(e) =>
                            updateBlock(index, { ...block, title: e.target.value })
                          }
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={block.text}
                        onChange={(e) =>
                          updateBlock(index, { ...block, text: e.target.value })
                        }
                        placeholder="Callout message..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none"
                      />
                    </div>
                  )}

                  {block.type === "blockquote" && (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        value={block.text}
                        onChange={(e) =>
                          updateBlock(index, { ...block, text: e.target.value })
                        }
                        placeholder="Quote text..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs italic text-slate-200 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Author citation / attribution (e.g. Dr. Bilal Mansoor)"
                        value={block.cite || ""}
                        onChange={(e) =>
                          updateBlock(index, { ...block, cite: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-400"
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* Add New Block Toolbar */}
              <div className="bg-white border border-dashed border-gray-300 rounded-xl p-5 text-center space-y-3">
                <p className="text-xs font-medium text-gray-500">
                  + Add Content Block
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {[
                    { type: "paragraph", label: "Paragraph", cls: "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200" },
                    { type: "heading", label: "Heading", cls: "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200" },
                    { type: "image", label: "🖼 Image", cls: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200" },
                    { type: "quran", label: "Quran Ayah", cls: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200" },
                    { type: "hadith", label: "Hadith", cls: "bg-teal-50 hover:bg-teal-100 text-teal-700 border-teal-200" },
                    { type: "dua", label: "Dua Box", cls: "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200" },
                    { type: "callout", label: "Callout", cls: "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200" },
                    { type: "blockquote", label: "Quote", cls: "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200" },
                    { type: "list", label: "List", cls: "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200" },
                    { type: "faq", label: "FAQ", cls: "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200" },
                  ].map(({ type, label, cls }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => addBlock(type as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${cls}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEO & SERP Preview Tab */}
          {activeTab === "seo" && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Search Engine Optimization (SEO)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Customize how this article looks in Google search results and social shares
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Meta Title (Recommended 50–60 chars)
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={title || "Article SEO Title"}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-xs text-gray-800 outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    {(seoTitle || title).length} characters
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Meta Description (Recommended 120–160 chars)
                  </label>
                  <textarea
                    rows={3}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder={excerpt || "Search engine description snippet..."}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-xs text-gray-800 outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    {(seoDescription || excerpt).length} characters
                  </p>
                </div>
              </div>

              {/* Google SERP Preview Card */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <p className="text-xs font-semibold text-gray-700">
                  Google Search Snippet Preview:
                </p>
                <div className="bg-white p-4 rounded-xl max-w-xl text-left font-sans shadow-sm">
                  <div className="text-[11px] text-[#202124] flex items-center gap-1.5">
                    <span className="font-medium">umrahzone.com</span>
                    <span>› blog › {slug || "slug"}</span>
                  </div>
                  <h4 className="text-[#1a0dab] text-base font-medium hover:underline line-clamp-1 mt-1 cursor-pointer">
                    {seoTitle || title || "Article Title Preview"} | UmrahZone
                  </h4>
                  <p className="text-[13px] text-[#4d5156] line-clamp-2 mt-1 leading-snug">
                    {seoDescription ||
                      excerpt ||
                      "Add a concise meta description to preview how your article appears in search engine results."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Raw JSON Tab */}
          {activeTab === "json" && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-3">
              <p className="text-xs text-gray-500">
                You can directly edit or inspect the JSON blocks array:
              </p>
              <textarea
                rows={16}
                value={JSON.stringify(content, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    if (Array.isArray(parsed)) setContent(parsed);
                  } catch {}
                }}
                className="w-full font-mono text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 text-emerald-700 outline-none leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Right Metadata Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Publish Settings Card */}
          <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Publishing Options
            </h3>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none"
              >
                <option value="published">Published (Visible to all)</option>
                <option value="draft">Draft (Admin only)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Category</label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Author</label>
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none"
              >
                {authors.map((auth) => (
                  <option key={auth.id} value={auth.id}>{auth.name} ({auth.role || "Author"})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Reading Time (mins)</label>
              <input
                type="number" min={1} max={60}
                value={readingTime}
                onChange={(e) => setReadingTime(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none"
              />
            </div>

            <div className="pt-2 border-t border-gray-100 space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-700">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500" />
                <span>Pin as Featured Article</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-700">
                <input type="checkbox" checked={popular} onChange={(e) => setPopular(e.target.checked)}
                  className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500" />
                <span>Mark as Trending / Popular</span>
              </label>
            </div>
          </div>

          {/* Featured Image Card */}
          <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Featured Image</h3>

            {/* Upload Button */}
            <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 hover:border-emerald-400 rounded-lg cursor-pointer transition-colors bg-gray-50 hover:bg-emerald-50 group">
              {uploading ? (
                <><Loader2 className="w-4 h-4 animate-spin text-emerald-500" /><span className="text-xs text-gray-500">Uploading...</span></>
              ) : (
                <><Upload className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" /><span className="text-xs text-gray-500 group-hover:text-emerald-700 font-medium">Click to Upload Image</span></>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
            </label>

            {uploadError && (
              <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{uploadError}</p>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Image URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Image Alt Text</label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Descriptive text for accessibility"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none"
              />
            </div>

            {image && (
              <div className="rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={imageAlt || "Preview"} className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Tags Card */}
          <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Tags & Keywords</h3>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. umrah, guide, rituals, makkah"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-gray-400">
              Separate tags with commas. Helps related articles and search discovery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
