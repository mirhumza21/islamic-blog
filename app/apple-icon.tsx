/**
 * Dynamic Apple touch icon (180x180) for UmrahZone.
 */

import { getSiteConfig } from "@/lib/pages";
import { toRenderableImageSrc } from "@/lib/mediaUrl";
import { absoluteUrl } from "@/lib/utils";
import { ImageResponse } from "next/og";

export const dynamic = "force-dynamic";
export const contentType = "image/png";
export const size = { width: 180, height: 180 };

function toAbsUrl(raw: string): string {
  const src = toRenderableImageSrc(raw.trim());
  return src.startsWith("http") ? src : absoluteUrl(src);
}

export default async function AppleIcon() {
  const config = await getSiteConfig();

  if (config.faviconUrl?.trim()) {
    try {
      const res = await fetch(toAbsUrl(config.faviconUrl), { cache: "no-store" });
      if (res.ok) {
        const ct = res.headers.get("content-type") || "image/png";
        return new Response(await res.arrayBuffer(), {
          headers: {
            "Content-Type": ct,
            "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
          },
        });
      }
    } catch {
      // fall through
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #074e3e 0%, #063b2f 50%, #03241c 100%)",
          borderRadius: "38px",
          border: "4px solid rgba(212, 175, 114, 0.45)",
        }}
      >
        <svg
          width="116"
          height="116"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 4C11 8 7 13 7 19v8h18v-8c0-6-4-11-9-15z"
            stroke="#d4af72"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M16 8.5C12.5 12 10 15.5 10 20V27h12v-7c0-4.5-2.5-8-6-11.5z"
            fill="#d4af72"
            fillOpacity="0.25"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M16 13c-2.5 2-4 4.5-4 7.5h8c0-3-1.5-5.5-4-7.5z"
            fill="#d4af72"
            fillOpacity="0.45"
            stroke="#d4af72"
            strokeWidth="1"
          />
          <circle cx="16" cy="3.5" r="1.2" fill="#d4af72" />
          <path
            d="M16 3.5v3M14.5 5.5h3"
            stroke="#d4af72"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}

