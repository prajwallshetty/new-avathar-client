"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle, ChevronDown, Save, FileText, Globe, Upload } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

const BLOG_CATEGORIES = [
  "Wedding Tips",
  "Pre-Wedding Guide",
  "Real Weddings",
  "Photography Tips",
  "Engagement Stories",
  "Style & Trends",
  "General",
];

export default function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const postId = resolvedParams.id;
  
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "Wedding Tips",
    tagsString: "",
    status: "Draft",
    seoTitle: "",
    seoDescription: "",
    seoKeywordsString: "",
    author: "New Avatar Team",
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/blog/${postId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.post) {
            setFormData({
              title: data.post.title || "",
              slug: data.post.slug || "",
              excerpt: data.post.excerpt || "",
              content: data.post.content || "",
              coverImage: data.post.coverImage || "",
              category: data.post.category || "Wedding Tips",
              tagsString: data.post.tags ? data.post.tags.join(", ") : "",
              status: data.post.status || "Draft",
              seoTitle: data.post.seoTitle || "",
              seoDescription: data.post.seoDescription || "",
              seoKeywordsString: data.post.seoKeywords ? data.post.seoKeywords.join(", ") : "",
              author: data.post.author || "New Avatar Team",
            });
          }
        } else {
          toast.error("Failed to load blog post.");
          router.push("/admin/blog");
        }
      } catch (err) {
        console.error("Load post details error:", err);
        toast.error("An error occurred while loading post details.");
        router.push("/admin/blog");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, router]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => {
      const updated = { ...p, [name]: value };
      
      // Auto-generate slug from title if slug was not manually touched yet
      if (name === "title" && (!p.slug || p.slug === "" || p.slug === p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""))) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Process tags & keywords
      const tags = formData.tagsString
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");
      
      const seoKeywords = formData.seoKeywordsString
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k !== "");

      const payload = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
        excerpt: formData.excerpt,
        content: formData.content,
        coverImage: formData.coverImage,
        category: formData.category,
        tags,
        status: formData.status,
        seoTitle: formData.seoTitle || formData.title,
        seoDescription: formData.seoDescription || formData.excerpt,
        seoKeywords,
        author: formData.author || "New Avatar Team",
      };

      const res = await fetch(`/api/admin/blog/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Blog post updated successfully!");
        router.push("/admin/blog");
        router.refresh();
      } else {
        const data = await res.json();
        const errorMsg = data.error || "Failed to update blog post";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch {
      setError("Network error occurred");
      toast.error("Network error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-muted-foreground">
        <Loader2 size={24} className="animate-spin text-primary" />
        <p className="text-xs font-semibold uppercase tracking-wider">Loading post details…</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none pb-12">
      {/* Back button */}
      <div>
        <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all uppercase tracking-wider">
          <ArrowLeft size={13} strokeWidth={2.5} />
          Back to Blog Posts
        </Link>
      </div>

      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Edit Blog Post</h1>
        <p className="text-xs text-muted-foreground font-medium mt-1">Modify article contents and customize SEO parameters.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Side */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border bg-card shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="p-5 border-b border-border bg-muted/20">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Article Details</CardTitle>
              <CardDescription className="text-xs text-muted-foreground/80 mt-1">Modify your main editorial content.</CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              {error && (
                <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive-foreground text-xs p-3 rounded-lg font-medium">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Post Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. 10 Essential Tips for Cinematic Wedding Photography"
                  className="bg-muted/50 border-border text-xs h-10 px-3"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <Label htmlFor="slug" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">URL Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleFormChange}
                  placeholder="e.g. 10-essential-tips-for-wedding-photography"
                  className="bg-muted/50 border-border text-xs h-10 px-3 font-mono"
                />
                <p className="text-[10px] text-muted-foreground/60 italic font-mono">Will resolve to: /blog/{formData.slug || "your-slug-here"}</p>
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5">
                <Label htmlFor="excerpt" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Excerpt / Search Summary</Label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleFormChange}
                  required
                  rows={2}
                  placeholder="Provide a compelling 1-2 sentence preview summary of the post..."
                  className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                />
              </div>

              {/* Content Body */}
              <div className="space-y-1.5">
                <Label htmlFor="content" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Article Body (Supports HTML markup)</Label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleFormChange}
                  required
                  rows={12}
                  placeholder="Start writing article... Use HTML like <p>, <h2>, <ul> for rich formatting."
                  className="w-full bg-muted/50 border border-border rounded-lg px-3 py-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-y font-sans leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO OVERRIDES CARD */}
          <Card className="border-border bg-card shadow-sm rounded-xl overflow-hidden border-t-primary/20 border-t-2">
            <CardHeader className="p-5 border-b border-border bg-muted/20">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Globe size={15} /> SEO Optimization Overrides
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground/80 mt-1">Configure metadata fields to target search engines.</CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              {/* SEO Title */}
              <div className="space-y-1.5">
                <Label htmlFor="seoTitle" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Custom Search Title</Label>
                <Input
                  id="seoTitle"
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleFormChange}
                  placeholder="Defaults to Post Title if left empty"
                  className="bg-muted/50 border-border text-xs h-10 px-3"
                />
                <p className="text-[9px] text-muted-foreground/60">Recommended length: 50-60 characters.</p>
              </div>

              {/* SEO Description */}
              <div className="space-y-1.5">
                <Label htmlFor="seoDescription" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Custom Search Description</Label>
                <textarea
                  id="seoDescription"
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleFormChange}
                  rows={2}
                  placeholder="Defaults to Excerpt summary if left empty"
                  className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                />
                <p className="text-[9px] text-muted-foreground/60">Recommended length: 150-160 characters for snippets.</p>
              </div>

              {/* SEO Keywords */}
              <div className="space-y-1.5">
                <Label htmlFor="seoKeywordsString" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Target Keywords (Comma Separated)</Label>
                <Input
                  id="seoKeywordsString"
                  name="seoKeywordsString"
                  value={formData.seoKeywordsString}
                  onChange={handleFormChange}
                  placeholder="e.g. wedding tips, photography lighting, bangalore wedding"
                  className="bg-muted/50 border-border text-xs h-10 px-3"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings Side */}
        <div className="space-y-6">
          <Card className="border-border bg-card shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="p-5 border-b border-border bg-muted/20">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Publish Options</CardTitle>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              {/* Status */}
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Post Status</Label>
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer h-10"
                  >
                    <option value="Draft" className="bg-card text-foreground">Draft</option>
                    <option value="Published" className="bg-card text-foreground">Published</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/75 pointer-events-none" />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Category</Label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer h-10"
                  >
                    {BLOG_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-card text-foreground">{cat}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/75 pointer-events-none" />
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-1.5">
                <Label htmlFor="coverImage" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cover Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="coverImage"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleFormChange}
                    placeholder="e.g. /wedding/JKP00401.jpg.jpeg"
                    className="bg-muted/50 border-border text-xs h-10 px-3 flex-1"
                  />
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "newavathar_gallery"}
                    onSuccess={(result: any) => {
                      if (result?.info?.secure_url) {
                        setFormData((p) => ({ ...p, coverImage: result.info.secure_url }));
                        toast.success("Cover image uploaded successfully!");
                      }
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open?.()}
                        className="h-10 px-3 bg-primary text-primary-foreground rounded-md flex items-center justify-center text-xs font-medium hover:bg-primary/90 transition-colors"
                      >
                        <Upload size={14} className="mr-1.5" />
                        Upload
                      </button>
                    )}
                  </CldUploadWidget>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <Label htmlFor="tagsString" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tags (Comma Separated)</Label>
                <Input
                  id="tagsString"
                  name="tagsString"
                  value={formData.tagsString}
                  onChange={handleFormChange}
                  placeholder="e.g. wedding, lighting, tips"
                  className="bg-muted/50 border-border text-xs h-10 px-3"
                />
              </div>

              {/* Author */}
              <div className="space-y-1.5">
                <Label htmlFor="author" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Author</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  required
                  placeholder="New Avatar Team"
                  className="bg-muted/50 border-border text-xs h-10 px-3"
                />
              </div>

              <div className="pt-4 flex gap-2">
                <Button href="/admin/blog" variant="ghost" className="text-xs flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="text-xs font-semibold flex-1 gap-1">
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </form>
    </div>
  );
}
