"use client";

import { usePathname } from "next/navigation";
import type { SocialLink } from "@/lib/socialLinks";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteShell({
  children,
  subscribeLabel,
  socialLinks,
  headerLogoUrl,
  headerLogoAlt,
  footerLogoUrl,
  footerLogoAlt,
  logoUrl,
  logoAlt,
  showSiteNameWithLogo,
  siteName,
  description,
}: {
  children: React.ReactNode;
  subscribeLabel?: string;
  socialLinks?: SocialLink[];
  headerLogoUrl?: string;
  headerLogoAlt?: string;
  footerLogoUrl?: string;
  footerLogoAlt?: string;
  logoUrl?: string;
  logoAlt?: string;
  showSiteNameWithLogo?: boolean;
  siteName?: string;
  description?: string;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="flex-1 w-full min-h-screen bg-slate-950 text-slate-100">{children}</main>;
  }

  const effectiveHeaderLogo = headerLogoUrl || logoUrl;
  const effectiveHeaderLogoAlt = headerLogoAlt || logoAlt || (siteName ? `${siteName} Logo` : undefined);
  const effectiveFooterLogo = footerLogoUrl || effectiveHeaderLogo;
  const effectiveFooterLogoAlt = footerLogoAlt || effectiveHeaderLogoAlt;

  return (
    <>
      <Header
        subscribeLabel={subscribeLabel}
        logoUrl={effectiveHeaderLogo}
        logoAlt={effectiveHeaderLogoAlt}
        showSiteNameWithLogo={showSiteNameWithLogo}
        siteName={siteName}
      />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer
        socialLinks={socialLinks}
        logoUrl={effectiveFooterLogo}
        logoAlt={effectiveFooterLogoAlt}
        showSiteNameWithLogo={showSiteNameWithLogo}
        siteName={siteName}
        description={description}
      />
    </>
  );
}
