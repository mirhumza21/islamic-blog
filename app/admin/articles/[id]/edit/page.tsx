"use client";

import { useEffect, useState, use } from "react";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArticle() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/articles/${resolvedParams.id}`);
        if (!res.ok) {
          throw new Error("Article not found or failed to load");
        }
        const data = await res.json();
        setArticle(data.article);
      } catch (err: any) {
        setError(err.message || "Failed to load article");
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-gray-400">
        Loading article details...
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <p className="text-sm font-semibold text-rose-600">{error || "Article not found"}</p>
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-emerald-600 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all articles</span>
        </Link>
      </div>
    );
  }

  return <ArticleEditor initialData={article} isEditing={true} />;
}
