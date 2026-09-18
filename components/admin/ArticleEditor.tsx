"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  Eye,
  Image as ImageIcon,
  UploadCloud,
  Globe,
  Share2,
  FileText,
  CheckCircle2,
  Trash2,
  Plus,
  Search,
  Sparkles,
  Layers,
  Tag,
  HelpCircle,
  ExternalLink,
  RefreshCw,
  Clock,
  User,
  Folder,
} from "lucide-react";
import { TiptapEditor, type TiptapEditorHandle } from "./TiptapEditor";
import { toast, ToastContainer } from "./Toast";
import { uploadClientImage } from "@/lib/uploadClientImage";
import { slugify } from "@/lib/utils";
import { CustomSelect } from "./CustomSelect";
import type { Article, ArticleBlock } from "@/types/blog";

interface ArticleEditorProps {
  article?: Article;
  initialData?: any;
  isNew?: boolean;
  isEditing?: boolean;
}

/**
 * Converts legacy block-based article content into rich HTML for Tiptap
 */
function blocksToHtml(blocks: ArticleBlock[] | string | undefined): string {
  if (!blocks) return "<p></p>";
  if (typeof blocks === "string") return blocks;
  if (!Array.isArray(blocks) || blocks.length === 0) return "<p></p>";

  // If already an HTML block
  if (blocks.length === 1 && (blocks[0] as any).type === "html") {
    return (blocks[0] as any).text || "<p></p>";
  }

  return blocks
    .map((block) => {
      switch (block.type) {
        case "html":
          return block.text;
        case "paragraph":
          return block.text?.includes("<")
            ? block.text
            : `<p>${block.text || ""}</p>`;
        case "heading":
          return `<h${block.level || 2}>${block.text || ""}</h${block.level || 2}>`;
        case "blockquote":
          return `<blockquote><p>${block.text || ""}</p>${
            block.cite ? `<cite>— ${block.cite}</cite>` : ""
          }</blockquote>`;
        case "list":
          const tag = block.style === "ordered" ? "ol" : "ul";
          return `<${tag}>${(block.items || [])
            .map((i) => `<li>${i}</li>`)
            .join("")}</${tag}>`;
        case "image":
          return `<figure><img src="${block.src}" alt="${
            block.alt || ""
          }" />${
            block.caption ? `<figcaption>${block.caption}</figcaption>` : ""
          }</figure>`;
        case "quran":
          return `
            <div class="quran-quote-card my-8 p-6 rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 shadow-xs" data-quran="true">
              ${
                block.arabic
                  ? `<p class="text-right font-serif text-2xl sm:text-3xl text-emerald-950 mb-3 leading-loose" dir="rtl">${block.arabic}</p>`
                  : ""
              }
              <p class="text-base sm:text-lg text-gray-800 italic leading-relaxed mb-3">"${
                block.translation
              }"</p>
              <div class="text-xs font-bold uppercase tracking-wider text-emerald-800">— Surah ${
                block.surah
              } (${block.ayah})</div>
            </div>
          `;
        case "hadith":
          return `
            <div class="hadith-quote-card my-8 p-6 rounded-2xl border-2 border-teal-300 bg-teal-50/70 shadow-xs" data-hadith="true">
              <p class="text-base sm:text-lg text-gray-800 italic leading-relaxed mb-3">"${
                block.text
              }"</p>
              <div class="text-xs font-bold uppercase tracking-wider text-teal-800">— ${
                block.source
              }${block.grade ? ` · Grade: ${block.grade}` : ""}</div>
            </div>
          `;
        case "dua":
          return `
            <div class="dua-card my-8 p-6 rounded-2xl border-2 border-amber-300 bg-amber-50/70 shadow-xs" data-dua="true">
              <div class="text-xs font-bold uppercase tracking-widest text-amber-800 mb-2">${
                block.title
              }</div>
              <p class="text-right font-serif text-2xl text-amber-950 mb-3 leading-loose" dir="rtl">${
                block.arabic
              }</p>
              ${
                block.transliteration
                  ? `<p class="text-xs text-amber-900/80 italic mb-1">${block.transliteration}</p>`
                  : ""
              }
              <p class="text-sm sm:text-base text-gray-800 leading-relaxed">${
                block.translation
              }</p>
            </div>
          `;
        case "callout":
          return `
            <div class="islamic-callout my-6 p-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50 text-emerald-900 shadow-xs" data-callout="${
              block.variant || "tip"
            }">
              <div class="font-bold text-sm mb-1">${
                block.title || "Note"
              }</div>
              <p class="text-sm leading-relaxed">${block.text}</p>
            </div>
          `;
        case "table":
          return `
            <table class="w-full border-collapse border border-gray-200 my-6">
              <thead><tr>${(block.headers || [])
                .map(
                  (h) =>
                    `<th class="border border-gray-200 p-2.5 bg-gray-50 font-bold">${h}</th>`
                )
                .join("")}</tr></thead>
              <tbody>${(block.rows || [])
                .map(
                  (row) =>
                    `<tr>${(row || [])
                      .map(
                        (cell) =>
                          `<td class="border border-gray-200 p-2.5">${cell}</td>`
                      )
                      .join("")}</tr>`
                )
                .join("")}</tbody>
            </table>
          `;
        default:
          return (block as any).text ? `<p>${(block as any).text}</p>` : "";
      }
    })
    .join("\n");
}

