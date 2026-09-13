import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { siteConfig } from "@/data/categories";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v8h4v-8h3.1l.9-4H13V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm5.2-.9a1.1 1.1 0 1 0 1.1 1.1 1.1 1.1 0 0 0-1.1-1.1zM12 9.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M23 12.2s0-3.2-.4-4.7c-.2-.9-.9-1.6-1.8-1.8C19.3 5.2 12 5.2 12 5.2s-7.3 0-8.8.5c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.7c.2.9.9 1.6 1.8 1.8 1.5.4 8.8.4 8.8.4s7.3 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.5.4-4.7.4-4.7zM9.8 15.5v-6.6l6.2 3.3-6.2 3.3z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.922L1.942 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

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
  { label: "Contact", href: "/about#contact" },
];

const social = [
  { label: "Facebook", href: siteConfig.social.facebook, icon: FacebookIcon },
  { label: "Instagram", href: siteConfig.social.instagram, icon: InstagramIcon },
  { label: "YouTube", href: siteConfig.social.youtube, icon: YoutubeIcon },
  { label: "X", href: siteConfig.social.x, icon: XIcon },
];

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border bg-cream">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 silhouette-mosque opacity-40" />
      <div className="container-editorial relative py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {siteConfig.description}
            </p>
            <div className="mt-6 flex items-center gap-2">
              {social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-muted transition-colors hover:border-green/25 hover:text-green"
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Quick Links</h2>
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
              <h2 className="text-sm font-semibold text-foreground">Topics</h2>
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
              <h2 className="text-sm font-semibold text-foreground">Legal</h2>
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
            <h2 className="text-sm font-semibold text-foreground">Stay Connected</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Read thoughtfully. Prepare calmly. Grow closer to Allah — one article at a time.
            </p>
            <blockquote className="mt-6 rounded-2xl border border-border bg-card/70 p-4 font-serif text-lg leading-snug text-green">
              “The best journey is the one that brings you closer to Allah.”
            </blockquote>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} UmrahZone. All rights reserved.</p>
          <p className="text-xs sm:text-sm">Content platform for knowledge and inspiration.</p>
        </div>
      </div>
    </footer>
  );
}
