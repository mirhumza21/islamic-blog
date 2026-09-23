import { normalizeBlogFaqs, type BlogFaqItem } from "@/lib/blogFaq";
import { getVideoEmbedUrl } from "@/lib/videoEmbed";
import type { ArticleBlock } from "@/types/blog";

export interface ArticleEditorMeta {
  coverImage?: string;
  coverImageAlt?: string;
  videoUrl?: string;
  videoTitle?: string;
  faqTitle?: string;
  faqDescription?: string;
  faqImage?: string;
  faqImageAlt?: string;
  faqImageTitle?: string;
  faqImageCaption?: string;
  faqImageDescription?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  schemaScript?: string;
  isLatest?: boolean;
}

export interface UnpackedArticleContent {
  html: string;
  faqs: BlogFaqItem[];
  meta: ArticleEditorMeta;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function blocksToHtml(blocks: ArticleBlock[] | string | undefined): string {
  if (!blocks) return "<p></p>";
  if (typeof blocks === "string") return blocks;
  if (!Array.isArray(blocks) || blocks.length === 0) return "<p></p>";

  if (blocks.length === 1 && (blocks[0] as { type?: string }).type === "html") {
    return (blocks[0] as { text?: string }).text || "<p></p>";
  }

  return blocks
    .map((block) => {
      switch (block.type) {
        case "html":
          return block.text;
        case "editorMeta":
        case "faq":
        case "video":
          return "";
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
        case "list": {
          const tag = block.style === "ordered" ? "ol" : "ul";
          return `<${tag}>${(block.items || [])
            .map((item) => `<li>${item}</li>`)
            .join("")}</${tag}>`;
        }
        case "image":
          return `<figure><img src="${block.src}" alt="${block.alt || ""}" />${
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
              <div class="font-bold text-sm mb-1">${block.title || "Note"}</div>
              <p class="text-sm leading-relaxed">${block.text}</p>
            </div>
          `;
        case "table":
          return `
            <table class="w-full border-collapse border border-gray-200 my-6">
              <thead><tr>${(block.headers || [])
                .map(
                  (header) =>
                    `<th class="border border-gray-200 p-2.5 bg-gray-50 font-bold">${header}</th>`
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
          return (block as { text?: string }).text
            ? `<p>${(block as { text?: string }).text}</p>`
            : "";
      }
    })
    .filter(Boolean)
    .join("\n");
}

export function unpackArticleContent(
  content: unknown,
  extras?: Record<string, unknown>
): UnpackedArticleContent {
  const meta: ArticleEditorMeta = {};
  let html = "<p></p>";
  let faqs: BlogFaqItem[] = [];

  if (typeof content === "string") {
    html = content || "<p></p>";
  } else if (Array.isArray(content)) {
    html = blocksToHtml(content as ArticleBlock[]) || "<p></p>";

    for (const block of content) {
      if (!isRecord(block)) continue;
      if (block.type === "faq") {
        faqs = normalizeBlogFaqs(block.items);
        if (!meta.faqTitle && typeof block.title === "string") meta.faqTitle = block.title;
        if (!meta.faqDescription && typeof block.description === "string") {
          meta.faqDescription = block.description;
        }
        if (!meta.faqImage && typeof block.image === "string") meta.faqImage = block.image;
        if (!meta.faqImageAlt && typeof block.imageAlt === "string") {
          meta.faqImageAlt = block.imageAlt;
        }
        if (!meta.faqImageTitle && typeof block.imageTitle === "string") {
          meta.faqImageTitle = block.imageTitle;
        }
        if (!meta.faqImageCaption && typeof block.imageCaption === "string") {
          meta.faqImageCaption = block.imageCaption;
        }
        if (!meta.faqImageDescription && typeof block.imageDescription === "string") {
          meta.faqImageDescription = block.imageDescription;
        }
      }
      if (block.type === "video") {
        if (typeof block.src === "string") meta.videoUrl = meta.videoUrl || block.src;
        if (typeof block.title === "string") meta.videoTitle = meta.videoTitle || block.title;
      }
      if (block.type === "editorMeta") {
        Object.assign(meta, block);
        delete (meta as { type?: string }).type;
      }
    }
  }

  if (extras) {
    if (typeof extras.cover_image === "string" && extras.cover_image) {
      meta.coverImage = extras.cover_image;
    }
    if (typeof extras.coverImage === "string" && extras.coverImage) {
      meta.coverImage = extras.coverImage;
    }
    if (typeof extras.cover_image_alt === "string") meta.coverImageAlt = extras.cover_image_alt;
    if (typeof extras.coverImageAlt === "string") meta.coverImageAlt = extras.coverImageAlt;
    if (typeof extras.video_url === "string") meta.videoUrl = extras.video_url;
    if (typeof extras.videoUrl === "string") meta.videoUrl = extras.videoUrl;
    if (typeof extras.video_title === "string") meta.videoTitle = extras.video_title;
    if (typeof extras.videoTitle === "string") meta.videoTitle = extras.videoTitle;
    if (typeof extras.seo_keywords === "string") meta.seoKeywords = extras.seo_keywords;
    if (typeof extras.seoKeywords === "string") meta.seoKeywords = extras.seoKeywords;
    if (typeof extras.canonical_url === "string") meta.canonicalUrl = extras.canonical_url;
    if (typeof extras.canonicalUrl === "string") meta.canonicalUrl = extras.canonicalUrl;
    if (typeof extras.canonicalLink === "string") meta.canonicalUrl = extras.canonicalLink;
    if (extras.no_index === true || extras.noIndex === true) meta.noIndex = true;
    if (typeof extras.schema_script === "string") meta.schemaScript = extras.schema_script;
    if (typeof extras.schemaScript === "string") meta.schemaScript = extras.schemaScript;
    if (Array.isArray(extras.faqs) && extras.faqs.length) {
      faqs = normalizeBlogFaqs(extras.faqs);
    }
  }

  return { html, faqs, meta };
}

export function packArticleContent(input: {
  html: string;
  faqs: BlogFaqItem[];
  meta: ArticleEditorMeta;
}): ArticleBlock[] {
  const blocks: ArticleBlock[] = [
    { type: "html", text: input.html || "<p></p>" },
  ];

  const embed = getVideoEmbedUrl(input.meta.videoUrl);
  if (embed) {
    blocks.push({
      type: "video",
      src: embed,
      title: input.meta.videoTitle || "Featured video",
    });
  }

  const faqs = normalizeBlogFaqs(input.faqs);
  if (faqs.length) {
    blocks.push({
      type: "faq",
      items: faqs,
      title: input.meta.faqTitle,
      description: input.meta.faqDescription,
      image: input.meta.faqImage,
      imageAlt: input.meta.faqImageAlt,
      imageTitle: input.meta.faqImageTitle,
      imageCaption: input.meta.faqImageCaption,
      imageDescription: input.meta.faqImageDescription,
    });
  }

  const hasMeta = Object.values(input.meta).some((value) => {
    if (typeof value === "boolean") return value;
    return Boolean(String(value || "").trim());
  });

  if (hasMeta) {
    blocks.push({
      type: "editorMeta",
      ...input.meta,
    });
  }

  return blocks;
}

export function extractEditorMeta(content: ArticleBlock[] | string | undefined): ArticleEditorMeta {
  return unpackArticleContent(content).meta;
}
