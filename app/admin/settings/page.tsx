"use client";

import { useState, useEffect, useRef } from "react";
import {
  Save,
  Globe,
  Share2,
  CheckCircle2,
  Code2,
  Plus,
  Trash2,
  Image as ImageIcon,
  UploadCloud,
  Loader2,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { siteConfig as defaultSiteConfig } from "@/data/categories";
import { FormPageSkeleton } from "@/components/admin/AdminSkeletons";
import { uploadClientImage } from "@/lib/uploadClientImage";
import { toRenderableImageSrc } from "@/lib/mediaUrl";
import {
  createEmptyScript,
  normalizeCustomScripts,
  type CustomScript,
} from "@/lib/customScripts";
import {
  SOCIAL_PLATFORMS,
  createSocialLink,
  nextSocialPlatform,
  normalizeSocialLinks,
  socialObjectFromLinks,
  socialPlatformLabel,
  type SocialLink,
  type SocialPlatform,
} from "@/lib/socialLinks";
import { SocialIconGlyph } from "@/components/layout/SocialIcons";

function DefaultEmblemPreview() {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#064234] to-[#042e24] shadow-xs">
        <svg
          viewBox="0 0 32 32"
          className="h-5 w-5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M16 4C11 8 7 13 7 19v8h18v-8c0-6-4-11-9-15z"
            stroke="#d4af72"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M16 9C12.5 12.5 10 16 10 20.5V27h12v-6.5C22 16 19.5 12.5 16 9z"
            fill="#d4af72"
            fillOpacity="0.2"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
          <circle cx="16" cy="18" r="1.5" fill="#d4af72" />
          <path d="M16 13v2M14 18h4" stroke="#d4af72" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-serif text-base font-bold leading-none tracking-tight">
        <span className="text-[#075846]">Umrah</span>
        <span className="text-[#b8894a]">Zone</span>
      </span>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(defaultSiteConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [uploadingHeaderLogo, setUploadingHeaderLogo] = useState(false);
  const [uploadingFooterLogo, setUploadingFooterLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingSocialIconId, setUploadingSocialIconId] = useState<string | null>(null);
  const [activeSocialUploadId, setActiveSocialUploadId] = useState<string | null>(null);

  const headerLogoInputRef = useRef<HTMLInputElement>(null);
  const footerLogoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const socialIconInputRef = useRef<HTMLInputElement>(null);

  const handleHeaderLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHeaderLogo(true);
    try {
      const res = await uploadClientImage(file);
      if (res.success && res.imageUrl) {
        handleChange("headerLogoUrl", res.imageUrl);
        handleChange("logoUrl", res.imageUrl);
      } else {
        alert(res.error || "Failed to upload header logo image");
      }
    } catch (err: any) {
      alert(err.message || "Failed to upload header logo image");
    } finally {
      setUploadingHeaderLogo(false);
      if (headerLogoInputRef.current) headerLogoInputRef.current.value = "";
    }
  };

  const handleFooterLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFooterLogo(true);
    try {
      const res = await uploadClientImage(file);
      if (res.success && res.imageUrl) {
        handleChange("footerLogoUrl", res.imageUrl);
      } else {
        alert(res.error || "Failed to upload footer logo image");
      }
    } catch (err: any) {
      alert(err.message || "Failed to upload footer logo image");
    } finally {
      setUploadingFooterLogo(false);
      if (footerLogoInputRef.current) footerLogoInputRef.current.value = "";
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFavicon(true);
    try {
      const res = await uploadClientImage(file);
      if (res.success && res.imageUrl) {
        handleChange("faviconUrl", res.imageUrl);
      } else {
        alert(res.error || "Failed to upload favicon");
      }
    } catch (err: any) {
      alert(err.message || "Failed to upload favicon");
    } finally {
      setUploadingFavicon(false);
      if (faviconInputRef.current) faviconInputRef.current.value = "";
    }
  };

  const handleSocialIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSocialUploadId) return;
    const targetId = activeSocialUploadId;
    setUploadingSocialIconId(targetId);
    try {
      const res = await uploadClientImage(file);
      if (res.success && res.imageUrl) {
        setSocialLinks(
          socialLinks.map((link) =>
            link.id === targetId ? { ...link, iconUrl: res.imageUrl } : link
          )
        );
      } else {
        alert(res.error || "Failed to upload social icon image");
      }
    } catch (err: any) {
      alert(err.message || "Failed to upload social icon image");
    } finally {
      setUploadingSocialIconId(null);
      setActiveSocialUploadId(null);
      if (socialIconInputRef.current) socialIconInputRef.current.value = "";
    }
  };

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            const socialLinks = normalizeSocialLinks(data.settings);
            const headerLogo = data.settings.headerLogoUrl || data.settings.logoUrl || "";
            const footerLogo = data.settings.footerLogoUrl || "";
            setSettings({
              ...data.settings,
              headerLogoUrl: headerLogo,
              footerLogoUrl: footerLogo,
              logoUrl: headerLogo,
              customScripts: normalizeCustomScripts(data.settings),
              socialLinks,
              social: socialObjectFromLinks(socialLinks),
            });
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  if (loading) {
    return <FormPageSkeleton titleWidth="w-72" />;
  }

  const handleChange = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const setSocialLinks = (updatedLinks: SocialLink[]) => {
    setSettings((prev: any) => ({
      ...prev,
      socialLinks: updatedLinks,
      social: socialObjectFromLinks(updatedLinks),
    }));
  };

  const socialLinks: SocialLink[] = Array.isArray(settings.socialLinks)
    ? settings.socialLinks
    : normalizeSocialLinks(settings);

  const updateScript = (id: string, patch: Partial<CustomScript>) => {
    setSettings((prev: any) => ({
      ...prev,
      customScripts: (prev.customScripts || []).map((script: CustomScript) =>
        script.id === id ? { ...script, ...patch } : script
      ),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      // Ensure headerLogoUrl and logoUrl are synced
      const payload = {
        ...settings,
        logoUrl: settings.headerLogoUrl || settings.logoUrl || "",
        logoAlt: settings.headerLogoAlt || settings.logoAlt || "",
        headerLogoUrl: settings.headerLogoUrl || settings.logoUrl || "",
        headerLogoAlt: settings.headerLogoAlt || settings.logoAlt || "",
        footerLogoUrl: settings.footerLogoUrl || "",
        footerLogoAlt: settings.footerLogoAlt || "",
        faviconUrl: settings.faviconUrl || "",
        faviconAlt: settings.faviconAlt || "",
      };

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      alert(err.message || "Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  const currentHeaderLogo = settings.headerLogoUrl || settings.logoUrl || "";
  const currentFooterLogo = settings.footerLogoUrl || "";
  const effectiveFooterLogo = currentFooterLogo || currentHeaderLogo;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
            Site Settings & Global SEO
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure metadata, Header & Footer logos, and custom social media channels
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-medium animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Settings saved!
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* General Brand Settings */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Brand & Identity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1.5">
                Site Name
              </label>
              <input
                type="text"
                value={settings.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="UmrahZone"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1.5">
                Tagline
              </label>
              <input
                type="text"
                value={settings.tagline || ""}
                onChange={(e) => handleChange("tagline", e.target.value)}
                placeholder="Knowledge Today, A Closer Tomorrow"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1.5">
              Site Meta Description (Default SEO description)
            </label>
            <textarea
              rows={3}
              value={settings.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1.5">
                Canonical Site URL
              </label>
              <input
                type="url"
                value={settings.url || ""}
                onChange={(e) => handleChange("url", e.target.value)}
                placeholder="https://umrahzone.com"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="hello@umrahzone.com"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>
        </div>

        {/* Logo & Favicon Branding Card */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Header & Footer Logos & Favicon</span>
              </div>
              <p className="mt-0.5 text-xs text-gray-500">
                Set individual logos for Header and Footer, and upload your browser tab favicon
              </p>
            </div>
            <span className="hidden sm:inline-flex text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
              Live Assets
            </span>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={headerLogoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={handleHeaderLogoUpload}
            className="hidden"
          />
          <input
            ref={footerLogoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={handleFooterLogoUpload}
            className="hidden"
          />
          <input
            ref={faviconInputRef}
            type="file"
            accept=".ico,image/x-icon,image/vnd.microsoft.icon,image/png,image/svg+xml,image/webp"
            onChange={handleFaviconUpload}
            className="hidden"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Header Logo Section */}
            <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl space-y-3.5 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-gray-900 font-semibold text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    Header Logo (Navigation Bar)
                  </label>
                  {currentHeaderLogo ? (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Custom Header Logo
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                      Default Emblem
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500">
                  Displayed in the top navigation bar, sticky header, and mobile menu drawer.
                </p>
              </div>

              {/* Live Preview Container (Header style) */}
              <div className="rounded-xl border border-gray-200 bg-[#fbf9f4] p-3.5 flex items-center justify-between min-h-[64px] shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  {currentHeaderLogo ? (
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={toRenderableImageSrc(currentHeaderLogo)}
                        alt={settings.headerLogoAlt || settings.logoAlt || settings.name || "Header Logo preview"}
                        className="h-9 w-auto max-w-[170px] object-contain shrink-0"
                      />
                      {settings.showSiteNameWithLogo && (
                        <span className="font-serif text-base font-bold text-[#075846] truncate">
                          {settings.name || "UmrahZone"}
                        </span>
                      )}
                    </div>
                  ) : (
                    <DefaultEmblemPreview />
                  )}
                </div>
                <span className="text-[10px] text-gray-400 font-medium shrink-0 ml-2">Header Preview</span>
              </div>

              {/* Upload and URL Inputs */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={uploadingHeaderLogo}
                    onClick={() => headerLogoInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-300 hover:border-emerald-600 hover:text-emerald-700 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50"
                  >
                    {uploadingHeaderLogo ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    ) : (
                      <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    <span>
                      {uploadingHeaderLogo
                        ? "Uploading..."
                        : currentHeaderLogo
                        ? "Replace Header Logo"
                        : "Upload Header Logo"}
                    </span>
                  </button>

                  {currentHeaderLogo && (
                    <button
                      type="button"
                      onClick={() => {
                        handleChange("headerLogoUrl", "");
                        handleChange("logoUrl", "");
                      }}
                      className="inline-flex items-center gap-1 px-3 py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl font-semibold transition-colors shrink-0"
                      title="Reset to default emblem"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-gray-500 text-[11px] mb-1">Or paste Header Logo image URL</label>
                  <input
                    type="text"
                    value={settings.headerLogoUrl || settings.logoUrl || ""}
                    onChange={(e) => {
                      handleChange("headerLogoUrl", e.target.value);
                      handleChange("logoUrl", e.target.value);
                    }}
                    placeholder="https://... or /media/blog-images/..."
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1 text-[11px]">
                    Header Logo Alt Text (Image Alt Text for SEO & Accessibility)
                  </label>
                  <input
                    type="text"
                    value={settings.headerLogoAlt || settings.logoAlt || ""}
                    onChange={(e) => {
                      handleChange("headerLogoAlt", e.target.value);
                      handleChange("logoAlt", e.target.value);
                    }}
                    placeholder="e.g. UmrahZone - Trusted Islamic Knowledge & Guides"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Describes the header logo for search engines and screen readers.
                  </p>
                </div>

                <label className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer pt-0.5">
                  <input
                    type="checkbox"
                    checked={!!settings.showSiteNameWithLogo}
                    onChange={(e) => handleChange("showSiteNameWithLogo", e.target.checked)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-[11px]">Show Site Name text next to custom logo</span>
                </label>

                <p className="text-[10px] text-gray-400">
                  Tip: Transparent SVG or PNG (height: 40px–80px) produces the sharpest result.
                </p>
              </div>
            </div>

            {/* Footer Logo Section */}
            <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl space-y-3.5 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-gray-900 font-semibold text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    Footer Logo (Website Footer)
                  </label>
                  {currentFooterLogo ? (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Dedicated Footer Logo
                    </span>
                  ) : currentHeaderLogo ? (
                    <span className="text-[10px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      Inheriting Header Logo
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                      Default Emblem
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500">
                  Displayed in the bottom footer section. Leave empty to automatically use the Header logo.
                </p>
              </div>

              {/* Live Preview Container (Footer style) */}
              <div className="rounded-xl border border-[#e6dfd3] bg-[#fdfbf7] p-3.5 flex items-center justify-between min-h-[64px] shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  {effectiveFooterLogo ? (
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={toRenderableImageSrc(effectiveFooterLogo)}
                        alt={settings.footerLogoAlt || settings.headerLogoAlt || settings.name || "Footer Logo preview"}
                        className="h-9 w-auto max-w-[170px] object-contain shrink-0"
                      />
                      {settings.showSiteNameWithLogo && (
                        <span className="font-serif text-base font-bold text-[#075846] truncate">
                          {settings.name || "UmrahZone"}
                        </span>
                      )}
                    </div>
                  ) : (
                    <DefaultEmblemPreview />
                  )}
                </div>
                <span className="text-[10px] text-gray-400 font-medium shrink-0 ml-2">Footer Preview</span>
              </div>

              {/* Upload and URL Inputs */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={uploadingFooterLogo}
                    onClick={() => footerLogoInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-300 hover:border-emerald-600 hover:text-emerald-700 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50"
                  >
                    {uploadingFooterLogo ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    ) : (
                      <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    <span>
                      {uploadingFooterLogo
                        ? "Uploading..."
                        : currentFooterLogo
                        ? "Replace Footer Logo"
                        : "Upload Footer Logo"}
                    </span>
                  </button>

                  {currentFooterLogo && (
                    <button
                      type="button"
                      onClick={() => handleChange("footerLogoUrl", "")}
                      className="inline-flex items-center gap-1 px-3 py-2 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl font-semibold transition-colors shrink-0"
                      title="Clear footer logo to use header logo"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Use Header</span>
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-gray-500 text-[11px] mb-1">Or paste Footer Logo image URL</label>
                  <input
                    type="text"
                    value={settings.footerLogoUrl || ""}
                    onChange={(e) => handleChange("footerLogoUrl", e.target.value)}
                    placeholder="https://... or /media/blog-images/... (or empty to use header logo)"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1 text-[11px]">
                    Footer Logo Alt Text
                  </label>
                  <input
                    type="text"
                    value={settings.footerLogoAlt || ""}
                    onChange={(e) => handleChange("footerLogoAlt", e.target.value)}
                    placeholder="e.g. UmrahZone Footer Logo (Optional - defaults to Header Logo Alt)"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Optional. If left blank, Header Logo Alt text will be used automatically.
                  </p>
                </div>

                <p className="text-[10px] text-gray-400">
                  Tip: If your footer has a dark or colored background, you can upload a specialized light/colored logo here.
                </p>
              </div>
            </div>

            {/* Site Favicon Section */}
            <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl space-y-3.5 flex flex-col justify-between lg:col-span-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-gray-900 font-semibold text-xs flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    Browser Favicon
                  </label>
                  {settings.faviconUrl ? (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Custom Favicon Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                      Default Favicon
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500">
                  Displayed in visitors’ browser tabs, bookmarks bar, and mobile home shortcuts.
                </p>
              </div>

              {/* Live Browser Tab Preview Container */}
              <div className="rounded-xl border border-gray-300 bg-slate-900 p-3 text-slate-200 shadow-inner flex flex-col gap-2">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                  Simulated Browser Tab Preview
                </span>
                <div className="flex items-center justify-between bg-slate-800 rounded-lg px-3 py-1.5 border border-slate-700 max-w-[280px]">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={settings.faviconUrl ? toRenderableImageSrc(settings.faviconUrl) : "/favicon.ico"}
                      alt={settings.faviconAlt || "Favicon"}
                      className="w-4 h-4 object-contain shrink-0 rounded-xs"
                    />
                    <span className="text-[11px] font-medium text-slate-200 truncate">
                      {settings.name || "UmrahZone"} | {settings.tagline || "Knowledge"}
                    </span>
                  </div>
                  <span className="text-slate-400 text-xs ml-2 hover:text-slate-200 cursor-default">×</span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <span className="text-[10px] text-slate-400">Favicon Preview:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center p-1 border border-white/15">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={settings.faviconUrl ? toRenderableImageSrc(settings.faviconUrl) : "/favicon.ico"}
                        alt={settings.faviconAlt ? `${settings.faviconAlt} 32px` : "Favicon 32px"}
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">32×32 px</span>
                  </div>
                </div>
              </div>

              {/* Upload and URL Inputs */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={uploadingFavicon}
                    onClick={() => faviconInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-300 hover:border-emerald-600 hover:text-emerald-700 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50"
                  >
                    {uploadingFavicon ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    ) : (
                      <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    <span>{uploadingFavicon ? "Uploading..." : settings.faviconUrl ? "Replace Favicon File" : "Upload Favicon (.ico / .png)"}</span>
                  </button>

                  {settings.faviconUrl && (
                    <button
                      type="button"
                      onClick={() => handleChange("faviconUrl", "")}
                      className="inline-flex items-center gap-1 px-3 py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl font-semibold transition-colors shrink-0"
                      title="Reset to default favicon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-gray-500 text-[11px] mb-1">Or paste Favicon URL directly</label>
                  <input
                    type="text"
                    value={settings.faviconUrl || ""}
                    onChange={(e) => handleChange("faviconUrl", e.target.value)}
                    placeholder="/favicon.ico or https://.../favicon.png"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1 text-[11px]">
                    Favicon Alt Text / Title
                  </label>
                  <input
                    type="text"
                    value={settings.faviconAlt || ""}
                    onChange={(e) => handleChange("faviconAlt", e.target.value)}
                    placeholder="e.g. UmrahZone Favicon Icon"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <p className="text-[10px] text-gray-400">
                  Tip: Square resolution (32×32, 48×48 or 64×64) in .ico, .png, or .svg format.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Icons & Channels Card */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>Social Media Icons & Channels</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                These icons show in the footer and at the end of every blog article. You can choose standard platforms or add custom channels, and manually upload custom icons for each.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const nextPlatform = nextSocialPlatform(socialLinks) || "custom";
                setSocialLinks([...socialLinks, createSocialLink(nextPlatform)]);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-800 hover:border-emerald-600 hover:text-emerald-700 shadow-2xs transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Channel
            </button>
          </div>

          {/* Hidden social icon file input */}
          <input
            ref={socialIconInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={handleSocialIconUpload}
            className="hidden"
          />

          {socialLinks.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center text-gray-500">
              No social icons yet. Click &quot;Add Channel&quot; to add Facebook, Instagram, YouTube, WhatsApp, or custom accounts.
            </p>
          ) : (
            <div className="space-y-3">
              {socialLinks.map((item) => {
                const isUploading = uploadingSocialIconId === item.id;
                const hasCustomIcon = Boolean(item.iconUrl);

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-gray-300 transition-all space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left: Icon preview and upload controls */}
                      <div className="flex items-center gap-2.5">
                        <div
                          className="h-10 w-10 shrink-0 rounded-full border border-[#e6dfd3] bg-white flex items-center justify-center p-2 shadow-2xs overflow-hidden"
                          title={item.title || socialPlatformLabel(item.platform)}
                        >
                          {item.iconUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={toRenderableImageSrc(item.iconUrl)}
                              alt={item.title || item.platform}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <SocialIconGlyph platform={item.platform} className="h-4 w-4 text-[#063b2f]" />
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            disabled={isUploading}
                            onClick={() => {
                              setActiveSocialUploadId(item.id);
                              socialIconInputRef.current?.click();
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-300 hover:border-emerald-600 hover:text-emerald-700 text-gray-700 rounded-lg text-xs font-medium transition-all shadow-2xs disabled:opacity-50"
                          >
                            {isUploading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                            ) : (
                              <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                            <span>{isUploading ? "Uploading..." : hasCustomIcon ? "Change Icon" : "Upload Icon"}</span>
                          </button>

                          {hasCustomIcon && (
                            <button
                              type="button"
                              onClick={() =>
                                setSocialLinks(
                                  socialLinks.map((link) =>
                                    link.id === item.id ? { ...link, iconUrl: "" } : link
                                  )
                                )
                              }
                              className="inline-flex items-center gap-1 px-2 py-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-medium transition-colors"
                              title="Reset to standard platform icon"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Reset Icon</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Right: Remove channel button */}
                      <button
                        type="button"
                        onClick={() => setSocialLinks(socialLinks.filter((link) => link.id !== item.id))}
                        className="inline-flex items-center justify-center gap-1 self-end sm:self-auto rounded-lg px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove Channel</span>
                      </button>
                    </div>

                    {/* Middle: Platform selector, optional channel label, and URL */}
                    <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-2.5">
                      <select
                        value={item.platform}
                        onChange={(e) =>
                          setSocialLinks(
                            socialLinks.map((link) =>
                              link.id === item.id
                                ? { ...link, platform: e.target.value as SocialPlatform }
                                : link
                            )
                          )
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      >
                        {SOCIAL_PLATFORMS.map((platform) => (
                          <option key={platform.id} value={platform.id}>
                            {platform.label}
                          </option>
                        ))}
                      </select>

                      <div className="flex flex-col sm:flex-row gap-2">
                        {item.platform === "custom" && (
                          <input
                            type="text"
                            value={item.title || ""}
                            onChange={(e) =>
                              setSocialLinks(
                                socialLinks.map((link) =>
                                  link.id === item.id ? { ...link, title: e.target.value } : link
                                )
                              )
                            }
                            placeholder="Channel Name (e.g. Threads, Discord)"
                            className="w-full sm:w-44 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                          />
                        )}

                        <input
                          type="url"
                          value={item.url}
                          onChange={(e) =>
                            setSocialLinks(
                              socialLinks.map((link) =>
                                link.id === item.id ? { ...link, url: e.target.value } : link
                              )
                            )
                          }
                          placeholder="https://..."
                          className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>
                    </div>

                    {/* Bottom: Direct Icon URL input (optional) */}
                    <div className="flex items-center gap-2 pt-0.5 text-[11px] text-gray-500">
                      <span className="shrink-0 font-medium">Icon URL (optional):</span>
                      <input
                        type="text"
                        value={item.iconUrl || ""}
                        onChange={(e) =>
                          setSocialLinks(
                            socialLinks.map((link) =>
                              link.id === item.id ? { ...link, iconUrl: e.target.value } : link
                            )
                          )
                        }
                        placeholder="Or paste icon link: https://... or /media/blog-images/..."
                        className="flex-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-gray-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Global Scripts Card */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                <Code2 className="w-4 h-4 text-emerald-600" />
                <span>Global Scripts</span>
              </div>
              <p className="mt-1 text-gray-500">
                Paste Google Analytics, Search Console, Tawk.to, or any other site-wide code.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings((prev: any) => ({
                  ...prev,
                  customScripts: [...(prev.customScripts || []), createEmptyScript("header")],
                }))
              }
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add script
            </button>
          </div>

          {(settings.customScripts || []).length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center text-gray-500">
              No scripts yet. Add a verification meta tag in the header, or a chat widget in the footer.
            </div>
          ) : (
            <div className="space-y-3">
              {(settings.customScripts as CustomScript[]).map((script, index) => (
                <div key={script.id} className="space-y-3 rounded-xl border border-gray-200 p-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block font-semibold text-gray-700">Name</label>
                      <input
                        type="text"
                        value={script.name}
                        onChange={(e) => updateScript(script.id, { name: e.target.value })}
                        placeholder={index === 0 ? "Google Search Console" : "Tawk.to"}
                        className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block font-semibold text-gray-700">Placement</label>
                      <select
                        value={script.placement}
                        onChange={(e) =>
                          updateScript(script.id, {
                            placement: e.target.value === "footer" ? "footer" : "header",
                          })
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      >
                        <option value="header">Header — Analytics, Search Console</option>
                        <option value="footer">Footer — Tawk.to, chat widgets</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <label className="inline-flex items-center gap-2 font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        checked={script.enabled}
                        onChange={(e) => updateScript(script.id, { enabled: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      Enabled
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setSettings((prev: any) => ({
                          ...prev,
                          customScripts: (prev.customScripts || []).filter(
                            (item: CustomScript) => item.id !== script.id
                          ),
                        }))
                      }
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                  <textarea
                    value={script.code}
                    onChange={(e) => updateScript(script.id, { code: e.target.value })}
                    rows={5}
                    spellCheck={false}
                    placeholder={'<meta name="google-site-verification" content="..." />\nor the Tawk.to <script> snippet'}
                    className="min-h-[110px] w-full resize-y rounded-xl border border-gray-300 bg-white p-3 font-mono text-[11px] text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
