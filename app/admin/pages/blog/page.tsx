"use client";

import { CmsPageEditor } from "@/components/admin/CmsPageEditor";
import { defaultBlogPage } from "@/data/blog-page";

export default function EditBlogPage() {
  return (
    <CmsPageEditor
      pageKey="blog"
      title="Edit Blog Page"
      description="Headings and labels for /blog. Article cards still come from published posts."
      viewUrl="/blog"
      defaults={defaultBlogPage}
      fields={[
        { key: "eyebrow", label: "Hero eyebrow", type: "text" },
        { key: "title", label: "Hero title", type: "text" },
        { key: "description", label: "Hero description", type: "textarea", rows: 3 },
        { key: "featuredLabel", label: "Featured label", type: "text" },
        { key: "featuredBadge", label: "Featured badge", type: "text" },
        { key: "featuredButton", label: "Featured button", type: "text" },
        { key: "recentTitle", label: "Recent articles heading", type: "text" },
        { key: "emptyTitle", label: "Empty state title", type: "text" },
        { key: "emptyText", label: "Empty state text", type: "textarea", rows: 2 },
        { key: "reflectionEyebrow", label: "Reflection heading", type: "text" },
        { key: "reflectionQuote", label: "Reflection quote", type: "textarea", rows: 3 },
        { key: "reflectionSource", label: "Reflection source", type: "text" },
        { key: "trendingLabel", label: "Trending heading", type: "text" },
        { key: "topicsLabel", label: "Topics heading", type: "text" },
      ]}
    />
  );
}
