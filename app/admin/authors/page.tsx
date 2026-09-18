"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Edit, Trash2, X, Sparkles } from "lucide-react";
import { getHeadingId } from "@/lib/articles";
import { CardGridSkeleton } from "@/components/admin/AdminSkeletons";

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<any>(null);

  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchAuthors = async () => {
    const isFirstLoad = authors.length === 0;
    if (isFirstLoad) setLoading(true);
    try {
      const res = await fetch("/api/admin/authors");
      if (res.ok) {
        const data = await res.json();
        setAuthors(data.authors || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const openCreateModal = () => {
    setEditingAuthor(null);
    setName("");
    setRole("Contributing Writer");
    setAvatar("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80");
    setBio("");
    setModalOpen(true);
  };

  const openEditModal = (auth: any) => {
    setEditingAuthor(auth);
    setName(auth.name);
    setRole(auth.role || "");
    setAvatar(auth.avatar || "");
    setBio(auth.bio || "");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    setSaving(true);
    const id = editingAuthor ? editingAuthor.id : getHeadingId(name);
    const payload = {
      id,
      name: name.trim(),
      role: role.trim(),
      avatar: avatar.trim(),
      bio: bio.trim(),
    };

    try {
      const url = editingAuthor
        ? `/api/admin/authors/${editingAuthor.id}`
        : "/api/admin/authors";
      const method = editingAuthor ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save author");
      }

      setModalOpen(false);
      fetchAuthors();
    } catch (err: any) {
      alert(err.message || "Failed to save author");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (auth: any) => {
    if (!confirm(`Are you sure you want to delete author "${auth.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/authors/${auth.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAuthors((prev) => prev.filter((a) => a.id !== auth.id));
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
            Authors & Contributors
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your editorial writers, Islamic scholars, and columnists
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Author</span>
        </button>
      </div>

      {/* Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full">
            <CardGridSkeleton count={6} />
          </div>
        ) : authors.length === 0 ? (
          <div className="col-span-full py-20 text-center text-xs text-gray-500">
            No authors found. Click &quot;Add New Author&quot; or sync database.
          </div>
        ) : (
          authors.map((auth) => (
            <div
              key={auth.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
            >
              <div className="flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={auth.avatar}
                  alt={auth.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-100 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                    {auth.name}
                  </h3>
                  <p className="text-xs text-emerald-700 font-semibold">
                    {auth.role || "Contributing Writer"}
                  </p>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                    {auth.bio || "No biography provided."}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gray-400 font-mono">ID: {auth.id}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(auth)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit Author"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(auth)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Author"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
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
              {editingAuthor ? "Edit Author Profile" : "New Author"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Author Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Bilal Mansoor"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Editorial Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Lead Editorial Writer, Travel Editor"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Avatar / Photo URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
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
                          if (res.ok) setAvatar(data.url);
                          else alert(data.error || "Upload failed");
                        } catch (err: any) {
                          alert(err.message || "Upload error");
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Author Biography
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Specializations, background, and scholarly focus..."
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
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
                  {saving ? "Saving..." : "Save Author"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
