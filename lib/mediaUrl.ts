import { absoluteUrl } from "@/lib/utils";

const STORAGE_PUBLIC = /\/storage\/v1\/object\/public\/([^?#]+)/i;

export function mediaPathFromUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value || value.startsWith("blob:")) return null;

  const storage = value.match(STORAGE_PUBLIC);
  if (storage?.[1]) {
    return `/media/${storage[1].replace(/^\/+/, "")}`;
  }

  if (value.startsWith("/media/")) {
    return value.split(/[?#]/)[0];
  }

  try {
    const url = new URL(value);
    if (url.pathname.startsWith("/media/")) return url.pathname;
  } catch {
    return null;
  }

  return null;
}

export function toPublicImageLink(raw: string): string {
  const path = mediaPathFromUrl(raw);
  if (!path) return raw.trim();
  return absoluteUrl(path);
}

export function toRenderableImageSrc(raw: string): string {
  return mediaPathFromUrl(raw) || raw.trim();
}

export function rewriteHtmlMediaUrls(html: string): string {
  return html.replace(
    /https?:\/\/[^"'\\\s>]+\/storage\/v1\/object\/public\//gi,
    "/media/"
  ).replace(
    /https?:\/\/[^"'\\\s>]+\/media\//gi,
    "/media/"
  );
}
