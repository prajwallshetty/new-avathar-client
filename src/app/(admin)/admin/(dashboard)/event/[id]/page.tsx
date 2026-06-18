"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import {
  ArrowLeft,
  Upload,
  Trash2,
  ExternalLink,
  Camera,
  CalendarDays,
  ImageIcon,
  Loader2,
  AlertCircle,
  Star,
  Eye,
  EyeOff,
  Download,
  Heart,
  Users,
  Grid,
  BarChart3,
  CheckSquare,
  Square,
  ChevronDown,
  Layers,
  MapPin,
  Lock,
  Unlock,
  Sparkles
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ClientDetails {
  brideName?: string;
  groomName?: string;
  personName?: string;
  gender?: "Bride" | "Groom";
  motherName?: string;
  fatherName?: string;
  celebrantName?: string;
  companyName?: string;
}

interface EventType {
  _id: string;
  title: string;
  eventType: string;
  date: string;
  venue: string;
  slug: string;
  status: "Draft" | "Editing" | "Delivered" | "Archived";
  template: string;
  isPasswordProtected: boolean;
  coverImage?: string;
  coverVideo?: string;
  clientDetails?: ClientDetails;
}

interface PhotoType {
  _id: string;
  url: string;
  publicId: string;
  category: string;
  order: number;
  isFeatured: boolean;
  isHidden: boolean;
}

interface ViewLog {
  _id: string;
  sessionId: string;
  userAgent?: string;
  createdAt: string;
}

interface DownloadLog {
  _id: string;
  sessionId: string;
  category: "single" | "bulk" | "zip";
  photoId?: {
    _id: string;
    url: string;
  };
  createdAt: string;
}

interface FavoriteLog {
  _id: string;
  sessionId: string;
  photoId?: {
    _id: string;
    url: string;
  };
  createdAt: string;
}

const eventCategories: Record<string, string[]> = {
  Wedding: ["General", "Ceremony", "Reception", "Candid", "Couple Portraits", "Family", "Decor"],
  "Pre-Wedding": ["General", "Couple Portraits", "Behind The Scenes", "Outdoor"],
  Engagement: ["General", "Ring Ceremony", "Decor", "Portraits", "Family"],
  Reception: ["General", "Couple Stage", "Dinner", "Decor", "Guest Portraits"],
  Mehndi: ["General", "Mehndi Design", "Family", "Dancing", "Portraits"],
  Portrait: ["General", "Studio Portraits", "Outdoor Portraits", "Black & White"],
  Maternity: ["General", "Studio", "Nature Portraits", "Details"],
  Birthday: ["General", "Cake Cutting", "Games", "Group Portraits", "Decor"],
  Corporate: ["General", "Keynotes", "Networking", "Portraits", "Exhibits"],
};

