"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  Flame,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";
import { TableSkeleton } from "@/components/admin/AdminSkeletons";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchArticles = async () => {
    const isFirstLoad = articles.length === 0;
    if (isFirstLoad) setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedStatus) params.set("status", selectedStatus);

      const res = await fetch(`/api/admin/articles?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load categories for filter
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(console.error);

    fetchArticles();
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete: "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete article");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete article");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (article: any) => {
    const nextStatus = article.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/articles/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setArticles((prev) =>
          prev.map((a) => (a.id === article.id ? { ...a, status: nextStatus } : a))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
            Articles Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Create, edit, organize, and publish Islamic blog articles
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search articles by title or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition-all"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-gray-700 outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-gray-700 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          <button
            onClick={fetchArticles}
            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold border border-gray-300 transition-colors shrink-0"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
        {loading ? (
          <TableSkeleton rows={8} cols={7} />
        ) : articles.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm font-semibold text-gray-700">
              No articles match your criteria
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Try adjusting your search or write a new post.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4">Published</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4 max-w-sm">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="font-semibold text-gray-900 hover:text-emerald-600 line-clamp-1 block"
                      >
                        {article.title}
                      </Link>
                      <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5 font-mono">
                        /{article.slug}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-[11px] font-medium text-gray-700">
                        {article.category?.name || article.category_slug}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-700 whitespace-nowrap">
                      {article.author?.name || article.author_id}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(article)}
                        title="Click to toggle Draft / Published"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                          article.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100"
                        }`}
                      >
                        {article.status === "published" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span className="capitalize">{article.status}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {article.featured && (
                          <span
                            title="Featured on Homepage"
                            className="p-1 rounded bg-amber-50 text-amber-600 border border-amber-200"
                          >
                            <Star className="w-3 h-3 fill-amber-500" />
                          </span>
                        )}
                        {article.popular && (
                          <span
                            title="Trending / Popular"
                            className="p-1 rounded bg-rose-50 text-rose-600 border border-rose-200"
                          >
                            <Flame className="w-3 h-3 fill-rose-500" />
                          </span>
                        )}
                        {!article.featured && !article.popular && (
                          <span className="text-gray-300">—</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                      {new Date(article.published_at).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <a
                          href={`/blog/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View on Live Site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          disabled={deletingId === article.id}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
