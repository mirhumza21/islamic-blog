/** Convert YouTube/Vimeo URLs to embed-safe iframe src */
export function getVideoEmbedUrl(url?: string | null): string | null {
  if (!url?.trim()) return null;
  const raw = url.trim();

  if (raw.includes("youtube-nocookie.com/embed") || raw.includes("player.vimeo.com/video")) {
    return raw;
  }

  const ytMatch = raw.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/
  );
  if (ytMatch) return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;

  const vimeoMatch = raw.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return null;
}
