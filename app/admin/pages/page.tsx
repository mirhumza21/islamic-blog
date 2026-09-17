"use client";

import Link from "next/link";
import {
  Layers,
  Home,
  ExternalLink,
  Edit,
  Sparkles,
  FileText,
  ShieldCheck,
  Phone,
  BookOpen,
  Info,
  CheckCircle2,
  Lock,
} from "lucide-react";

interface SitePage {
  id: string;
  title: string;
  slug: string;
  type: string;
  description: string;
  isEditable: boolean;
  editUrl?: string;
  viewUrl: string;
  icon: any;
}

const sitePages: SitePage[] = [
  {
    id: "home",
    title: "Home Page",
    slug: "/",
    type: "Core Landing",
    description:
      "Primary landing page including hero headlines, call-to-action buttons, hero cover photo, Quranic verse, and trust features.",
    isEditable: true,
    editUrl: "/admin/pages/home",
    viewUrl: "/",
    icon: Home,
  },
  {
    id: "about",
    title: "About Us",
    slug: "/about",
    type: "Editorial Info",
    description:
      "Mission statement, scholarly values, team background, and authentic knowledge pillars.",
    isEditable: false,
    viewUrl: "/about",
    icon: Info,
  },
  {
    id: "contact",
    title: "Contact",
    slug: "/contact",
    type: "Inquiries",
    description:
      "Get in touch form, office details, social handles, and reader support information.",
    isEditable: false,
    viewUrl: "/contact",
    icon: Phone,
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    slug: "/privacy",
    type: "Legal Policy",
    description:
      "Data handling, cookies, user analytics, and privacy compliance guidelines.",
    isEditable: false,
    viewUrl: "/privacy",
    icon: ShieldCheck,
  },
  {
    id: "terms",
    title: "Terms of Service",
    slug: "/terms",
    type: "Legal Policy",
    description:
      "Usage rights, copyright conditions, and editorial disclaimers for content readers.",
    isEditable: false,
    viewUrl: "/terms",
    icon: FileText,
  },
  {
    id: "blog",
    title: "Blog Archive",
    slug: "/blog",
    type: "Dynamic Feed",
    description:
      "Comprehensive article library with search, category filtering, and pagination.",
    isEditable: false,
    viewUrl: "/blog",
    icon: BookOpen,
  },
];

export default function AdminPagesPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
            Pages Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage, customize, and edit website pages and core sections
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/pages/home"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Home Page</span>
          </Link>
        </div>
      </div>

      {/* Featured Card for Home Page */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-100 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Customizer Active</span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight">
              Home Page Customizer
            </h2>
            <p className="text-emerald-100/80 text-xs leading-relaxed">
              Update the hero titles, call-to-action buttons, high-resolution hero
              cover photo, Quranic ayat quote, and trust badges in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin/pages/home"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Home Page Content</span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-900/40 hover:bg-emerald-900/60 border border-white/20 text-white rounded-xl text-xs font-semibold transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live</span>
            </a>
          </div>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-gray-900">
              All Website Pages ({sitePages.length})
            </span>
          </div>
          <span className="text-[11px] text-gray-500 font-medium">
            1 Editable via Customizer • 5 Static Core Pages
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                <th className="py-3 px-4">Page Title & Path</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {sitePages.map((page) => {
                const Icon = page.icon;
                return (
                  <tr
                    key={page.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl ${
                            page.isEditable
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {page.title}
                          </p>
                          <p className="text-[11px] text-gray-400 font-mono">
                            {page.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-[11px] font-medium text-gray-700">
                        {page.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-md text-gray-600 text-xs leading-relaxed">
                      {page.description}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {page.isEditable ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Customizer Ready</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          <Lock className="w-3 h-3 text-gray-400" />
                          <span>Built-in Static</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        {page.isEditable && page.editUrl ? (
                          <Link
                            href={page.editUrl}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Page</span>
                          </Link>
                        ) : null}

                        <a
                          href={page.viewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Preview Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
