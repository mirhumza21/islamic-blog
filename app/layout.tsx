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
import {
  getCustomScripts,
  getGlobalSubscribe,
  getSiteConfig,
  getSocialLinks,
} from "@/lib/pages";
import {
  extractGoogleSiteVerification,
  getEnabledFooterHtml,
  getEnabledHeadHtml,
} from "@/lib/parseSiteScripts";
import { toRenderableImageSrc } from "@/lib/mediaUrl";
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
  const [scripts, config] = await Promise.all([
    getCustomScripts(),
    getSiteConfig(),
  ]);
  const googleVerification = extractGoogleSiteVerification(getEnabledHeadHtml(scripts));
  const effectiveFavicon = config.faviconUrl
    ? toRenderableImageSrc(config.faviconUrl)
    : "/favicon.ico";
  const name = config.name || siteConfig.name;
  const tagline = config.tagline || siteConfig.tagline;
  const description = config.description || siteConfig.description;
  const url = config.url || siteConfig.url;

  const effectiveOgLogo = config.headerLogoUrl || config.logoUrl || "";

  return {
    metadataBase: new URL(url),
    title: {
      default: `${name} | ${tagline}`,
      template: `%s | ${name}`,
    },
    description,
    applicationName: name,
    authors: [{ name }],
    creator: name,
    icons: {
      icon: [
        {
          url: effectiveFavicon,
          href: effectiveFavicon,
        },
      ],
      shortcut: [effectiveFavicon],
      apple: [effectiveFavicon],
    },
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
      url,
      siteName: name,
      title: `${name} | ${tagline}`,
      description,
      images: [
        {
          url: effectiveOgLogo
            ? toRenderableImageSrc(effectiveOgLogo)
            : "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200&q=80",
          width: 1200,
          height: 630,
          alt: config.headerLogoAlt || config.logoAlt || `${name} Logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | ${tagline}`,
      description,
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

function organizationJsonLd(sameAs: string[], siteName?: string, logo?: string, siteUrl?: string) {
  const effectiveUrl = siteUrl || siteConfig.url;
  return {
    "@type": "Organization",
    "@id": `${effectiveUrl}/#organization`,
    name: siteName || siteConfig.name,
    url: effectiveUrl,
    description: siteConfig.description,
    ...(logo ? { logo: { "@type": "ImageObject", url: logo } } : {}),
    ...(sameAs && sameAs.length ? { sameAs } : {}),
  };
}

function websiteJsonLd(siteName?: string, siteUrl?: string) {
  const effectiveUrl = siteUrl || siteConfig.url;
  return {
    "@type": "WebSite",
    "@id": `${effectiveUrl}/#website`,
    url: effectiveUrl,
    name: siteName || siteConfig.name,
    publisher: {
      "@id": `${effectiveUrl}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/search")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [subscribe, scripts, socialLinks, currentSiteConfig] = await Promise.all([
    getGlobalSubscribe(),
    getCustomScripts(),
    getSocialLinks(),
    getSiteConfig(),
  ]);
  const pathname = (await headers()).get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");
  const headHtml = isAdmin ? "" : getEnabledHeadHtml(scripts);
  const footerHtml = isAdmin ? "" : getEnabledFooterHtml(scripts);
  const faviconHref = currentSiteConfig.faviconUrl
    ? toRenderableImageSrc(currentSiteConfig.faviconUrl)
    : "/favicon.ico";

  const effectiveLogo = currentSiteConfig.headerLogoUrl || currentSiteConfig.logoUrl || "";

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} ${amiri.variable} ${greatVibes.variable} ${notoNastaliq.variable} ${reemKufi.variable} ${arefRuqaa.variable} h-full`}
    >
      <head>
        <link rel="icon" href={faviconHref} sizes="any" />
        <link rel="shortcut icon" href={faviconHref} />
        <link rel="apple-touch-icon" href={faviconHref} />
        <SiteHeadScripts html={headHtml} />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-green focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteShell
          subscribeLabel={subscribe.headerButtonLabel}
          socialLinks={socialLinks}
          headerLogoUrl={currentSiteConfig.headerLogoUrl || currentSiteConfig.logoUrl}
          headerLogoAlt={currentSiteConfig.headerLogoAlt || currentSiteConfig.logoAlt}
          footerLogoUrl={currentSiteConfig.footerLogoUrl || currentSiteConfig.headerLogoUrl || currentSiteConfig.logoUrl}
          footerLogoAlt={currentSiteConfig.footerLogoAlt || currentSiteConfig.headerLogoAlt || currentSiteConfig.logoAlt}
          logoUrl={currentSiteConfig.headerLogoUrl || currentSiteConfig.logoUrl}
          logoAlt={currentSiteConfig.headerLogoAlt || currentSiteConfig.logoAlt}
          showSiteNameWithLogo={currentSiteConfig.showSiteNameWithLogo}
          siteName={currentSiteConfig.name}
          description={currentSiteConfig.description}
        >
          {children}
        </SiteShell>
        <SiteFooterScripts html={footerHtml} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                organizationJsonLd(
                  socialLinks.map((item) => item.url),
                  currentSiteConfig.name,
                  effectiveLogo ? toRenderableImageSrc(effectiveLogo) : undefined,
                  currentSiteConfig.url
                ),
                websiteJsonLd(currentSiteConfig.name, currentSiteConfig.url),
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
