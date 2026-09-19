"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  X,
} from "lucide-react";
import { getHeadingId } from "@/lib/articles";
import { CardGridSkeleton } from "@/components/admin/AdminSkeletons";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [image, setImage] = useState("");
  const [icon, setIcon] = useState("kaaba");
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    const isFirstLoad = categories.length === 0;
    if (isFirstLoad) setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setShortDescription("");
    setImage("https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200&q=80");
    setIcon("kaaba");
    setModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setShortDescription(cat.short_description || cat.shortDescription || "");
    setImage(cat.image || "");
    setIcon(cat.icon || "kaaba");
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(getHeadingId(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      alert("Name and Slug are required");
      return;
    }

    setSaving(true);
    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      description,
      short_description: shortDescription,
      image,
      icon,
    };

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save category");
      }

      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: any) => {
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
            Categories & Topics
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Organize knowledge areas, Umrah guides, and lifestyle pillars
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full">
            <CardGridSkeleton count={6} />
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-20 text-center text-xs text-gray-500">
            No categories found. Click &quot;Add New Category&quot; to create one.
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
            >
              <div>
                <div className="h-32 w-full relative bg-gray-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent"></div>
                  <span className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/90 text-emerald-800 border border-emerald-100 shadow-sm backdrop-blur">
                    /{cat.slug}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-base font-bold text-gray-900">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {cat.description || "No description provided."}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <a
                  href={`/category/${cat.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-emerald-600 inline-flex items-center gap-1 text-[11px] font-medium"
                >
                  <span>Live Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-serif font-bold text-gray-900 mb-4">
              {editingCategory ? "Edit Category" : "New Category"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Umrah Guides"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. umrah-guides"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Short Tagline (e.g. Step-by-step help)
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what readers will find in this topic..."
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Cover Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                  <label className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-medium cursor-pointer hover:bg-emerald-100 transition-colors shrink-0">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const fd = new FormData();
                        fd.append("file", file);
                        try {
                          const res = await fetch("/api/admin/upload", {
                            method: "POST",
                            body: fd,
                          });
                          const data = await res.json();
                          if (res.ok) setImage(data.url);
                          else alert(data.error || "Upload failed");
                        } catch (err: any) {
                          alert(err.message || "Upload error");
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