export default function ManageEvent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;
  const router = useRouter();

  const [event, setEvent] = useState<EventType | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [favorites, setFavorites] = useState<FavoriteLog[]>([]);
  const [downloads, setDownloads] = useState<DownloadLog[]>([]);
  const [views, setViews] = useState<ViewLog[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"photos" | "analytics" | "downloads" | "favorites">("photos");
  
  // Photo selection states
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [uploadCategory, setUploadCategory] = useState<string>("General");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const fetchEventData = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}`);
      if (res.ok) {
        const data = await res.json();
        setEvent(data.event);
        setStats(data.stats);
        setFavorites(data.favorites || []);
        setDownloads(data.downloads || []);
        setViews(data.views || []);
      }

      const photosRes = await fetch(`/api/events/${eventId}/photos`);
      if (photosRes.ok) {
        const pData = await photosRes.json();
        setPhotos(pData.photos || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load gallery details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  useEffect(() => {
    console.log("Cloudinary Debug (Event Page):", {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "newavathar_gallery",
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      uploadEndpoint: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
    });
  }, []);

  const handleUploadSuccess = async (result: any) => {
    if (result.info && result.info.secure_url) {
      const newPhoto = {
        url: result.info.secure_url,
        publicId: result.info.public_id,
        category: uploadCategory,
      };
      try {
        const res = await fetch(`/api/events/${eventId}/photos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPhoto),
        });
        if (res.ok) {
          toast.success("Photo uploaded successfully!");
          fetchEventData();
        } else {
          toast.error("Failed to save uploaded photo.");
        }
      } catch (err) {
        console.error("Upload save failed", err);
        toast.error("Failed to save uploaded photo.");
      }
    }
  };

  const handleDeleteImage = async (photoId: string) => {
    if (!confirm("Remove this image from the gallery?")) return;
    setDeleting(photoId);
    try {
      const res = await fetch(`/api/events/${eventId}/photos?photoId=${photoId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Image deleted successfully.");
        setSelectedPhotoIds(prev => prev.filter(id => id !== photoId));
        fetchEventData();
      } else {
        toast.error("Failed to delete image.");
      }
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete image.");
    } finally {
      setDeleting(null);
    }
  };

  // Toggle flags for individual photos
  const handleToggleFlag = async (photoId: string, updates: Partial<PhotoType>) => {
    try {
      const res = await fetch(`/api/events/${eventId}/photos`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates: [{ _id: photoId, ...updates }]
        }),
      });
      if (res.ok) {
        setPhotos(prev => prev.map(p => p._id === photoId ? { ...p, ...updates } : p));
        toast.success("Photo setting updated.");
      } else {
        toast.error("Failed to update photo setting.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating photo.");
    }
  };

  // Update photo category
  const handlePhotoCategoryChange = async (photoId: string, category: string) => {
    await handleToggleFlag(photoId, { category });
  };

  // Set an image as the cover image of the event
  const handleSetCoverImage = async (photoUrl: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverImage: photoUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        setEvent(data.event);
        toast.success("Cover image set successfully.");
      } else {
        toast.error("Failed to set cover image.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error setting cover image.");
    }
  };

  // Checkbox toggle
  const toggleSelectPhoto = (photoId: string) => {
    setSelectedPhotoIds(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const toggleSelectAll = (visiblePhotos: PhotoType[]) => {
    const visibleIds = visiblePhotos.map(p => p._id);
    const allSelected = visibleIds.every(id => selectedPhotoIds.includes(id));
    if (allSelected) {
      setSelectedPhotoIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      setSelectedPhotoIds(prev => {
        const unique = new Set([...prev, ...visibleIds]);
        return Array.from(unique);
      });
    }
  };

  // Bulk actions
  const handleBulkUpdate = async (updatesObj: Partial<PhotoType>) => {
    if (selectedPhotoIds.length === 0) return;
    setBulkActionLoading(true);
    try {
      const updates = selectedPhotoIds.map(id => ({
        _id: id,
        ...updatesObj
      }));
      const res = await fetch(`/api/events/${eventId}/photos`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      if (res.ok) {
        toast.success(`Updated ${selectedPhotoIds.length} photos successfully.`);
        setSelectedPhotoIds([]);
        fetchEventData();
      } else {
        toast.error("Failed to perform bulk update.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error running bulk update.");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPhotoIds.length === 0) return;
    if (!confirm(`Permanently delete all ${selectedPhotoIds.length} selected photos?`)) return;
    setBulkActionLoading(true);
    try {
      await Promise.all(
        selectedPhotoIds.map(photoId =>
          fetch(`/api/events/${eventId}/photos?photoId=${photoId}`, {
            method: "DELETE",
          })
        )
      );
      toast.success("Selected photos deleted successfully.");
      setSelectedPhotoIds([]);
      fetchEventData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete some photos.");
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Helper to format client names
  const getEventName = (ev: EventType) => {
    const d = ev.clientDetails;
    if (!d) return ev.title;
    if (["Wedding", "Pre-Wedding", "Engagement", "Reception"].includes(ev.eventType) && d.brideName && d.groomName) {
      return `${d.brideName} & ${d.groomName}`;
    }
    return d.personName || d.celebrantName || d.companyName || d.motherName || ev.title;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-muted-foreground">
        <Loader2 size={24} className="animate-spin text-primary" />
        <p className="text-xs font-semibold uppercase tracking-wider">Loading event details…</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center max-w-sm mx-auto p-6">
        <AlertCircle size={32} className="text-destructive" />
        <div>
          <h2 className="text-base font-bold text-foreground">Event not found</h2>
          <p className="text-xs text-muted-foreground mt-1">
            The event you are trying to access does not exist or has been removed.
          </p>
        </div>
        <Link
          href="/admin"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-2 text-xs")}
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const categories = eventCategories[event.eventType] || ["General"];
  const visiblePhotos = categoryFilter === "All"
    ? photos
    : photos.filter(p => p.category === categoryFilter);

  return (
    <div className="max-w-6xl mx-auto space-y-6 select-none">
      {/* Back Link */}
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all uppercase tracking-wider">
          <ArrowLeft size={13} strokeWidth={2.5} />
          All Events
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border bg-primary/10 text-primary border-primary/20">
              {event.eventType}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border bg-muted text-muted-foreground">
              {event.status}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
              <CalendarDays size={12} strokeWidth={1.75} />
              {new Date(event.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {getEventName(event)}
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin size={12} />
            {event.venue} • Template: <span className="font-semibold text-foreground">{event.template}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:mt-1">
          <Link
            href={`/gallery/${event.slug}`}
            target="_blank"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs h-9 font-semibold")}
          >
            <ExternalLink size={13} className="mr-1.5" />
            View Live Gallery
          </Link>

          <div className="flex items-center border border-border rounded-lg bg-card h-9 px-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase mr-2 border-r border-border pr-2">Upload To:</span>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="bg-transparent border-0 text-xs font-semibold focus:ring-0 cursor-pointer pr-1 outline-none text-foreground"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
            <Button
              onClick={() => toast.error("Cloudinary is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your .env file.")}
              type="button"
              size="sm"
              variant="outline"
              className="text-xs h-9 font-bold text-destructive hover:bg-destructive/10 border-destructive"
            >
              <AlertCircle size={13} className="mr-1.5" />
              Upload Disabled
            </Button>
          ) : (
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "newavathar_gallery"}
              onSuccess={handleUploadSuccess}
              config={{
                cloud: {
                  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "newavathar",
                  apiKey: null as any
                }
              }}
              options={{ multiple: true }}
            >
              {({ open }) => (
                <Button
                  onClick={() => open()}
                  type="button"
                  size="sm"
                  className="text-xs h-9 font-bold cursor-pointer"
                >
                  <Upload size={13} className="mr-1.5" strokeWidth={2.75} />
                  Upload Photos
                </Button>
              )}
            </CldUploadWidget>
          )}
        </div>
      </div>

      {/* Mini stats cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-center">
          <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">Photos</span>
          <span className="text-lg font-extrabold text-foreground mt-0.5">{stats?.photoCount ?? 0}</span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-center">
          <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">Page Views</span>
          <span className="text-lg font-extrabold text-foreground mt-0.5">{stats?.viewCount ?? 0}</span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-center">
          <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">Unique Guests</span>
          <span className="text-lg font-extrabold text-foreground mt-0.5">{stats?.uniqueGuestCount ?? 0}</span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-center">
          <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">Downloads</span>
          <span className="text-lg font-extrabold text-foreground mt-0.5">{stats?.downloadCount ?? 0}</span>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-xl flex flex-col justify-center col-span-2 sm:col-span-1">
          <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">Favorites Locked</span>
          <span className="text-lg font-extrabold text-foreground mt-0.5">{stats?.favoriteCount ?? 0}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("photos")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap",
            activeTab === "photos"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Grid size={14} />
          Organize Media
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap",
            activeTab === "analytics"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Users size={14} />
          Visitor Log ({views.length})
        </button>
        <button
          onClick={() => setActiveTab("downloads")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap",
            activeTab === "downloads"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Download size={14} />
          Downloads ({downloads.length})
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap",
            activeTab === "favorites"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Heart size={14} />
          Favorites Feed ({favorites.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "photos" && (
        <div className="space-y-4">
          {/* Photos Action Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-muted/20 border border-border p-3 rounded-xl">
            {/* Left side: filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase text-muted-foreground mr-1">Filter Album:</span>
              {["All", ...categories].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    "px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer border",
                    categoryFilter === cat
                      ? "bg-card text-foreground border-border shadow-xs"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Right side: Bulk Actions selection */}
            {selectedPhotoIds.length > 0 ? (
              <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 p-1 rounded-lg">
                <span className="text-[9px] font-bold text-primary uppercase px-2">
                  {selectedPhotoIds.length} Selected
                </span>
                
                {/* Bulk Category Change */}
                <div className="flex items-center bg-card border border-border rounded-md px-1.5 h-7">
                  <Layers size={10} className="text-muted-foreground/60 mr-1" />
                  <select
                    disabled={bulkActionLoading}
                    onChange={(e) => handleBulkUpdate({ category: e.target.value })}
                    className="bg-transparent border-0 text-[10px] font-bold focus:ring-0 cursor-pointer pr-1 outline-none text-foreground"
                    defaultValue=""
                  >
                    <option value="" disabled>Change Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={() => handleBulkUpdate({ isFeatured: true })}
                  disabled={bulkActionLoading}
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-[10px] font-bold cursor-pointer"
                  title="Feature Selected"
                >
                  <Star size={11} className="fill-amber-400 text-amber-500 mr-1" />
                  Feature
                </Button>

                <Button
                  onClick={() => handleBulkUpdate({ isHidden: true })}
                  disabled={bulkActionLoading}
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-[10px] font-bold cursor-pointer"
                  title="Hide Selected"
                >
                  <EyeOff size={11} className="mr-1" />
                  Hide
                </Button>

                <Button
                  onClick={() => handleBulkUpdate({ isHidden: false })}
                  disabled={bulkActionLoading}
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-[10px] font-bold cursor-pointer"
                  title="Show Selected"
                >
                  <Eye size={11} className="mr-1" />
                  Show
                </Button>

                <Button
                  onClick={handleBulkDelete}
                  disabled={bulkActionLoading}
                  variant="destructive"
                  size="sm"
                  className="h-7 px-2 text-[10px] font-bold cursor-pointer"
                >
                  <Trash2 size={11} className="mr-1" />
                  Delete
                </Button>
              </div>
            ) : (
              <span className="text-[10px] text-muted-foreground font-semibold py-1">
                Select photos via checkboxes for bulk actions.
              </span>
            )}
          </div>

          {/* Photo Organizer Grid */}
          {visiblePhotos.length === 0 ? (
            <div className="border border-dashed border-border rounded-xl p-16 text-center bg-card flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted text-muted-foreground/60 flex items-center justify-center">
                <Camera size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">No photos in selection</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">
                  {categoryFilter === "All"
                    ? "Upload images to populate this client's gallery. Select multiple files at once."
                    : `No photos categorized under "${categoryFilter}" yet. Upload directly to this category or tag existing photos.`}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Select All Row */}
              <div className="flex items-center justify-between px-1">
                <button
                  onClick={() => toggleSelectAll(visiblePhotos)}
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground hover:text-foreground cursor-pointer transition-all"
                >
                  {visiblePhotos.every(p => selectedPhotoIds.includes(p._id)) ? (
                    <CheckSquare size={13} className="text-primary" />
                  ) : (
                    <Square size={13} />
                  )}
                  Select All Visibles
                </button>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  Showing {visiblePhotos.length} of {photos.length} photos
                </span>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {visiblePhotos.map((img) => {
                  const isSel = selectedPhotoIds.includes(img._id);
                  return (
                    <div
                      key={img._id}
                      className={cn(
                        "relative aspect-square border rounded-xl overflow-hidden group bg-card select-none shadow-xs transition-all flex flex-col justify-end",
                        isSel ? "border-primary ring-2 ring-primary/20" : "border-border"
                      )}
                    >
                      {/* Photo Thumbnail */}
                      <Image
                        src={img.url}
                        alt="Gallery preview image"
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      />

                      {/* Top Overlay Checklist / Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between pointer-events-none">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectPhoto(img._id);
                          }}
                          className="w-5.5 h-5.5 bg-card/85 hover:bg-card border border-border/60 rounded-md flex items-center justify-center pointer-events-auto cursor-pointer shadow-xs transition-all"
                        >
                          {isSel ? (
                            <CheckSquare size={12} className="text-primary" />
                          ) : (
                            <Square size={12} className="text-muted-foreground/60" />
                          )}
                        </button>

                        <div className="flex flex-col items-end gap-1.5">
                          {event?.coverImage === img.url && (
                            <span className="bg-primary text-primary-foreground p-1 rounded-md shadow-xs" title="Gallery Cover Image">
                              <ImageIcon size={10} />
                            </span>
                          )}
                          {img.isFeatured && (
                            <span className="bg-amber-400 text-amber-950 p-1 rounded-md shadow-xs" title="Featured Photo">
                              <Star size={10} className="fill-current" />
                            </span>
                          )}
                          {img.isHidden && (
                            <span className="bg-red-500 text-white p-1 rounded-md shadow-xs" title="Hidden Photo">
                              <EyeOff size={10} />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom Controls Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-2">
                        {/* Selector for Category */}
                        <div className="flex items-center bg-black/40 border border-white/20 rounded-md px-1.5 h-6 text-white">
                          <select
                            value={img.category}
                            onChange={(e) => handlePhotoCategoryChange(img._id, e.target.value)}
                            className="bg-transparent border-0 text-[9px] font-bold focus:ring-0 cursor-pointer pr-1 outline-none w-full"
                          >
                            {categories.map(c => (
                              <option key={c} value={c} className="text-foreground">{c}</option>
                            ))}
                          </select>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleToggleFlag(img._id, { isFeatured: !img.isFeatured })}
                              className={cn(
                                "w-6 h-6 rounded-md flex items-center justify-center cursor-pointer border text-white transition-all hover:bg-white/10",
                                img.isFeatured ? "bg-amber-400/20 border-amber-400" : "bg-black/40 border-white/20"
                              )}
                              title="Toggle Featured"
                            >
                              <Star size={11} className={cn(img.isFeatured ? "fill-amber-400 text-amber-400" : "text-white")} />
                            </button>
                            <button
                              onClick={() => handleToggleFlag(img._id, { isHidden: !img.isHidden })}
                              className={cn(
                                "w-6 h-6 rounded-md flex items-center justify-center cursor-pointer border text-white transition-all hover:bg-white/10",
                                img.isHidden ? "bg-red-500/20 border-red-500" : "bg-black/40 border-white/20"
                              )}
                              title="Toggle Hidden"
                            >
                              {img.isHidden ? <EyeOff size={11} className="text-red-400" /> : <Eye size={11} />}
                            </button>
                            <button
                              onClick={() => handleSetCoverImage(img.url)}
                              className={cn(
                                "w-6 h-6 rounded-md flex items-center justify-center cursor-pointer border text-white transition-all hover:bg-white/10",
                                event?.coverImage === img.url ? "bg-primary/20 border-primary" : "bg-black/40 border-white/20"
                              )}
                              title="Set as Gallery Cover (Hero)"
                            >
                              <ImageIcon size={11} className={cn(event?.coverImage === img.url ? "text-primary" : "text-white")} />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteImage(img._id)}
                            className="w-6 h-6 rounded-md bg-red-600 text-white hover:bg-red-500 flex items-center justify-center cursor-pointer border border-transparent shadow-md"
                            title="Delete Image"
                            disabled={deleting === img._id}
                          >
                            {deleting === img._id ? (
                              <Loader2 size={10} className="animate-spin" />
                            ) : (
                              <Trash2 size={11} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="bg-card border border-border rounded-xl p-4 overflow-hidden">
          <h3 className="text-xs font-bold uppercase text-muted-foreground/80 tracking-wider mb-3 flex items-center gap-1.5">
            <Users size={13} />
            Page Views History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold bg-muted/30">
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Session Key ID</th>
                  <th className="py-2.5 px-3">Browser / Platform Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {views.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-muted-foreground">
                      No views logged yet. Public links log visitors upon loads.
                    </td>
                  </tr>
                ) : (
                  views.map((log) => (
                    <tr key={log._id} className="hover:bg-muted/10">
                      <td className="py-2.5 px-3 font-medium text-foreground whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-muted-foreground truncate max-w-[150px]">
                        {log.sessionId}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground truncate max-w-[300px]" title={log.userAgent}>
                        {log.userAgent || "Unknown User Agent"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "downloads" && (
        <div className="bg-card border border-border rounded-xl p-4 overflow-hidden">
          <h3 className="text-xs font-bold uppercase text-muted-foreground/80 tracking-wider mb-3 flex items-center gap-1.5">
            <Download size={13} />
            Media Downloads History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold bg-muted/30">
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Session Key ID</th>
                  <th className="py-2.5 px-3">Download Type</th>
                  <th className="py-2.5 px-3">Media Artifact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {downloads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-muted-foreground">
                      No media downloads recorded yet.
                    </td>
                  </tr>
                ) : (
                  downloads.map((log) => (
                    <tr key={log._id} className="hover:bg-muted/10">
                      <td className="py-2.5 px-3 font-medium text-foreground whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-muted-foreground truncate max-w-[150px]">
                        {log.sessionId}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border",
                          log.category === "zip"
                            ? "bg-amber-100 text-amber-800 border-amber-200/50"
                            : log.category === "bulk"
                            ? "bg-blue-100 text-blue-800 border-blue-200/50"
                            : "bg-emerald-100 text-emerald-800 border-emerald-200/50"
                        )}>
                          {log.category === "zip" ? "Full ZIP Album" : log.category === "bulk" ? "Bulk Select" : "Single Photo"}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        {log.photoId ? (
                          <div className="relative w-8 h-8 rounded-md overflow-hidden border border-border bg-muted flex-shrink-0">
                            <Image
                              src={log.photoId.url}
                              alt="Downloaded photo"
                              fill
                              className="object-cover"
                              sizes="32px"
                            />
                          </div>
                        ) : (
                          <span className="text-muted-foreground font-medium italic">All Event Photos</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "favorites" && (
        <div className="bg-card border border-border rounded-xl p-4 overflow-hidden">
          <h3 className="text-xs font-bold uppercase text-muted-foreground/80 tracking-wider mb-3 flex items-center gap-1.5">
            <Heart size={13} className="text-rose-500 fill-rose-500" />
            Client Favorites Log
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold bg-muted/30">
                  <th className="py-2.5 px-3">Date Favorited</th>
                  <th className="py-2.5 px-3">Session Key ID</th>
                  <th className="py-2.5 px-3">Image Favorite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {favorites.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-muted-foreground">
                      No photos marked as favorite by clients yet.
                    </td>
                  </tr>
                ) : (
                  favorites.map((log) => (
                    <tr key={log._id} className="hover:bg-muted/10">
                      <td className="py-2.5 px-3 font-medium text-foreground whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-muted-foreground truncate max-w-[150px]">
                        {log.sessionId}
                      </td>
                      <td className="py-2 px-3">
                        {log.photoId ? (
                          <a href={log.photoId.url} target="_blank" rel="noreferrer" className="block relative w-8 h-8 rounded-md overflow-hidden border border-border bg-muted flex-shrink-0 hover:border-rose-400 group">
                            <Image
                              src={log.photoId.url}
                              alt="Favorited photo"
                              fill
                              className="object-cover"
                              sizes="32px"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Heart size={10} className="fill-white text-white" />
                            </div>
                          </a>
                        ) : (
                          <span className="text-red-500 font-medium italic">Deleted Photo</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
