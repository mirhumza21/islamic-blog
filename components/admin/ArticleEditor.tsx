"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Image as ImageIcon,
  FileText,
  Plus,
  Trash2,
  Eye,
  ExternalLink,
  Save,
  RefreshCw,
  UploadCloud,
  HelpCircle,
  Globe,
  Share2,
  Clock,
  User,
  Folder,
  Tag,
  Video,
  MousePointerClick,
} from "lucide-react";
import { TiptapEditor, type TiptapEditorHandle } from "./TiptapEditor";
import { toast, ToastContainer } from "./Toast";
import AdminImagePicker from "./AdminImagePicker";
import { CustomSelect } from "./CustomSelect";
import { uploadClientImage } from "@/lib/uploadClientImage";
import { uploadClientFile } from "@/lib/uploadClientFile";
import { slugify } from "@/lib/utils";
import { resolveBlogThumbnail, resolveBlogCover } from "@/lib/blogImage";
import { normalizeBlogFaqs } from "@/lib/blogFaq";
import { packArticleContent, unpackArticleContent } from "@/lib/articleEditor";
import type { Article } from "@/types/blog";

interface ArticleEditorProps {
  article?: Article;
  initialData?: any;
  isNew?: boolean;
  isEditing?: boolean;
}

export function ArticleEditor({
  article,
  initialData,
  isNew,
  isEditing,
}: ArticleEditorProps) {
  const currentArticle = article || initialData;
  const isCreation = isNew !== undefined ? isNew : !isEditing;
  const unpacked = useMemo(
    () => unpackArticleContent(currentArticle?.content, currentArticle),
    [currentArticle]
  );

  const router = useRouter();
  const tiptapRef = useRef<TiptapEditorHandle>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [title, setTitle] = useState(currentArticle?.title || "");
  const [imageUrl, setImageUrl] = useState(currentArticle?.image || "");
  const [coverImageUrl, setCoverImageUrl] = useState(
    unpacked.meta.coverImage || currentArticle?.coverImage || currentArticle?.cover_image || ""
  );
  const [imageAlt, setImageAlt] = useState(
    currentArticle?.imageAlt || currentArticle?.image_alt || ""
  );
  const [coverImageAlt, setCoverImageAlt] = useState(unpacked.meta.coverImageAlt || "");
  const [videoUrl, setVideoUrl] = useState(unpacked.meta.videoUrl || "");
  const [videoTitle, setVideoTitle] = useState(unpacked.meta.videoTitle || "");
  const [content, setContent] = useState(
    unpacked.html || "<p>Start writing your article here...</p>"
  );
  const [noIndex, setNoIndex] = useState(unpacked.meta.noIndex === true);
  const [isFeatured, setIsFeatured] = useState(Boolean(currentArticle?.featured));
  const [isLatest, setIsLatest] = useState(
    unpacked.meta.isLatest === true || Boolean(currentArticle?.popular)
  );
  const [slug, setSlug] = useState(currentArticle?.slug || "");
  const [slugTouched, setSlugTouched] = useState(!!currentArticle?.slug);
  const [category, setCategory] = useState(
    currentArticle?.categorySlug || currentArticle?.category_slug || ""
  );
  const [authorId, setAuthorId] = useState(
    currentArticle?.authorId || currentArticle?.author_id || ""
  );
  const [status, setStatus] = useState<"published" | "draft">(
    currentArticle?.status === "draft" ? "draft" : "published"
  );

  const [faqTitle, setFaqTitle] = useState(unpacked.meta.faqTitle || "");
  const [faqDescription, setFaqDescription] = useState(unpacked.meta.faqDescription || "");
  const [faqImage, setFaqImage] = useState(unpacked.meta.faqImage || "");
  const [faqImageAlt, setFaqImageAlt] = useState(unpacked.meta.faqImageAlt || "");
  const [faqImageTitle, setFaqImageTitle] = useState(unpacked.meta.faqImageTitle || "");
  const [faqImageCaption, setFaqImageCaption] = useState(unpacked.meta.faqImageCaption || "");
  const [faqImageDescription, setFaqImageDescription] = useState(
    unpacked.meta.faqImageDescription || ""
  );
  const [faqs, setFaqs] = useState(normalizeBlogFaqs(unpacked.faqs));

  const [seoTitle, setSeoTitle] = useState(
    currentArticle?.seo?.title || currentArticle?.seo_title || ""
  );
  const [seoDescription, setSeoDescription] = useState(
    currentArticle?.seo?.description ||
      currentArticle?.seo_description ||
      currentArticle?.excerpt ||
      ""
  );
  const [seoKeywords, setSeoKeywords] = useState<string>(
    unpacked.meta.seoKeywords ||
      (Array.isArray(currentArticle?.tags) ? currentArticle.tags.join(", ") : "")
  );
  const [canonicalUrl, setCanonicalUrl] = useState(unpacked.meta.canonicalUrl || "");
  const [schemaScript, setSchemaScript] = useState(unpacked.meta.schemaScript || "");

  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [authors, setAuthors] = useState<{ id: string; name: string; avatar?: string }[]>([]);
  const [filesList, setFilesList] = useState<{ name: string; url: string }[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [btnText, setBtnText] = useState("Download Guide");
  const [btnLink, setBtnLink] = useState("");
  const [btnStyle, setBtnStyle] = useState("gold");
  const [modalMounted, setModalMounted] = useState(false);

  useEffect(() => setModalMounted(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("global_uploaded_files");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) setFilesList(parsed);
    } catch {
      /* ignore */
    }
  }, []);

  const saveFiles = (
    next:
      | { name: string; url: string }[]
      | ((prev: { name: string; url: string }[]) => { name: string; url: string }[])
  ) => {
    setFilesList((prev) => {
      const updated = typeof next === "function" ? next(prev) : next;
      if (typeof window !== "undefined") {
        localStorage.setItem("global_uploaded_files", JSON.stringify(updated));
      }
      return updated;
    });
  };

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.categories || [];
        if (Array.isArray(list) && list.length > 0) {
          setCategories(list.map((cat: any) => ({ slug: cat.slug, name: cat.name })));
          if (!category && list[0]?.slug) setCategory(list[0].slug);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const thumbnailPreview = resolveBlogThumbnail(imageUrl, coverImageUrl);
  const coverPreview = resolveBlogCover(imageUrl, coverImageUrl);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      const result = await uploadClientFile(file);
      if (result.success && result.fileUrl) {
        saveFiles((prev) =>
          prev.some((f) => f.url === result.fileUrl)
            ? prev
            : [...prev, { name: file.name, url: result.fileUrl! }]
        );
        toast.success("File uploaded to your library.");
      } else {
        toast.error(result.error || "Failed to upload file");
      }
    } catch {
      toast.error("Failed to upload file");
    } finally {
      setUploadingFile(false);
      e.target.value = "";
    }
  };

  const insertButtonHtml = (text: string, link: string, style: string) => {
    const variant = style === "gold" || style === "outline" ? style : "emerald";
    const variantStyles: Record<string, string> = {
      gold: "background-color: #C59D5F; color: #050505; border: none; box-shadow: 0 4px 6px rgba(0,0,0,0.05);",
      emerald:
        "background-color: #15803D; color: #ffffff; border: none; box-shadow: 0 4px 6px rgba(0,0,0,0.05);",
      outline: "background-color: transparent; color: #C59D5F; border: 1px solid #C59D5F;",
    };
    const baseStyle =
      "display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 54px; padding: 18px 42px; font-size: 12px; font-weight: 700; letter-spacing: 0.04em; border-radius: 8px; text-decoration: none; margin: 0; cursor: pointer;";
    const html = `<div class="blog-cta-row"><a href="${link}" class="blog-cta-button blog-cta-button--${variant}" contenteditable="false" style="${baseStyle} ${variantStyles[variant]}">${text}</a></div>`;
    if (tiptapRef.current) tiptapRef.current.insertHTML(html);
    else setContent((prev) => prev + " " + html);
  };

  const handleInsertFromModal = () => {
    if (!btnText || !btnLink) {
      toast.error("Add a button label and choose a file or link first.");
      return;
    }
    insertButtonHtml(btnText, btnLink, btnStyle);
    setBtnText("Download Guide");
    setBtnLink("");
    setBtnStyle("gold");
    setIsModalOpen(false);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isCover = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (isCover) setUploadingCover(true);
    else setUploadingImage(true);
    const localPreview = URL.createObjectURL(file);
    if (isCover) setCoverImageUrl(localPreview);
    else setImageUrl(localPreview);
    try {
      const result = await uploadClientImage(file);
      if (result.success && result.imageUrl) {
        if (isCover) setCoverImageUrl(result.imageUrl);
        else setImageUrl(result.imageUrl);
        toast.success(isCover ? "Cover image uploaded." : "Thumbnail uploaded.");
      } else {
        if (isCover) setCoverImageUrl(unpacked.meta.coverImage || "");
        else setImageUrl(currentArticle?.image || "");
        toast.error(result.error || "Failed to upload image");
      }
    } catch {
      if (isCover) setCoverImageUrl(unpacked.meta.coverImage || "");
      else setImageUrl(currentArticle?.image || "");
      toast.error("Failed to upload image");
    } finally {
      window.setTimeout(() => URL.revokeObjectURL(localPreview), 0);
      if (isCover) setUploadingCover(false);
      else setUploadingImage(false);
      e.target.value = "";
    }
  };

  const wordCount = useMemo(() => {
    const text = content.replace(/<[^>]*>/g, " ").trim();
    return text ? text.split(/\s+/).length : 0;
  }, [content]);
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const previewTitle = seoTitle.trim() || title.trim() || "Article Title";
  const previewDesc =
    seoDescription.trim() ||
    "Add a meta description to optimize how this article appears in search engines.";
  const previewSlug = slug.trim() || "article-url-slug";

  const handleSave = async (publishStatus?: "published" | "draft") => {
    const finalStatus = publishStatus || status;
    if (imageUrl.startsWith("blob:") || coverImageUrl.startsWith("blob:")) {
      toast.error("Please wait for the image upload to finish before saving.");
      return;
    }
    if (!title.trim()) {
      toast.error("Post title is required.");
      return;
    }
    if (!category) {
      toast.error("Please select a category.");
      return;
    }
    if (!authorId) {
      toast.error("Please select an author.");
      return;
    }

    setIsSubmitting(true);
    if (publishStatus) setStatus(publishStatus);

    const tags = seoKeywords
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);
    const packed = packArticleContent({
      html: content,
      faqs,
      meta: {
        coverImage: coverImageUrl,
        coverImageAlt,
        videoUrl,
        videoTitle,
        faqTitle,
        faqDescription,
        faqImage,
        faqImageAlt,
        faqImageTitle,
        faqImageCaption,
        faqImageDescription,
        seoKeywords,
        canonicalUrl,
        noIndex,
        schemaScript,
        isLatest,
      },
    });

    const payload = {
      title: title.trim(),
      slug: slugify(slug) || slugify(title),
      excerpt: seoDescription.trim() || title.trim(),
      category_slug: category,
      author_id: authorId,
      image: imageUrl || coverImageUrl,
      image_alt: imageAlt || title,
      featured: isFeatured,
      popular: isLatest,
      status: finalStatus,
      reading_time: readingTime,
      tags,
      content: packed,
      seo_title: seoTitle || undefined,
      seo_description: seoDescription || undefined,
    };

    try {
      const url = isCreation
        ? "/api/admin/articles"
        : `/api/admin/articles/${currentArticle?.id}`;
      const res = await fetch(url, {
        method: isCreation ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        toast.error(data.error || "Failed to save post");
        return;
      }
      toast.success(
        finalStatus === "draft"
          ? "Draft saved."
          : noIndex
            ? "Saved. This post is set to noindex."
            : isCreation
              ? "Article published!"
              : "Changes saved successfully."
      );
      const nextId = data.article?.id || currentArticle?.id;
      setTimeout(() => {
        if (isCreation && nextId) router.push(`/admin/articles/${nextId}/edit`);
        else router.refresh();
      }, 400);
    } catch (err: any) {
      toast.error(err.message || "Failed to save post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <ToastContainer />

      {/* Sticky top bar — flush under AdminTopNav */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/admin/articles"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-all shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Articles</span>
            </Link>

            <div className="h-4 w-px bg-gray-200 hidden xl:block shrink-0" />

            <div className="min-w-0 hidden xl:block">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                  {isCreation ? "New Post" : "Editing"}
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
              <h1 className="text-sm font-bold text-gray-900 truncate max-w-[280px] leading-tight mt-0.5">
                {title || (
                  <span className="text-gray-400 italic font-normal">Untitled Article</span>
                )}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isCreation && currentArticle?.slug ? (
              <Link
                href={`/blog/${currentArticle.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">View Live</span>
                <ExternalLink className="w-3 h-3 hidden sm:block" />
              </Link>
            ) : null}

            <button
              type="button"
              onClick={() => handleSave("draft")}
              disabled={isSubmitting || uploadingImage || uploadingCover}
              className="px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-all disabled:opacity-50"
            >
              Save Draft
            </button>

            <button
              type="button"
              onClick={() => handleSave("published")}
              disabled={isSubmitting || uploadingImage || uploadingCover}
              className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>
                {isSubmitting
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT — main canvas */}
          <div className="lg:col-span-8 space-y-6">
            {/* Title + slug */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
                placeholder="Enter a compelling article title..."
                className="w-full font-serif text-2xl sm:text-3xl font-bold text-gray-900 placeholder:text-gray-300 outline-none border-none bg-transparent"
              />
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-xs">
                <span className="text-gray-400 font-mono">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
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
                  className="px-2.5 py-1 text-[11px] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Auto
                </button>
              </div>
            </div>

            {/* Thumbnail + Cover */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Article Images</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ImageCard
                  label="Thumbnail (Cards)"
                  hint="Shown on blog cards · autofits 4:3"
                  recommended="Recommended: 1200 × 900 px (4:3)"
                  url={imageUrl}
                  preview={thumbnailPreview}
                  alt={imageAlt}
                  uploading={uploadingImage}
                  inputRef={thumbnailInputRef}
                  aspect="aspect-[4/3]"
                  onRemove={() => setImageUrl("")}
                  onAlt={setImageAlt}
                  onUrl={setImageUrl}
                  onUpload={(e) => handleImageUpload(e, false)}
                />
                <ImageCard
                  label="Cover (Detail Page)"
                  hint="Top banner on article page · wide frame"
                  recommended="Recommended: 1680 × 720 px (21:9) · OG 1200 × 630"
                  url={coverImageUrl}
                  preview={coverPreview}
                  alt={coverImageAlt}
                  uploading={uploadingCover}
                  inputRef={coverInputRef}
                  aspect="aspect-[21/9]"
                  onRemove={() => setCoverImageUrl("")}
                  onAlt={setCoverImageAlt}
                  onUrl={setCoverImageUrl}
                  onUpload={(e) => handleImageUpload(e, true)}
                />
              </div>
            </div>

            {/* Tiptap body */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Article Body Editor
                </span>
                <span className="text-xs text-gray-400">
                  Arabic / Urdu RTL · Tables · Button · Media
                </span>
              </div>
              <TiptapEditor
                ref={tiptapRef}
                value={content}
                onChange={setContent}
                onCreateButton={() => setIsModalOpen(true)}
                placeholder="Start writing the full story here..."
              />
            </div>

            {/* PDF / File library */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                <MousePointerClick className="w-4 h-4 text-emerald-600" />
                PDF / File Library
              </div>
              <p className="text-xs text-gray-400">
                Upload files here, then use the Button toolbar control to insert a CTA at the cursor.
              </p>
              <label
                className={`flex items-center justify-center gap-2 w-full px-4 py-4 border-2 border-dashed border-emerald-200 bg-emerald-50/40 rounded-xl text-xs font-bold uppercase tracking-widest ${
                  uploadingFile
                    ? "opacity-60 pointer-events-none"
                    : "cursor-pointer hover:bg-emerald-50"
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>{uploadingFile ? "Uploading…" : "Upload PDF / File"}</span>
                <input
                  type="file"
                  accept=".pdf,application/pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                  className="hidden"
                />
              </label>
              {filesList.length > 0 ? (
                <div className="space-y-2">
                  {filesList.map((f, index) => (
                    <div
                      key={`${f.url}-${index}`}
                      className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                    >
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold truncate hover:text-emerald-700"
                      >
                        {f.name}
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          saveFiles((prev) => prev.filter((_, idx) => idx !== index))
                        }
                        className="text-gray-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-2">No files uploaded yet.</p>
              )}
            </div>

            {/* Video */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                <Video className="w-4 h-4 text-emerald-600" />
                Featured Video (Optional)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-600">Video URL</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-600">Section Title</label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Watch: Complete Umrah Guide"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    FAQ Section (Optional)
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Shown as an accordion at the bottom of the article.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFaqs((prev) => [...prev, { question: "", answer: "" }])}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add FAQ
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-600">Section Title</label>
                  <input
                    type="text"
                    value={faqTitle}
                    onChange={(e) => setFaqTitle(e.target.value)}
                    className={inputClass}
                    placeholder="Optional title"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-600">Description</label>
                  <input
                    type="text"
                    value={faqDescription}
                    onChange={(e) => setFaqDescription(e.target.value)}
                    className={inputClass}
                    placeholder="Optional short intro"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-600">FAQ Image (Optional)</label>
                <AdminImagePicker
                  value={faqImage}
                  onChange={setFaqImage}
                  aspectRatio="1.4"
                  recommendedSize="800×570 (≈1.4:1)"
                  previewContainerClassName="max-w-[280px]"
                />
                {faqImage ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <input
                      type="text"
                      value={faqImageAlt}
                      onChange={(e) => setFaqImageAlt(e.target.value)}
                      placeholder="Alt text"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={faqImageTitle}
                      onChange={(e) => setFaqImageTitle(e.target.value)}
                      placeholder="Image title"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={faqImageCaption}
                      onChange={(e) => setFaqImageCaption(e.target.value)}
                      placeholder="Caption"
                      className={`${inputClass} md:col-span-2`}
                    />
                    <textarea
                      value={faqImageDescription}
                      onChange={(e) => setFaqImageDescription(e.target.value)}
                      rows={2}
                      placeholder="Longer description"
                      className={`${inputClass} md:col-span-2 resize-none`}
                    />
                  </div>
                ) : null}
              </div>

              {faqs.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">
                  No FAQs yet. Click “Add FAQ” to create questions.
                </div>
              ) : (
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <div
                      key={i}
                      className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-2.5 relative"
                    >
                      <button
                        type="button"
                        onClick={() => setFaqs((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-3 right-3 text-gray-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <label className="text-[11px] font-bold text-gray-700">
                        Question #{i + 1}
                      </label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) =>
                          setFaqs((prev) =>
                            prev.map((item, idx) =>
                              idx === i ? { ...item, question: e.target.value } : item
                            )
                          )
                        }
                        placeholder="Question"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-emerald-500"
                      />
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) =>
                          setFaqs((prev) =>
                            prev.map((item, idx) =>
                              idx === i ? { ...item, answer: e.target.value } : item
                            )
                          )
                        }
                        placeholder="Answer"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-emerald-500 resize-none"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-b border-gray-100 pb-2">
                Publishing Details
              </h2>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Publication Status</label>
                <CustomSelect
                  value={status}
                  onChange={(v) => setStatus(v as "published" | "draft")}
                  options={[
                    {
                      value: "published",
                      label: "Published",
                      description: "Visible on site",
                      badge: (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      ),
                    },
                    {
                      value: "draft",
                      label: "Draft",
                      description: "Hidden from public",
                      badge: (
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                      ),
                    },
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-emerald-600" />
                  Category
                </label>
                <CustomSelect
                  value={category}
                  onChange={setCategory}
                  placeholder="Select category..."
                  options={categories.map((cat) => ({
                    value: cat.slug,
                    label: cat.name,
                  }))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  Author
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
                      <img
                        src={author.avatar}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                        {author.name.charAt(0).toUpperCase()}
                      </span>
                    ),
                  }))}
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="flex items-center justify-between p-2 rounded-xl bg-gray-50/60 hover:bg-gray-50 cursor-pointer">
                  <span className="text-xs font-semibold text-gray-700">
                    Feature in Hero / Highlights
                  </span>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                </label>
                <label className="flex items-center justify-between p-2 rounded-xl bg-gray-50/60 hover:bg-gray-50 cursor-pointer">
                  <span className="text-xs font-semibold text-gray-700">
                    Mark as Latest / Popular
                  </span>
                  <input
                    type="checkbox"
                    checked={isLatest}
                    onChange={(e) => setIsLatest(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  Estimated read:
                </span>
                <span className="font-bold text-gray-700">
                  {readingTime} min ({wordCount} words)
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                Tags & Keywords
              </h2>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="umrah, makkah, ihram"
                className={inputClass}
              />
              {seoKeywords ? (
                <div className="flex flex-wrap gap-1.5">
                  {seoKeywords
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
              ) : null}
            </div>

            {/* SEO */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  SEO & Social
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live Preview
                </span>
              </div>

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
                    {previewTitle.length}/60
                  </span>
                </div>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || "SEO optimized title..."}
                  className={inputClass}
                />
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      previewTitle.length > 60
                        ? "bg-rose-500"
                        : previewTitle.length >= 40
                          ? "bg-emerald-500"
                          : "bg-amber-400"
                    }`}
                    style={{ width: `${Math.min(100, (previewTitle.length / 60) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-gray-700">Meta Description</label>
                  <span
                    className={`font-mono text-[11px] ${
                      previewDesc.length > 160
                        ? "text-rose-600 font-bold"
                        : previewDesc.length >= 120
                          ? "text-emerald-600 font-bold"
                          : "text-gray-400"
                    }`}
                  >
                    {previewDesc.length}/160
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Compelling meta description for Google..."
                  className={`${inputClass} resize-none leading-relaxed`}
                />
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      previewDesc.length > 160
                        ? "bg-rose-500"
                        : previewDesc.length >= 120
                          ? "bg-emerald-500"
                          : "bg-amber-400"
                    }`}
                    style={{ width: `${Math.min(100, (previewDesc.length / 160) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Canonical URL</label>
                <input
                  type="text"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="Leave empty for default /blog/slug"
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Search indexing</label>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden w-full">
                  <button
                    type="button"
                    onClick={() => setNoIndex(false)}
                    className={`flex-1 px-3 py-2 text-[11px] font-bold uppercase tracking-wider ${
                      !noIndex
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    Index
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoIndex(true)}
                    className={`flex-1 px-3 py-2 text-[11px] font-bold uppercase tracking-wider ${
                      noIndex
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    Noindex
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Custom JSON-LD Schema</label>
                <textarea
                  rows={3}
                  value={schemaScript}
                  onChange={(e) => setSchemaScript(e.target.value)}
                  placeholder='{"@context":"https://schema.org",...}'
                  className={`${inputClass} font-mono resize-none`}
                />
              </div>

              {/* SERP preview */}
              <div className="pt-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1.5">
                  Google Preview
                </span>
                <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 truncate">
                    <span className="font-medium text-gray-700">umrahzone.com</span>
                    <span>›</span>
                    <span>blog</span>
                    <span>›</span>
                    <span className="text-gray-400 truncate">{previewSlug}</span>
                  </div>
                  <div className="text-sm font-semibold text-blue-700 leading-snug line-clamp-1">
                    {previewTitle}
                  </div>
                  <div className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {previewDesc}
                  </div>
                </div>
              </div>

              {/* Social preview */}
              <div className="pt-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 flex items-center gap-1">
                  <Share2 className="w-3 h-3" />
                  Social Card
                </span>
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                  {coverPreview || imageUrl ? (
                    <div className="relative aspect-[16/9] w-full bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverPreview || imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] w-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                      No cover image
                    </div>
                  )}
                  <div className="p-3 bg-white space-y-0.5">
                    <div className="text-[10px] uppercase font-bold text-gray-400">
                      umrahzone.com
                    </div>
                    <div className="text-xs font-bold text-gray-900 line-clamp-1">
                      {previewTitle}
                    </div>
                    <div className="text-[11px] text-gray-500 line-clamp-2">{previewDesc}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Button insert modal */}
      {isModalOpen && modalMounted
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
              <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl w-full max-w-2xl p-6 sm:p-8 space-y-5 relative max-h-[90vh] overflow-y-auto">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400"
                >
                  ✕
                </button>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Insert a Button</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Attach a PDF/file or paste a link, choose a style, insert at cursor.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-600">Button Label</label>
                  <input
                    type="text"
                    value={btnText}
                    onChange={(e) => setBtnText(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-600">
                      Select Uploaded File
                    </label>
                    <select
                      value={filesList.some((f) => f.url === btnLink) ? btnLink : ""}
                      onChange={(e) => setBtnLink(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select a file…</option>
                      {filesList.map((f, i) => (
                        <option key={i} value={f.url}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-600">Or Paste Link</label>
                    <input
                      type="text"
                      value={btnLink}
                      onChange={(e) => setBtnLink(e.target.value)}
                      placeholder="https://…"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-600">Style</label>
                    <select
                      value={btnStyle}
                      onChange={(e) => setBtnStyle(e.target.value)}
                      className={inputClass}
                    >
                      <option value="gold">Luxury Gold</option>
                      <option value="outline">Outline Gold</option>
                      <option value="emerald">Emerald Green</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-600">Preview</label>
                    <div className="flex items-center justify-center p-4 border border-gray-200 rounded-xl bg-gray-50 min-h-[64px]">
                      <span
                        style={{
                          display: "inline-flex",
                          padding: "10px 24px",
                          backgroundColor:
                            btnStyle === "gold"
                              ? "#C59D5F"
                              : btnStyle === "emerald"
                                ? "#15803D"
                                : "transparent",
                          color:
                            btnStyle === "gold"
                              ? "#050505"
                              : btnStyle === "emerald"
                                ? "#ffffff"
                                : "#C59D5F",
                          border: btnStyle === "outline" ? "1px solid #C59D5F" : "none",
                          fontSize: "11px",
                          fontWeight: 700,
                          letterSpacing: "0.15em",
                          borderRadius: "6px",
                        }}
                      >
                        {btnText || "Button Name"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleInsertFromModal}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Insert Button
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

const inputClass =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 outline-none focus:border-emerald-500 focus:bg-white transition-all";

function ImageCard({
  label,
  hint,
  recommended,
  url,
  preview,
  alt,
  uploading,
  inputRef,
  aspect,
  onRemove,
  onAlt,
  onUrl,
  onUpload,
}: {
  label: string;
  hint: string;
  recommended: string;
  url: string;
  preview: string;
  alt: string;
  uploading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  aspect: string;
  onRemove: () => void;
  onAlt: (v: string) => void;
  onUrl: (v: string) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-gray-700">{label}</span>
        {url ? (
          <button
            type="button"
            onClick={onRemove}
            className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold"
          >
            Remove
          </button>
        ) : null}
      </div>
      {url ? (
        <div className={`relative w-full ${aspect} rounded-xl overflow-hidden border border-gray-200 bg-gray-50`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview || url} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => !uploading && inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className={`border-2 border-dashed border-gray-200 hover:border-emerald-500 rounded-xl p-5 text-center space-y-2 transition-all bg-gray-50/50 hover:bg-emerald-50/20 cursor-pointer ${
            uploading ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          <div className="mx-auto w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            {uploading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <UploadCloud className="w-4 h-4" />
            )}
          </div>
          <p className="text-xs font-bold text-gray-800">
            {uploading ? "Uploading..." : "Click to upload"}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onUpload}
            disabled={uploading}
          />
        </div>
      )}
      <p className="text-[10px] font-semibold text-emerald-700">{recommended}</p>
      <p className="text-[10px] text-gray-400">{hint}</p>
      <input
        type="text"
        value={alt}
        onChange={(e) => onAlt(e.target.value)}
        placeholder="Alt text (SEO)"
        className={inputClass}
      />
      <input
        type="url"
        value={url.startsWith("blob:") ? "" : url}
        onChange={(e) => onUrl(e.target.value)}
        placeholder="Or paste image URL"
        className={inputClass}
      />
    </div>
  );
}
