"use client";

import { CmsPageEditor } from "@/components/admin/CmsPageEditor";
import { defaultPrivacyContent } from "@/lib/pages";

export default function EditPrivacyPage() {
  return (
    <CmsPageEditor
      pageKey="privacy"
      title="Edit Privacy Policy"
      viewUrl="/privacy"
      defaults={defaultPrivacyContent}
      fields={[
        { key: "title", label: "Page title", type: "text" },
        { key: "lastUpdated", label: "Last updated", type: "text" },
        { key: "body", label: "Policy content (HTML allowed)", type: "html", rows: 18 },
      ]}
    />
  );
}
