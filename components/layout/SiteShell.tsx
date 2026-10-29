"use client";

import { usePathname } from "next/navigation";
import type { SocialLink } from "@/lib/socialLinks";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteShell({
  children,
  subscribeLabel,
  socialLinks,
}: {
  children: React.ReactNode;
  subscribeLabel?: string;
  socialLinks?: SocialLink[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="flex-1 w-full min-h-screen bg-slate-950 text-slate-100">{children}</main>;
  }

  return (
    <>
      <Header subscribeLabel={subscribeLabel} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer socialLinks={socialLinks} />
    </>
  );
}
