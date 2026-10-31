import { normalizeBlogFaqs, type BlogFaqItem } from "@/lib/blogFaq";
import { rewriteHtmlMediaUrls } from "@/lib/mediaUrl";
import { getVideoEmbedUrl } from "@/lib/videoEmbed";
import type { ArticleBlock } from "@/types/blog";

export interface ArticleEditorMeta {
  coverImage?: string;
  coverImageAlt?: string;
  bannerDescription?: string;
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
  relatedSlugs?: string[];
  relatedTitle?: string;
  relatedDescription?: string;
}

export interface UnpackedArticleContent {
  html: string;
  faqs: BlogFaqItem[];
  meta: ArticleEditorMeta;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

const HIGHLIGHT_CARD =
  /<(div)\b(?=[^>]*(?:quran-quote-card|hadith-quote-card|dua-card|islamic-callout|data-quran|data-hadith|data-dua|data-callout))[^>]*>/gi;

function plainCardInner(inner: string): string {
  const parts = [...inner.matchAll(/<(p|div)\b([^>]*)>([\s\S]*?)<\/\1>/gi)];
  const source = parts.length
    ? parts.map((part) => ({ attrs: part[2] || "", body: part[3] || "" }))
    : [{ attrs: "", body: inner }];

  return source
    .map(({ attrs, body }) => {
      const cleaned = body
        .replace(/\sclass=(["'])[\s\S]*?\1/gi, "")
        .replace(/\sstyle=(["'])[\s\S]*?\1/gi, "")
        .trim();
      const text = cleaned.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      if (!text || /^(tip|warning|note)$/i.test(text)) return "";
      const dir = /\bdir=(["'])rtl\1/i.test(attrs) ? ' dir="rtl"' : "";
      return `<p${dir}>${cleaned}</p>`;
    })
    .join("");
}

/** Turn colored Quran, hadith, dua, and callout cards into normal paragraphs. */
export function plainHighlightCards(html: string): string {
  if (!html || !HIGHLIGHT_CARD.test(html)) return html;
  HIGHLIGHT_CARD.lastIndex = 0;

  let result = "";
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = HIGHLIGHT_CARD.exec(html))) {
    result += html.slice(last, match.index);
    const innerStart = HIGHLIGHT_CARD.lastIndex;
    const tagRe = /<\/?div\b[^>]*>/gi;
    tagRe.lastIndex = innerStart;
    let depth = 1;
    let end = -1;
    let tag: RegExpExecArray | null;
    while ((tag = tagRe.exec(html))) {
      if (tag[0].startsWith("</")) depth -= 1;
      else if (!tag[0].endsWith("/>")) depth += 1;
      if (depth === 0) {
        end = tag.index;
        HIGHLIGHT_CARD.lastIndex = tagRe.lastIndex;
        break;
      }
    }
    if (end === -1) {
      result += match[0];
      last = innerStart;
      continue;
    }
    result += plainCardInner(html.slice(innerStart, end));
    last = HIGHLIGHT_CARD.lastIndex;
  }
  return result + html.slice(last);
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
            ${
              block.arabic
                ? `<p dir="rtl">${block.arabic}</p>`
                : ""
            }
            <p>"${block.translation}"</p>
            <p>— Surah ${block.surah} (${block.ayah})</p>
          `;
        case "hadith":
          return `
            <p>"${block.text}"</p>
            <p>— ${block.source}${block.grade ? ` · Grade: ${block.grade}` : ""}</p>
          `;
        case "dua":
          return `
            <p>${block.title}</p>
            <p dir="rtl">${block.arabic}</p>
            ${block.transliteration ? `<p>${block.transliteration}</p>` : ""}
            <p>${block.translation}</p>
          `;
        case "callout":
          return `
            ${block.title ? `<p>${block.title}</p>` : ""}
            <p>${block.text}</p>
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
        for (const [key, value] of Object.entries(block)) {
          if (key === "type" || value == null) continue;
          if (key === "relatedSlugs") {
            meta.relatedSlugs = normalizeRelatedSlugs(value);
            continue;
          }
          if (typeof value === "string" && !value.trim()) continue;
          (meta as Record<string, unknown>)[key] = value;
        }
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
    if (typeof extras.schema_script === "string" && extras.schema_script.trim()) {
      meta.schemaScript = extras.schema_script.trim();
    }
    if (typeof extras.schemaScript === "string" && extras.schemaScript.trim()) {
      meta.schemaScript = extras.schemaScript.trim();
    }
    if (
      isRecord(extras.seo) &&
      typeof extras.seo.schemaScript === "string" &&
      extras.seo.schemaScript.trim()
    ) {
      meta.schemaScript = extras.seo.schemaScript.trim();
    }
    if (Array.isArray(extras.faqs) && extras.faqs.length) {
      faqs = normalizeBlogFaqs(extras.faqs);
    }
  }

  return { html: plainHighlightCards(html), faqs, meta };
}

export function packArticleContent(input: {
  html: string;
  faqs: BlogFaqItem[];
  meta: ArticleEditorMeta;
}): ArticleBlock[] {
  const blocks: ArticleBlock[] = [
    { type: "html", text: plainHighlightCards(rewriteHtmlMediaUrls(input.html || "<p></p>")) },
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
    if (Array.isArray(value)) return value.length > 0;
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

export const CONTINUE_READING_LIMIT = 4;

export function normalizeRelatedSlugs(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const slugs: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    const slug = item.trim();
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    slugs.push(slug);
    if (slugs.length >= CONTINUE_READING_LIMIT) break;
  }
  return slugs;
}

export function readRelatedSlugs(content: unknown): string[] {
  return normalizeRelatedSlugs(unpackArticleContent(content).meta.relatedSlugs);
}

export function withRelatedSlugs(content: unknown, slugs: string[]): ArticleBlock[] {
  const unpacked = unpackArticleContent(content);
  return withRelatedSection(content, {
    slugs,
    title: unpacked.meta.relatedTitle,
    description: unpacked.meta.relatedDescription,
  });
}

export function withRelatedSection(
  content: unknown,
  section: { slugs: string[]; title?: string; description?: string }
): ArticleBlock[] {
  const unpacked = unpackArticleContent(content);
  const title = section.title?.trim() || undefined;
  const description = section.description?.trim() || undefined;
  return packArticleContent({
    html: unpacked.html,
    faqs: unpacked.faqs,
    meta: {
      ...unpacked.meta,
      relatedSlugs: normalizeRelatedSlugs(section.slugs),
      relatedTitle: title,
      relatedDescription: description,
    },
  });
}
