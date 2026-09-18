"use client";

import { useState, useEffect } from "react";
import { Save, Sparkles, Globe, Mail, Share2, CheckCircle2 } from "lucide-react";
import { siteConfig as defaultSiteConfig } from "@/data/categories";
import { FormPageSkeleton } from "@/components/admin/AdminSkeletons";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(defaultSiteConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setSettings(data.settings);
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

  const handleSocialChange = (platform: string, value: string) => {
    setSettings((prev: any) => ({
      ...prev,
      social: {
        ...(prev.social || {}),
        [platform]: value,
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
            Site Settings & Global SEO
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure metadata, brand information, and social media channels
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

        {/* Social Media Links */}
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Official Social Profiles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1.5">
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={settings.social?.instagram || ""}
                onChange={(e) => handleSocialChange("instagram", e.target.value)}
                placeholder="https://instagram.com/umrahzone"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1.5">
                YouTube Channel URL
              </label>
              <input
                type="url"
                value={settings.social?.youtube || ""}
                onChange={(e) => handleSocialChange("youtube", e.target.value)}
                placeholder="https://youtube.com/@umrahzone"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1.5">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={settings.social?.facebook || ""}
                onChange={(e) => handleSocialChange("facebook", e.target.value)}
                placeholder="https://facebook.com/umrahzone"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1.5">
                X / Twitter URL
              </label>
              <input
                type="url"
                value={settings.social?.x || ""}
                onChange={(e) => handleSocialChange("x", e.target.value)}
                placeholder="https://x.com/umrahzone"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