export function ArticleEditor({
  article,
  initialData,
  isNew,
  isEditing,
}: ArticleEditorProps) {
  const currentArticle = article || initialData;
  const isCreation = isNew !== undefined ? isNew : !isEditing;

  const router = useRouter();
  const tiptapRef = useRef<TiptapEditorHandle>(null);
  const featuredImageInputRef = useRef<HTMLInputElement>(null);

  // ── Form State ──────────────────────────────────────────────────────────────
  const [title, setTitle] = useState(currentArticle?.title || "");
  const [slug, setSlug] = useState(currentArticle?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(currentArticle?.slug));
  const [excerpt, setExcerpt] = useState(currentArticle?.excerpt || "");
  const [categorySlug, setCategorySlug] = useState(
    currentArticle?.categorySlug || currentArticle?.category_slug || ""
  );
  const [authorId, setAuthorId] = useState(
    currentArticle?.authorId || currentArticle?.author_id || ""
  );
  const [image, setImage] = useState(currentArticle?.image || "");
  const [imageAlt, setImageAlt] = useState(
    currentArticle?.imageAlt || currentArticle?.image_alt || ""
  );
  const [featured, setFeatured] = useState(currentArticle?.featured || false);
  const [popular, setPopular] = useState(currentArticle?.popular || false);
  const [status, setStatus] = useState<"published" | "draft">(
    (currentArticle as any)?.status === "draft" ? "draft" : "published"
  );
  const [content, setContent] = useState<string>(() =>
    blocksToHtml(currentArticle?.content)
  );

  // SEO State
  const [seoTitle, setSeoTitle] = useState(
    currentArticle?.seo?.title || currentArticle?.seo_title || ""
  );
  const [seoDescription, setSeoDescription] = useState(
    currentArticle?.seo?.description || currentArticle?.seo_description || ""
  );
  const [canonicalUrl, setCanonicalUrl] = useState(
    currentArticle?.slug ? `/blog/${currentArticle.slug}` : ""
  );
  const [tagsInput, setTagsInput] = useState(
    currentArticle?.tags ? currentArticle.tags.join(", ") : ""
  );

  // FAQs
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>(
    () => {
      if (Array.isArray(currentArticle?.content)) {
        const faqBlock = currentArticle.content.find((b: any) => b.type === "faq");
        if (faqBlock && faqBlock.type === "faq") return faqBlock.items;
      }
      return [];
    }
  );

  // Image Upload State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  // Authors & Categories from DB
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [authors, setAuthors] = useState<{ id: string; name: string; avatar: string }[]>([]);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.categories || [];
        if (Array.isArray(list) && list.length > 0) {
          setCategories(
            list.map((cat: any) => ({ slug: cat.slug, name: cat.name }))
          );
          if (!categorySlug && list[0]?.slug) setCategorySlug(list[0].slug);
        }
      })
      .catch((err) => console.error("Could not load categories:", err));

    fetch("/api/admin/authors")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.authors || [];
        if (Array.isArray(list) && list.length > 0) {
          setAuthors(
            list.map((author: any) => ({
              id: author.id,
              name: author.name,
              avatar: author.avatar,
            }))
          );
          if (!authorId && list[0]?.id) setAuthorId(list[0].id);
        }
      })
      .catch((err) => console.error("Could not load authors:", err));
  }, []);

  // Title change -> auto-generate slug if not manually touched
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugTouched) {
      setSlug(slugify(val));
    }
  };

  // Upload Featured Cover Image
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadClientImage(file);
      if (res.success && res.imageUrl) {
        setImage(res.imageUrl);
        if (!imageAlt) setImageAlt(title || file.name);
        toast.success("Cover image uploaded successfully");
      } else {
        toast.error(res.error || "Failed to upload image");
      }
    } catch {
      toast.error("Upload network error");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  // Word & Reading Time calculation
  const wordCount = useMemo(() => {
    const text = content.replace(/<[^>]*>/g, " ").trim();
    return text ? text.split(/\s+/).length : 0;
  }, [content]);

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Save Article
  const handleSave = async (publishStatus?: "published" | "draft") => {
    const finalStatus = publishStatus || status;
    setStatus(finalStatus);

    if (!title.trim()) {
      toast.error("Article title is required.");
      return;
    }
    if (!slug.trim()) {
      toast.error("Article slug is required.");
      return;
    }
    if (!image.trim()) {
      toast.error("Please provide or upload a featured cover image.");
      return;
    }

    setSaving(true);

    const tags = tagsInput
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);

    // Build the final content structure:
    // Store as an HTML block (or append FAQ block if provided)
    const contentPayload: any[] = [
      {
        type: "html",
        text: content,
      },
    ];

    if (faqs.length > 0 && faqs.some((f) => f.question && f.answer)) {
      contentPayload.push({
        type: "faq",
        items: faqs.filter((f) => f.question && f.answer),
      });
    }

    const payload = {
      title,
      slug,
      excerpt: excerpt || title,
      category_slug: categorySlug || categories[0]?.slug || "umrah-guides",
      author_id: authorId || authors[0]?.id || "author-1",
      image,
      image_alt: imageAlt || title,
      featured,
      popular,
      status: finalStatus,
      reading_time: readingTime,
      tags,
      content: contentPayload,
      seo_title: seoTitle || undefined,
      seo_description: seoDescription || undefined,
    };

    try {
      const url = isCreation
        ? "/api/admin/articles"
        : `/api/admin/articles/${currentArticle?.id}`;
      const method = isCreation ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        toast.error(data.error || "Failed to save article");
        return;
      }

      toast.success(
        isCreation ? "Article created successfully!" : "Article saved successfully!"
      );
      setTimeout(() => {
        router.push("/admin/articles");
        router.refresh();
      }, 700);
    } catch (err: any) {
      toast.error(err.message || "Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  // SEO Preview Data
  const previewTitle = seoTitle.trim() || title.trim() || "Article Title";
  const previewDesc =
    seoDescription.trim() ||
    excerpt.trim() ||
    "Add a meta description or summary to optimize how this article appears in search engines.";
  const previewSlug = slug.trim() || "article-url-slug";

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <ToastContainer />

      {/* ── Sticky Top Action Bar (Clean white admin theme) ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Left: breadcrumb + title */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/admin/articles"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-all shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Articles</span>
            </Link>

            <div className="h-4 w-px bg-gray-200 hidden sm:block shrink-0" />

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                  {isCreation ? "✦ New Post" : "✦ Editing"}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    status === "published"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {status === "published" ? "● Published" : "○ Draft"}
                </span>
              </div>
              <h1 className="text-sm font-bold text-gray-900 truncate max-w-[240px] sm:max-w-sm leading-tight mt-0.5">
                {title || <span className="text-gray-400 italic font-normal">Untitled Article</span>}
              </h1>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 shrink-0">
            {!isCreation && currentArticle?.slug && (
              <Link
                href={`/blog/${currentArticle.slug}`}
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Live</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}

            <button
              type="button"
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-all cursor-pointer disabled:opacity-50"
            >
              Save Draft
            </button>

            <button
              type="button"
              onClick={() => handleSave("published")}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>
                {saving
                  ? "Saving..."
                  : isCreation
                    ? "Publish Article"
                    : status === "draft"
                      ? "Publish Article"
                      : "Save & Publish"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Layout: 2 Columns ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ══════════════════════════════════════════════════════════════════════
              LEFT / MAIN CONTENT CANVAS (~68%, 8 cols)
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 space-y-6">
            {/* Title & Slug Box */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter a compelling article title..."
                  className="w-full font-serif text-2xl sm:text-3xl font-bold text-gray-900 placeholder:text-gray-300 outline-none border-none bg-transparent"
                />
              </div>

              {/* Slug Row */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-xs">
                <span className="text-gray-400 font-mono">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugTouched(true);
                  }}
                  placeholder="article-url-slug"
                  className="flex-1 font-mono text-emerald-800 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSlug(slugify(title));
                    setSlugTouched(false);
                    toast.info("Slug regenerated from title");
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                  title="Regenerate slug"
                >
                  Auto
                </button>
              </div>
            </div>


            {/* Featured Cover Photo Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>Featured Cover Photo</span>
                </div>
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                  >
                    Remove Photo
                  </button>
                )}
              </div>

              {image ? (
                <div className="space-y-4">
                  <div className="relative aspect-[21/9] sm:aspect-[2.5/1] rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={imageAlt || title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600">
                        Alt Text (SEO & Accessibility)
                      </label>
                      <input
                        type="text"
                        value={imageAlt}
                        onChange={(e) => setImageAlt(e.target.value)}
                        placeholder="Describe this image for Google..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600">
                        Image Source URL
                      </label>
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Upload Dropzone (Upload Only) */}
                  <div
                    onClick={() => featuredImageInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 hover:border-emerald-500 rounded-2xl p-6 sm:p-8 text-center space-y-2 transition-all bg-gray-50/50 hover:bg-emerald-50/20 cursor-pointer group"
                  >
                    <input
                      ref={featuredImageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverUpload}
                    />
                    <div className="mx-auto w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {uploadingImage ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <UploadCloud className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">
                        {uploadingImage ? "Uploading cover photo..." : "Click to upload cover photo"}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        PNG, JPG, WebP up to 5MB • 1200×630 recommended
                      </p>
                    </div>
                  </div>

                  {/* Separate External Image URL field outside the dropzone */}
                  <div className="pt-2 border-t border-gray-100 space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Or paste image URL
                    </label>
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://images.unsplash.com/... or any direct image link"
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-emerald-500 focus:bg-white transition-all text-gray-800"
                    />
                    <p className="text-[11px] text-gray-400">Direct link to an image file (HTTPS)</p>
                  </div>
                </div>
              )}
            </div>

            {/* The Full Tiptap Editor Canvas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Article Body Editor</span>
                </span>
                <span className="text-xs text-gray-400">
                  Full WYSIWYG • Arabic & Urdu RTL • Tables • Media
                </span>
              </div>

              <TiptapEditor
                ref={tiptapRef}
                value={content}
                onChange={setContent}
                placeholder="Start writing the full story here... Use the toolbar above for headers, Islamic quotes, tables, and images."
              />
            </div>

            {/* FAQs Accordion Builder Section */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    <span>Frequently Asked Questions (FAQ Section)</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Optional FAQs rendered as an interactive accordion at the bottom of the article.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFaqs((prev) => [...prev, { question: "", answer: "" }])
                  }
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
              </div>

              {faqs.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">
                  No FAQs added yet. Click &ldquo;Add FAQ&rdquo; to add common questions and answers.
                </div>
              ) : (
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <div
                      key={i}
                      className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-2.5 relative group"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setFaqs((prev) => prev.filter((_, idx) => idx !== i))
                        }
                        className="absolute top-3 right-3 text-gray-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove FAQ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">
                          Question #{i + 1}
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFaqs((prev) =>
                              prev.map((f, idx) =>
                                idx === i ? { ...f, question: val } : f
                              )
                            );
                          }}
                          placeholder="e.g. Can women perform Umrah without a Mahram?"
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">
                          Answer
                        </label>
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFaqs((prev) =>
                              prev.map((f, idx) =>
                                idx === i ? { ...f, answer: val } : f
                              )
                            );
                          }}
                          placeholder="Provide a clear, detailed answer with rulings or guidelines..."
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none focus:border-emerald-500 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              RIGHT / SIDEBAR CONTROLS (~32%, 4 cols)
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 space-y-6">
            {/* Publishing Settings Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-b border-gray-100 pb-2">
                Publishing Details
              </h2>

              {/* Status Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Publication Status
                </label>
                <CustomSelect
                  value={status}
                  onChange={(v) => setStatus(v as "published" | "draft")}
                  options={[
                    {
                      value: "published",
                      label: "Published",
                      description: "Visible on site",
                      badge: <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />,
                    },
                    {
                      value: "draft",
                      label: "Draft",
                      description: "Hidden from public",
                      badge: <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />,
                    },
                  ]}
                />
              </div>

              {/* Category Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Category</span>
                </label>
                <CustomSelect
                  value={categorySlug}
                  onChange={setCategorySlug}
                  placeholder="Select category..."
                  options={categories.map((cat) => ({
                    value: cat.slug,
                    label: cat.name,
                  }))}
                />
              </div>

              {/* Author Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Author</span>
                </label>
                <CustomSelect
                  value={authorId}
                  onChange={setAuthorId}
                  placeholder="Select author..."
                  options={authors.map((author) => ({
                    value: author.id,
                    label: author.name,
                    icon: author.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={author.avatar} alt="" className="w-5 h-5 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                        {author.name.charAt(0).toUpperCase()}
                      </span>
                    ),
                  }))}
                />
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="flex items-center justify-between p-2 rounded-xl bg-gray-50/60 hover:bg-gray-50 cursor-pointer">
                  <span className="text-xs font-semibold text-gray-700">
                    Feature in Hero / Highlights
                  </span>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl bg-gray-50/60 hover:bg-gray-50 cursor-pointer">
                  <span className="text-xs font-semibold text-gray-700">
                    Mark as Popular Article
                  </span>
                  <input
                    type="checkbox"
                    checked={popular}
                    onChange={(e) => setPopular(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Reading Time */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  Estimated read:
                </span>
                <span className="font-bold text-gray-700">
                  {readingTime} minutes ({wordCount} words)
                </span>
              </div>
            </div>

            {/* Excerpt Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Summary Excerpt
              </h2>
              <p className="text-[11px] text-gray-400">
                Short teaser shown on blog cards and search results.
              </p>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A concise summary of what this guide teaches..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-800 outline-none focus:border-emerald-500 resize-none leading-relaxed"
              />
            </div>

            {/* Tags Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tags & Topics</span>
              </h2>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. umrah, makkah, ihram, rituals"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 outline-none focus:border-emerald-500"
              />
              {tagsInput && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tagsInput
                    .split(",")
                    .map((t: string) => t.trim())
                    .filter(Boolean)
                    .map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200"
                      >
                        #{tag}
                      </span>
                    ))}
                </div>
              )}
              <p className="text-[11px] text-gray-400">
                Separate tags with commas.
              </p>
            </div>

            {/* ── SEO Suite Card ── */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>SEO & Social Optimization</span>
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live Preview
                </span>
              </div>

              {/* SEO Title Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-gray-700">SEO Title</label>
                  <span
                    className={`font-mono text-[11px] ${
                      previewTitle.length > 60
                        ? "text-rose-600 font-bold"
                        : previewTitle.length >= 40
                        ? "text-emerald-600 font-bold"
                        : "text-gray-400"
                    }`}
                  >
                    {previewTitle.length}/60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || "SEO optimized title..."}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 outline-none focus:border-emerald-500"
                />
                {/* Progress bar */}
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      previewTitle.length > 60
                        ? "bg-rose-500"
                        : previewTitle.length >= 40
                        ? "bg-emerald-500"
                        : "bg-amber-400"
                    }`}
                    style={{
                      width: `${Math.min(100, (previewTitle.length / 60) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* SEO Description Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-gray-700">
                    Meta Description
                  </label>
                  <span
                    className={`font-mono text-[11px] ${
                      previewDesc.length > 160
                        ? "text-rose-600 font-bold"
                        : previewDesc.length >= 120
                        ? "text-emerald-600 font-bold"
                        : "text-gray-400"
                    }`}
                  >
                    {previewDesc.length}/160 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder={
                    excerpt || "A compelling meta description for Google results..."
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-800 outline-none focus:border-emerald-500 resize-none leading-relaxed"
                />
                {/* Progress bar */}
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      previewDesc.length > 160
                        ? "bg-rose-500"
                        : previewDesc.length >= 120
                        ? "bg-emerald-500"
                        : "bg-amber-400"
                    }`}
                    style={{
                      width: `${Math.min(100, (previewDesc.length / 160) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Google SERP Snippet Preview */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1.5">
                  Google Search Result Preview
                </span>
                <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 truncate">
                    <span className="font-medium text-gray-700">umrahzone.com</span>
                    <span>›</span>
                    <span>blog</span>
                    <span>›</span>
                    <span className="text-gray-400 truncate">{previewSlug}</span>
                  </div>
                  <div className="text-sm font-semibold text-blue-700 hover:underline leading-snug line-clamp-1">
                    {previewTitle}
                  </div>
                  <div className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {previewDesc}
                  </div>
                </div>
              </div>

              {/* Social OG Card Preview */}
              <div className="pt-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1.5 flex items-center gap-1">
                  <Share2 className="w-3 h-3 text-gray-400" />
                  Social Card Preview (Facebook / X)
                </span>
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs bg-gray-50">
                  {image ? (
                    <div className="relative aspect-[16/9] w-full bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] w-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                      No cover image selected
                    </div>
                  )}
                  <div className="p-3 bg-white space-y-0.5">
                    <div className="text-[10px] uppercase font-bold text-gray-400">
                      umrahzone.com
                    </div>
                    <div className="text-xs font-bold text-gray-900 line-clamp-1">
                      {previewTitle}
                    </div>
                    <div className="text-[11px] text-gray-500 line-clamp-2">
                      {previewDesc}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
