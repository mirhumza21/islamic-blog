"use client";

import { CmsPageEditor } from "@/components/admin/CmsPageEditor";
import { defaultTermsContent } from "@/lib/pages";

export default function EditTermsPage() {
  return (
    <CmsPageEditor
      pageKey="terms"
      title="Edit Terms of Use"
      viewUrl="/terms"
      defaults={defaultTermsContent}
      fields={[
        { key: "title", label: "Page title", type: "text" },
        { key: "lastUpdated", label: "Last updated", type: "text" },
        { key: "body", label: "Terms content (HTML allowed)", type: "html", rows: 18 },
      ]}
    />
  );
}
