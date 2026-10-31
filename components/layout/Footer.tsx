import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { SocialIcons } from "@/components/layout/SocialIcons";
import { siteConfig } from "@/data/categories";
import type { SocialLink } from "@/lib/socialLinks";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Blogs", href: "/blog" },
  { label: "Guides", href: "/category/umrah-guides" },
  { label: "About", href: "/about" },
];

const topics = [
  { label: "Umrah", href: "/category/umrah-guides" },
  { label: "Hajj", href: "/category/hajj" },
  { label: "Quran & Duas", href: "/category/quran-duas" },
  { label: "Travel Tips", href: "/category/travel-tips" },
  { label: "Islamic Lifestyle", href: "/category/islamic-lifestyle" },
  { label: "Real Stories", href: "/category/real-stories" },
];

const legal = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "/contact" },
];

export function Footer({
  socialLinks = [],
  logoUrl,
  logoAlt,
  showSiteNameWithLogo,
  siteName = "UmrahZone",
  description,
}: {
  socialLinks?: SocialLink[];
  logoUrl?: string;
  logoAlt?: string;
  showSiteNameWithLogo?: boolean;
  siteName?: string;
  description?: string;
}) {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-[#e6dfd3] bg-cream/80">
      <div
        className="pointer-events-none absolute inset-0 pattern-geometric-cream opacity-40"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 silhouette-mosque opacity-40" />
      <div className="container-editorial relative py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo
              logoUrl={logoUrl}
              logoAlt={logoAlt}
              showSiteNameWithLogo={showSiteNameWithLogo}
              siteName={siteName}
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {description || siteConfig.description}
            </p>
            <SocialIcons links={socialLinks} className="mt-6 flex items-center gap-2" />
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <div>
              <p className="text-sm font-semibold text-foreground">Quick Links</p>
              <ul className="mt-4 space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-green"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Topics</p>
              <ul className="mt-4 space-y-2.5">
                {topics.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-green"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Legal</p>
              <ul className="mt-4 space-y-2.5">
                {legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-green"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="text-sm font-semibold text-foreground">Stay Connected</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Read thoughtfully. Prepare calmly. Grow closer to Allah — one article at a time.
            </p>
            <blockquote className="mt-6 rounded-[22px] border border-[#e6dfd3] bg-white/70 p-4 font-serif text-lg leading-snug text-[#063b2f]">
              “The best journey is the one that brings you closer to Allah.”
            </blockquote>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteName || "UmrahZone"}. All rights reserved.</p>
          <p className="text-xs sm:text-sm">Content platform for knowledge and inspiration.</p>
        </div>
      </div>
    </footer>
  );
}
