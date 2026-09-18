"use client";

import { CmsPageEditor } from "@/components/admin/CmsPageEditor";
import { defaultContactContent } from "@/lib/pages";

export default function EditContactPage() {
  return (
    <CmsPageEditor
      pageKey="contact"
      title="Edit Contact Page"
      viewUrl="/contact"
      defaults={defaultContactContent}
      fields={[
        { key: "eyebrow", label: "Eyebrow", type: "text" },
        { key: "headline", label: "Headline", type: "text" },
        { key: "subheadline", label: "Introduction", type: "textarea", rows: 3 },
        { key: "formTitle", label: "Form title", type: "text" },
        { key: "formText", label: "Form helper text", type: "textarea", rows: 2 },
        { key: "emailTitle", label: "Email card title", type: "text" },
        { key: "emailText", label: "Email card text", type: "textarea", rows: 2 },
        { key: "helpTitle", label: "Help section title", type: "text" },
        { key: "noteTitle", label: "Note title", type: "text" },
        { key: "noteText", label: "Note text", type: "textarea", rows: 4 },
      ]}
    />
  );
}
