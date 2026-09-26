"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { CmsPageEditor } from "@/components/admin/CmsPageEditor";
import { defaultContactContent } from "@/lib/pages";

export default function EditContactPage() {
  return (
    <div className="space-y-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/contact-messages"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold shadow-2xs"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          View contact messages
        </Link>
      </div>
      <CmsPageEditor
        pageKey="contact"
        title="Edit Contact Page"
        description="Public contact page copy. Form submissions are stored under Contact Messages."
        viewUrl="/contact"
        defaults={defaultContactContent}
        fields={[
          { key: "eyebrow", label: "Eyebrow", type: "text" },
          { key: "headline", label: "Headline", type: "text" },
          {
            key: "subheadline",
            label: "Introduction",
            type: "textarea",
            rows: 3,
          },
          { key: "formTitle", label: "Form title", type: "text" },
          {
            key: "formText",
            label: "Form helper text",
            type: "textarea",
            rows: 2,
          },
          {
            key: "contactEmail",
            label: "Public contact email",
            type: "text",
          },
          { key: "emailTitle", label: "Email card title", type: "text" },
          {
            key: "emailText",
            label: "Email card text",
            type: "textarea",
            rows: 2,
          },
          { key: "helpTitle", label: "Help section title", type: "text" },
          { key: "noteTitle", label: "Note title", type: "text" },
          { key: "noteText", label: "Note text", type: "textarea", rows: 4 },
        ]}
      />
    </div>
  );
}
