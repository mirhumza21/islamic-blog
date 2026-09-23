import { getVideoEmbedUrl } from "@/lib/videoEmbed";

export function ArticleVideoEmbed({
  url,
  title,
}: {
  url?: string;
  title?: string;
}) {
  const embed = getVideoEmbedUrl(url);
  if (!embed) return null;

  return (
    <section className="mt-12">
      {title ? (
        <h2 className="mb-4 font-serif text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
      ) : null}
      <div className="overflow-hidden rounded-[24px] border border-[#e6dfd3] bg-cream shadow-[0_12px_40px_-16px_rgba(6,59,47,0.18)]">
        <div className="aspect-video">
          <iframe
            src={embed}
            title={title || "Featured video"}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
