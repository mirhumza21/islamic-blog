"use client";

import { CmsPageEditor } from "@/components/admin/CmsPageEditor";
import { defaultNewsletterSection } from "@/data/home-sections";

export default function EditGlobalSubscribePage() {
  return (
    <CmsPageEditor
      pageKey="global_subscribe"
      title="Edit Subscribe"
      description="Copy for the site-wide newsletter section and header Subscribe button."
      viewUrl="/#newsletter"
      backHref="/admin/global"
      backLabel="Global"
      defaults={defaultNewsletterSection}
      fields={[
        {
          key: "headerButtonLabel",
          label: "Header / menu Subscribe button",
          type: "text",
        },
        { key: "title", label: "Section title", type: "text" },
        {
          key: "description",
          label: "Section description",
          type: "textarea",
          rows: 3,
        },
        { key: "placeholder", label: "Email placeholder", type: "text" },
        { key: "buttonLabel", label: "Form button label", type: "text" },
        { key: "loadingLabel", label: "Loading label", type: "text" },
        {
          key: "successMessage",
          label: "Success message",
          type: "textarea",
          rows: 2,
        },
      ]}
    />
  );
}
