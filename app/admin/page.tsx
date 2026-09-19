"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  FolderTree,
  Users,
  Eye,
  Plus,
  ArrowUpRight,
  Sparkles,
  Database,
  ExternalLink,
  Edit,
  Clock,
} from "lucide-react";
import { Pulse } from "@/components/admin/AdminSkeletons";

interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalCategories: number;
  totalAuthors: number;
  recentArticles: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalCategories: 0,
    totalAuthors: 0,
    recentArticles: [],
  });
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/articles");
        if (res.ok) {
          const data = await res.json();
          const articles = data.articles || [];
          setStats((prev) => ({
            ...prev,
            totalArticles: articles.length,
            publishedArticles: articles.filter(
              (a: any) => a.status === "published"
            ).length,
            draftArticles: articles.filter((a: any) => a.status === "draft").length,
            recentArticles: articles.slice(0, 5),
          }));
          setDbConnected(true);
        } else {
          setDbConnected(false);
        }

        // Fetch categories count
        const catRes = await fetch("/api/admin/categories");
        if (catRes.ok) {
          const catData = await catRes.json();
          setStats((prev) => ({
            ...prev,
            totalCategories: (catData.categories || []).length,
          }));
        }

        // Fetch authors count
        const authRes = await fetch("/api/admin/authors");
        if (authRes.ok) {
          const authData = await authRes.json();
          setStats((prev) => ({
            ...prev,
            totalAuthors: (authData.authors || []).length,
          }));
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setDbConnected(false);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 md:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-100 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>UmrahZone Publishing Hub</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
              Welcome back to your Admin Studio
            </h1>
            <p className="text-emerald-100/80 text-sm mt-1 max-w-xl">
              Manage and publish articles, customize Islamic knowledge topics, and
              optimize search engine rankings all in one place.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-sm font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Write New Article</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Supabase Schema Notice / Setup Reminder */}
      <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-600">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900">
              Supabase Database Connection
            </p>
            <p className="text-xs text-gray-500">
              {loading
                ? "Checking connection..."
                : dbConnected
                  ? `Connected. ${stats.totalArticles} articles, ${stats.totalCategories} categories, ${stats.totalAuthors} authors.`
                  : "Could not reach the database. Check your Supabase keys in .env.local."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
              dbConnected === false
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                dbConnected === false ? "bg-rose-500" : "bg-emerald-500 animate-pulse"
              }`}
            />
            {dbConnected === false ? "Disconnected" : "Connected"}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Total Articles</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {loading ? <Pulse className="inline-block h-7 w-12" /> : stats.totalArticles}
            </span>
            <span className="text-xs font-medium text-emerald-600">
              {stats.publishedArticles} published
            </span>
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Categories</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <FolderTree className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {loading ? <Pulse className="inline-block h-7 w-12" /> : stats.totalCategories}
            </span>
            <span className="text-xs text-gray-500">topics</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Authors</span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {loading ? <Pulse className="inline-block h-7 w-12" /> : stats.totalAuthors}
            </span>
            <span className="text-xs text-gray-500">contributors</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Drafts</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {loading ? <Pulse className="inline-block h-7 w-12" /> : stats.draftArticles}
            </span>
            <span className="text-xs font-medium text-purple-600">in progress</span>
          </div>
        </div>
      </div>

      {/* Quick Access & Recent Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Articles Table (2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Recent Articles
              </h2>
              <p className="text-xs text-gray-500">
                Latest updates and publications
              </p>
            </div>
            <Link
              href="/admin/articles"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Pulse key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : stats.recentArticles.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-medium">
                No articles yet
              </p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Write your first post from Articles to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {stats.recentArticles.map((article: any) => (
                <div
                  key={article.id}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="text-sm font-semibold text-gray-900 hover:text-emerald-600 line-clamp-1 block"
                    >
                      {article.title}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>
                        {article.category?.name || article.category_slug}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(article.published_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span
                        className={`capitalize px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          article.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {article.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
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
                      title="Preview on live site"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 space-y-4">
          <h2 className="text-base font-bold text-gray-900">
            Quick Actions
          </h2>

          <div className="space-y-2.5">
            <Link
              href="/admin/articles/new"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-emerald-50/60 border border-gray-200 hover:border-emerald-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg group-hover:scale-105 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Create New Article
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Rich Quran/Hadith block editor
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-amber-50/60 border border-gray-200 hover:border-amber-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-lg group-hover:scale-105 transition-transform">
                  <FolderTree className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Manage Categories
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Organize Islamic knowledge topics
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
            </Link>

            <Link
              href="/admin/authors"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-teal-50/60 border border-gray-200 hover:border-teal-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 text-teal-700 rounded-lg group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Manage Authors
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Editorial team and bios
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600" />
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-purple-50/60 border border-gray-200 hover:border-purple-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-lg group-hover:scale-105 transition-transform">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    SEO & Site Metadata
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Tags, social links, brand name
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
