"use client";

import { useState, useEffect } from "react";
import {
  BookOpen, PlusCircle, Trash2, Edit3, Search, Clock,
  AlertCircle, Loader2, Inbox, ExternalLink, Globe
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BlogPostType {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  status: "Draft" | "Published";
  author: string;
  publishedAt?: string;
  createdAt: string;
}

export default function AdminBlogList() {
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"All" | "Draft" | "Published">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      } else {
        toast.error("Failed to load blog posts.");
      }
    } catch (error) {
      console.error("Fetch blog posts error:", error);
      toast.error("An error occurred while fetching blog posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this blog post? This action cannot be undone.")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setPosts(prev => prev.filter(post => post._id !== id));
        toast.success("Blog post deleted successfully.");
      } else {
        toast.error("Failed to delete blog post.");
      }
    } catch (error) {
      console.error("Delete blog post error:", error);
      toast.error("Failed to delete blog post.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter and search
  const filteredPosts = posts
    .filter(post => statusFilter === "All" || post.status === statusFilter)
    .filter(post => {
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query)
      );
    });

  return (
    <div className="max-w-6xl mx-auto space-y-7">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            SEO & Content Management
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Blog Posts
          </h1>
        </div>
        <Button href="/admin/blog/create" size="sm" className="text-xs font-semibold h-9 shrink-0 gap-1.5">
          <PlusCircle size={14} />
          Create Blog Post
        </Button>
      </div>

      {/* Filters & Actions Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/50 self-start">
          {(["All", "Draft", "Published"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer",
                statusFilter === s
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse border-border">
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-48 bg-muted rounded" />
                  <div className="h-3 w-72 bg-muted rounded" />
                </div>
                <div className="w-16 h-5 bg-muted rounded-full" />
                <div className="w-20 h-8 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-16 text-center flex flex-col items-center gap-3 bg-card">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
            <Inbox size={22} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">No blog posts found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {searchQuery ? "No results match your search query." : `There are no "${statusFilter}" blog posts yet.`}
            </p>
          </div>
          {searchQuery && (
            <Button onClick={() => setSearchQuery("")} variant="outline" size="sm" className="text-xs">
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredPosts.map((post) => (
            <Card
              key={post._id}
              className="group border border-border hover:border-primary/20 hover:shadow-sm transition-all duration-200 bg-card overflow-hidden"
            >
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <span className={cn(
                      "text-[9px] font-mono border px-2 py-0.5 rounded-full uppercase tracking-wider",
                      post.status === "Published" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    )}>
                      {post.status}
                    </span>
                    <span className="text-[10px] bg-muted text-muted-foreground border border-border/50 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 pt-0.5">
                    <Clock size={11} />
                    {post.publishedAt 
                      ? `Published on ${new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
                      : `Created on ${new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
                    <span className="text-muted-foreground/30">•</span>
                    <span>By {post.author}</span>
                  </p>
                  <p className="text-xs text-muted-foreground/80 line-clamp-1 pt-1 font-inter">
                    {post.excerpt}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  {post.status === "Published" && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-all"
                      title="View Published Post"
                    >
                      <Globe size={13} />
                    </Link>
                  )}
                  <Link
                    href={`/admin/blog/edit/${post._id}`}
                    className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-all"
                    title="Edit Blog Post"
                  >
                    <Edit3 size={13} />
                  </Link>
                  <button
                    onClick={(e) => handleDeletePost(post._id, e)}
                    disabled={deletingId === post._id}
                    className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-all cursor-pointer"
                    title="Delete Blog Post"
                  >
                    {deletingId === post._id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
