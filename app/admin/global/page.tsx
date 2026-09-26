"use client";

import Link from "next/link";
import {
  Mail,
  Edit,
  ExternalLink,
  Users,
  ChevronRight,
  Globe,
} from "lucide-react";

const globalSections = [
  {
    id: "subscribe",
    title: "Subscribe",
    description:
      "Edit newsletter section copy shown site-wide — title, description, button labels, and success message.",
    editUrl: "/admin/global/subscribe",
    viewUrl: "/#newsletter",
    manageUrl: "/admin/subscribers",
    manageLabel: "View subscribers",
    icon: Mail,
  },
];

export default function AdminGlobalHubPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
          Global Sections
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Shared site-wide blocks. More sections can be added here later.
        </p>
      </div>

      <div className="space-y-3">
        {globalSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-gray-900">
                      {section.title}
                    </h2>
                    <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Link
                    href={section.manageUrl}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                  >
                    <Users className="w-3.5 h-3.5" />
                    {section.manageLabel}
                  </Link>
                  <a
                    href={section.viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View
                  </a>
                  <Link
                    href={section.editUrl}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 px-5 py-6 text-center">
        <Globe className="w-5 h-5 text-gray-400 mx-auto mb-2" />
        <p className="text-xs text-gray-500">
          Additional global sections can be registered here as the site grows.
        </p>
      </div>
    </div>
  );
}
