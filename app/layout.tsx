import type { Metadata } from "next";
import { headers } from "next/headers";
import {
  Amiri,
  Aref_Ruqaa,
  Cormorant_Garamond,
  Great_Vibes,
  Manrope,
  Noto_Nastaliq_Urdu,
  Reem_Kufi,
} from "next/font/google";
import { SiteFooterScripts } from "@/components/layout/SiteFooterScripts";
import { SiteHeadScripts } from "@/components/layout/SiteHeadScripts";
import { SiteShell } from "@/components/layout/SiteShell";
import { siteConfig } from "@/data/categories";
import { getCustomScripts, getGlobalSubscribe } from "@/lib/pages";
import {
  extractGoogleSiteVerification,
  getEnabledFooterHtml,
  getEnabledHeadHtml,
} from "@/lib/parseSiteScripts";
import { absoluteUrl } from "@/lib/utils";
import "./globals.css";

export const dynamic = "force-dynamic";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-noto-nastaliq",
  display: "swap",
});

const reemKufi = Reem_Kufi({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-reem-kufi",
  display: "swap",
});

const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-aref-ruqaa",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const scripts = await getCustomScripts();
  const googleVerification = extractGoogleSiteVerification(getEnabledHeadHtml(scripts));

  return {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  keywords: [
    "Umrah",
    "Hajj",
    "Islamic blog",
    "Quran",
    "Duas",
    "Islamic lifestyle",
    "Umrah guide",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
  };
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  sameAs: Object.values(siteConfig.social),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  potentialAction: {
    "@type": "SearchAction",
    target: `${absoluteUrl("/search")}?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const subscribe = await getGlobalSubscribe();
  const scripts = await getCustomScripts();
  const pathname = (await headers()).get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");
  const headHtml = isAdmin ? "" : getEnabledHeadHtml(scripts);
  const footerHtml = isAdmin ? "" : getEnabledFooterHtml(scripts);

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} ${amiri.variable} ${greatVibes.variable} ${notoNastaliq.variable} ${reemKufi.variable} ${arefRuqaa.variable} h-full`}
    >
      <head>
        <SiteHeadScripts html={headHtml} />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-green focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteShell subscribeLabel={subscribe.headerButtonLabel}>{children}</SiteShell>
        <SiteFooterScripts html={footerHtml} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd, websiteJsonLd]),
          }}
        />
      </body>
    </html>
  );
}
