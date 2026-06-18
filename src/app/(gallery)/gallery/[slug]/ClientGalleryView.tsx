"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import {
  Lock, Key, Download, Heart, Share2, Copy, Loader2,
  X, CheckSquare, Square, ChevronLeft, ChevronRight,
  MapPin, CalendarDays, Images, ZoomIn,
} from "lucide-react";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ClientDetails {
  brideName?: string; groomName?: string; personName?: string;
  gender?: "Bride" | "Groom"; motherName?: string; fatherName?: string;
  celebrantName?: string; companyName?: string;
}
interface EventType {
  _id: string; title: string; eventType: string; date: string; venue: string;
  slug: string; status: string; template: string; isPasswordProtected: boolean;
  coverImage?: string; coverVideo?: string; description?: string;
  clientDetails?: ClientDetails;
}
interface PhotoType {
  _id: string; url: string; publicId: string; category: string;
  order: number; isFeatured: boolean; isHidden: boolean;
}
interface BrandingType {
  brandName?: string; whatsappNumber?: string; instagramLink?: string;
  facebookLink?: string; footerText?: string;
}

// ─── Accent palette per template ─────────────────────────────────────────────
const ACCENTS: Record<string, { hex: string; text: string; badge: string }> = {
  "Wedding Luxury":       { hex: "#C8A24B", text: "text-[#C8A24B]", badge: "bg-[#C8A24B]/15 text-[#C8A24B] border-[#C8A24B]/30" },
  "Cinematic Wedding":    { hex: "#A7ADB3", text: "text-[#A7ADB3]", badge: "bg-[#A7ADB3]/15 text-[#A7ADB3] border-[#A7ADB3]/30" },
  "Traditional Wedding":  { hex: "#C8A24B", text: "text-[#C8A24B]", badge: "bg-[#C8A24B]/15 text-[#C8A24B] border-[#C8A24B]/30" },
  "Pre-Wedding Love Story":{ hex: "#C98A82",text: "text-[#C98A82]", badge: "bg-[#C98A82]/15 text-[#C98A82] border-[#C98A82]/30" },
  "Engagement Elegant":   { hex: "#7C8C6E", text: "text-[#7C8C6E]", badge: "bg-[#7C8C6E]/15 text-[#7C8C6E] border-[#7C8C6E]/30" },
  "Mehndi Traditional":   { hex: "#B5732A", text: "text-[#B5732A]", badge: "bg-[#B5732A]/15 text-[#B5732A] border-[#B5732A]/30" },
  "Portrait Minimal":     { hex: "#888888", text: "text-[#ABABAB]", badge: "bg-white/10 text-white/70 border-white/20" },
  "Maternity Premium":    { hex: "#7E93B5", text: "text-[#7E93B5]", badge: "bg-[#7E93B5]/15 text-[#7E93B5] border-[#7E93B5]/30" },
  "Birthday Celebration": { hex: "#C76B5B", text: "text-[#C76B5B]", badge: "bg-[#C76B5B]/15 text-[#C76B5B] border-[#C76B5B]/30" },
  "Corporate Showcase":   { hex: "#5B6B82", text: "text-[#8FA0B8]", badge: "bg-[#5B6B82]/15 text-[#8FA0B8] border-[#5B6B82]/30" },
};
const DEFAULT_ACCENT = { hex: "#C8A24B", text: "text-[#C8A24B]", badge: "bg-[#C8A24B]/15 text-[#C8A24B] border-[#C8A24B]/30" };
const FAV_COLOR = "#B23B3B";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

// ─── Loading Screen ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0D0B08] flex flex-col items-center justify-center gap-5">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border border-[#C8A24B]/30 rounded-full flex items-center justify-center"
      >
        <div className="w-2 h-2 rounded-full bg-[#C8A24B]" />
      </motion.div>
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/30">
        Loading your gallery
      </p>
    </div>
  );
}

// ─── Lock Screen ─────────────────────────────────────────────────────────────
function LockScreen({
  event, accent, password, setPassword, authLoading, onSubmit,
}: {
  event: EventType | null; accent: typeof DEFAULT_ACCENT;
  password: string; setPassword: (v: string) => void;
  authLoading: boolean; onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="min-h-screen bg-[#0D0B08] flex items-center justify-center p-6 relative overflow-hidden">
      {event?.coverImage && (
        <>
          <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${event.coverImage})` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0B08]/60 via-[#0D0B08]/80 to-[#0D0B08]" />
        </>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/30 mb-2">New Avathar Photography</p>
          <div className={cn("w-8 h-px mx-auto", `bg-[${accent.hex}]`)} style={{ backgroundColor: accent.hex }} />
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/10 p-8 space-y-6 backdrop-blur-sm">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 mx-auto border border-white/15 flex items-center justify-center mb-4">
              <Lock size={16} strokeWidth={1.5} className="text-white/50" />
            </div>
            <h1 className="font-serif text-2xl text-white/90 leading-snug">{event?.title}</h1>
            <p className="text-[11px] text-white/40 leading-relaxed">
              This gallery is private. Enter your viewing code to access your photos.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="relative">
              <Key size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="password"
                placeholder="Viewing code"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={authLoading}
                className="w-full bg-white/5 border border-white/10 focus:border-white/25 py-3 pl-10 pr-4
                           text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors
                           font-mono tracking-wider text-center"
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className={cn(
                "w-full py-3 text-[11px] font-mono uppercase tracking-[0.25em] transition-all duration-300 flex items-center justify-center gap-2",
                "border text-white hover:text-[#0D0B08] hover:border-transparent"
              )}
              style={{ borderColor: accent.hex + "66",
                backgroundColor: authLoading ? accent.hex + "33" : undefined }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent.hex; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; }}
            >
              {authLoading ? <Loader2 size={14} className="animate-spin" /> : "Enter Gallery"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ClientGalleryView({ slug }: { slug: string }) {
  const [sessionId, setSessionId]             = useState("");
  const [loading, setLoading]                 = useState(true);
  const [isLocked, setIsLocked]               = useState(false);
  const [password, setPassword]               = useState("");
  const [authLoading, setAuthLoading]         = useState(false);
  const [event, setEvent]                     = useState<EventType | null>(null);
  const [photos, setPhotos]                   = useState<PhotoType[]>([]);
  const [branding, setBranding]               = useState<BrandingType>({});
  const [favorites, setFavorites]             = useState<string[]>([]);
  const [activeCategory, setActiveCategory]   = useState("All");
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [selectMode, setSelectMode]           = useState(false);
  const [zipDownloading, setZipDownloading]   = useState(false);
  const [zipProgress, setZipProgress]         = useState(0);
  const [isSharingOpen, setIsSharingOpen]     = useState(false);
  const [lightboxIndex, setLightboxIndex]     = useState<number | null>(null);

  // Session init
  useEffect(() => {
    let sess = localStorage.getItem("newavathar_session_id");
    if (!sess) {
      sess = "sess_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem("newavathar_session_id", sess);
    }
    setSessionId(sess);
  }, []);

  // Fetch gallery
  const fetchGallery = useCallback(async (sessKey: string, code?: string) => {
    if (!sessKey) return;
    setLoading(true);
    try {
      const savedCode = code || sessionStorage.getItem(`gallery_code_${slug}`) || "";
      const res = savedCode
        ? await fetch(`/api/gallery/${slug}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: savedCode, sessionId: sessKey }),
          })
        : await fetch(`/api/gallery/${slug}?sessionId=${sessKey}`);

      if (res.ok) {
        const data = await res.json();
        setIsLocked(data.isLocked || false);
        setEvent(data.event);
        setBranding(data.branding || {});
        if (!data.isLocked) {
          setPhotos(data.photos || []);
          if (savedCode) sessionStorage.setItem(`gallery_code_${slug}`, savedCode);
          const favRes = await fetch(`/api/gallery/${slug}/favorite?sessionId=${sessKey}`);
          if (favRes.ok) { const fd = await favRes.json(); setFavorites(fd.favoritePhotoIds || []); }
        }
      } else { toast.error("Failed to load gallery."); }
    } catch { toast.error("Error loading gallery."); }
    finally { setLoading(false); }
  }, [slug]);

  useEffect(() => { if (sessionId) fetchGallery(sessionId); }, [slug, sessionId, fetchGallery]);

  // Unlock
  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) { toast.error("Viewing code required"); return; }
    setAuthLoading(true);
    try {
      const res = await fetch(`/api/gallery/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, sessionId }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsLocked(false); setEvent(data.event); setPhotos(data.photos || []); setBranding(data.branding || {});
        sessionStorage.setItem(`gallery_code_${slug}`, password);
        toast.success("Gallery unlocked.");
        const favRes = await fetch(`/api/gallery/${slug}/favorite?sessionId=${sessionId}`);
        if (favRes.ok) { const fd = await favRes.json(); setFavorites(fd.favoritePhotoIds || []); }
      } else { toast.error("Incorrect viewing code. Try again."); }
    } catch { toast.error("Couldn't reach the server."); }
    finally { setAuthLoading(false); }
  };

  // Favorite
  const handleToggleFavorite = async (photoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/gallery/${slug}/favorite`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId, sessionId }),
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(prev => data.favorited ? [...prev, photoId] : prev.filter(id => id !== photoId));
        toast.success(data.favorited ? "Added to favorites." : "Removed from favorites.");
      }
    } catch { toast.error("Couldn't update favorites."); }
  };

  // Single download
  const handleSingleDownload = async (photo: PhotoType, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      toast.info("Preparing download…");
      const blob = await (await fetch(photo.url)).blob();
      saveAs(blob, `newavathar-${event?.slug}-${photo._id}.jpg`);
      await fetch(`/api/gallery/${slug}/download`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId: photo._id, sessionId, category: "single" }),
      });
      toast.success("Downloaded.");
    } catch { toast.error("Download failed."); }
  };

  // ZIP download
  const handleZipDownload = async (photosToDownload: PhotoType[], logCategory: "zip" | "bulk") => {
    if (!photosToDownload.length) return;
    setZipDownloading(true); setZipProgress(0);
    try {
      toast.info(`Preparing ${photosToDownload.length} photos…`);
      const zip = new JSZip();
      const folder = zip.folder("gallery_photos");
      const limit = 5;
      for (let i = 0; i < photosToDownload.length; i += limit) {
        const chunk = photosToDownload.slice(i, i + limit);
        await Promise.all(chunk.map(async (photo, idx) => {
          try { folder?.file(`photo_${i + idx + 1}.jpg`, await (await fetch(photo.url)).blob()); }
          catch { /* skip failed */ }
        }));
        setZipProgress(Math.min(100, Math.floor(((i + chunk.length) / photosToDownload.length) * 100)));
      }
      saveAs(await zip.generateAsync({ type: "blob" }), `newavathar-${event?.slug || "gallery"}.zip`);
      await fetch(`/api/gallery/${slug}/download`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, category: logCategory }),
      });
      toast.success("Download complete.");
      setSelectedPhotoIds([]); setSelectMode(false);
    } catch { toast.error("Couldn't package download."); }
    finally { setZipDownloading(false); setZipProgress(0); }
  };

  const toggleSelectPhoto = (photoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedPhotoIds(prev => prev.includes(photoId) ? prev.filter(id => id !== photoId) : [...prev, photoId]);
  };

  const handleCopyLink = () => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); };

  // ── Keyboard navigation for lightbox ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") setLightboxIndex(p => (p !== null && p < visiblePhotos.length - 1 ? p + 1 : 0));
      if (e.key === "ArrowLeft")  setLightboxIndex(p => (p !== null && p > 0 ? p - 1 : visiblePhotos.length - 1));
      if (e.key === "Escape")     setLightboxIndex(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  if (loading) return <LoadingScreen />;

  const accentKey = event?.template && ACCENTS[event.template] ? event.template : "Wedding Luxury";
  const accent = ACCENTS[accentKey] ?? DEFAULT_ACCENT;

  if (isLocked) return (
    <LockScreen event={event} accent={accent} password={password} setPassword={setPassword}
      authLoading={authLoading} onSubmit={handleUnlockSubmit} />
  );

  const categories = ["All", "Favorites Only", ...Array.from(new Set(photos.map(p => p.category).filter(Boolean)))];
  let visiblePhotos = photos;
  if (activeCategory === "Favorites Only") visiblePhotos = photos.filter(p => favorites.includes(p._id));
  else if (activeCategory !== "All") visiblePhotos = photos.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0D0B08] text-white/85">

      {/* ─── Hero ─── */}
      <section className="relative h-[65vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src={event?.coverImage || photos[0]?.url || "/placeholder-gallery.jpg"}
          alt={event?.title || "Gallery"}
          fill priority className="object-cover"
        />
        {/* Multi-layer gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0B08]/50 via-transparent to-[#0D0B08]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0B08]/60 via-transparent to-transparent" />

        {/* Brand watermark */}
        <div className="absolute top-6 left-6 md:top-8 md:left-10">
          <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/40">
            {branding.brandName || "New Avathar Photography"}
          </p>
        </div>

        {/* Event title block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute bottom-10 left-6 md:bottom-14 md:left-10 max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ backgroundColor: accent.hex }} />
            <span className={cn("font-mono text-[9px] uppercase tracking-[0.35em]", accent.text)}>
              {event?.eventType}
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-white leading-tight tracking-wide mb-4
                         [text-shadow:0_4px_32px_rgba(0,0,0,0.8)]">
            {event?.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-white/50 font-mono">
            {event?.date && (
              <span className="flex items-center gap-1.5">
                <CalendarDays size={11} /> {formatDate(event.date)}
              </span>
            )}
            {event?.venue && (
              <span className="flex items-center gap-1.5">
                <MapPin size={11} /> {event.venue}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Images size={11} /> {photos.length} photos
            </span>
          </div>
        </motion.div>
      </section>

      {/* ─── Sticky Toolbar ─── */}
      <div className="sticky top-0 z-40 bg-[#0D0B08]/90 backdrop-blur-xl border-b border-white/[0.07]">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-3 flex items-center justify-between gap-4">
          {/* Left: photo count */}
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 hidden sm:block">
            <span style={{ color: accent.hex }}>{String(visiblePhotos.length).padStart(3, "0")}</span>
            {" "}/ {String(photos.length).padStart(3, "0")} photos
          </span>

          {/* Right: actions */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => setSelectMode(!selectMode)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] rounded transition-all cursor-pointer",
                selectMode ? cn("border", accent.text) : "text-white/40 hover:text-white/70"
              )}
              style={selectMode ? { borderColor: accent.hex + "55" } : {}}
            >
              <CheckSquare size={12} />
              <span className="hidden sm:inline">{selectMode ? "Exit" : "Select"}</span>
            </button>

            <button
              onClick={() => setIsSharingOpen(!isSharingOpen)}
              className="flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 hover:text-white/70 rounded transition-colors cursor-pointer"
            >
              <Share2 size={12} />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={() => handleZipDownload(photos, "zip")}
              disabled={zipDownloading}
              className={cn("flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] rounded transition-colors cursor-pointer disabled:opacity-40", accent.text)}
            >
              {zipDownloading
                ? <><Loader2 size={12} className="animate-spin" /><span className="hidden sm:inline">Zipping {zipProgress}%</span></>
                : <><Download size={12} /><span className="hidden sm:inline">Download All</span></>}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Share Panel ─── */}
      <AnimatePresence>
        {isSharingOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-white/[0.07] bg-white/[0.02]"
          >
            <div className="max-w-md mx-auto px-6 py-6 flex flex-col items-center gap-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">Share this gallery</p>
              <div className="flex items-center gap-3">
                {[
                  { href: `https://api.whatsapp.com/send?text=${encodeURIComponent("Check out these photos: " + (typeof window !== "undefined" ? window.location.href : ""))}`, icon: <FaWhatsapp size={16} />, label: "WhatsApp" },
                  { href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`, icon: <FaFacebook size={16} />, label: "Facebook" },
                ].map(item => (
                  <a key={item.label} href={item.href} target="_blank" rel="noreferrer"
                    className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/25 transition-all">
                    {item.icon}
                  </a>
                ))}
                <button onClick={handleCopyLink}
                  className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/25 transition-all cursor-pointer">
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Category Filter ─── */}
      <div className="max-w-6xl mx-auto px-5 md:px-10 pt-8 pb-4">
        <div className="flex items-center gap-1 flex-wrap">
          {categories.map(cat => {
            if (cat === "Favorites Only" && favorites.length === 0) return null;
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] rounded-full border transition-all duration-200 cursor-pointer flex items-center gap-1.5",
                  active
                    ? "border-transparent text-[#0D0B08]"
                    : "border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/20"
                )}
                style={active ? { backgroundColor: accent.hex } : {}}
              >
                {cat === "Favorites Only" && <Heart size={9} style={{ fill: FAV_COLOR, color: FAV_COLOR }} />}
                {cat}
                {cat === "Favorites Only" && <span className="opacity-70">({favorites.length})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Photo Grid ─── */}
      <main className="max-w-6xl mx-auto px-5 md:px-10 py-4 pb-32">
        {visiblePhotos.length === 0 ? (
          <div className="border border-white/[0.07] rounded-xl p-16 text-center flex flex-col items-center gap-4 bg-white/[0.02]">
            <Heart size={20} className="text-white/20" />
            <div>
              <p className="text-sm font-medium text-white/60">No photos here</p>
              <p className="text-xs text-white/30 mt-1">
                {activeCategory === "Favorites Only"
                  ? "Tap ♥ on any photo to save it here."
                  : `Nothing filed under "${activeCategory}" yet.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {visiblePhotos.map((photo, index) => {
              const isFav = favorites.includes(photo._id);
              const isSel = selectedPhotoIds.includes(photo._id);
              return (
                <motion.div
                  key={photo._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(index * 0.03, 0.5) }}
                  className="break-inside-avoid relative group cursor-pointer"
                  onClick={() => selectMode ? toggleSelectPhoto(photo._id) : setLightboxIndex(index)}
                >
                  <div className={cn(
                    "relative overflow-hidden rounded-sm transition-all duration-300",
                    isSel ? "ring-2" : "ring-0"
                  )}
                    style={isSel ? { boxShadow: `0 0 0 2px ${accent.hex}` } : {}}
                  >
                    <img
                      src={photo.url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                    />

                    {/* Hover overlay */}
                    {!selectMode && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => handleToggleFavorite(photo._id, e)}
                          className="w-9 h-9 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors rounded-sm cursor-pointer"
                        >
                          <Heart size={13} style={isFav ? { fill: FAV_COLOR, color: FAV_COLOR } : { color: "white" }} />
                        </button>
                        <button
                          onClick={(e) => handleSingleDownload(photo, e)}
                          className="w-9 h-9 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors rounded-sm cursor-pointer"
                        >
                          <Download size={13} className="text-white" />
                        </button>
                        <div className="w-9 h-9 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center rounded-sm">
                          <ZoomIn size={13} className="text-white" />
                        </div>
                      </div>
                    )}

                    {/* Select mode overlay */}
                    {selectMode && (
                      <div className="absolute inset-0 bg-black/20 flex items-start justify-start p-2.5">
                        <div className={cn("w-5 h-5 border-2 flex items-center justify-center rounded-sm",
                          isSel ? "bg-white border-white" : "border-white/50 bg-transparent")}>
                          {isSel && <CheckSquare size={11} className="text-[#0D0B08]" />}
                        </div>
                      </div>
                    )}

                    {/* Favorite indicator */}
                    {isFav && !selectMode && (
                      <div className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center">
                        <Heart size={10} style={{ fill: FAV_COLOR, color: FAV_COLOR }} />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* ─── Bulk Selection Floating Bar ─── */}
      <AnimatePresence>
        {selectMode && selectedPhotoIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-5 py-4
                       bg-[#1A1612]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl
                       max-w-sm w-[90%]"
          >
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">Selected</p>
              <p className={cn("font-mono text-sm font-bold", accent.text)}>
                {selectedPhotoIds.length} photo{selectedPhotoIds.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Button
              onClick={() => setSelectedPhotoIds([])}
              variant="outline"
              className="h-8 text-[10px] font-mono uppercase tracking-wider border-white/15 text-white/50 hover:text-white hover:bg-white/5"
            >
              Clear
            </Button>
            <Button
              onClick={() => handleZipDownload(photos.filter(p => selectedPhotoIds.includes(p._id)), "bulk")}
              disabled={zipDownloading}
              className="h-8 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 border-0"
              style={{ backgroundColor: accent.hex, color: "#0D0B08" }}
            >
              {zipDownloading ? <Loader2 size={11} className="animate-spin" /> : <Download size={11} />}
              {zipDownloading ? `${zipProgress}%` : "Download"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Lightbox ─── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/97 flex flex-col"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                  {String(lightboxIndex + 1).padStart(3, "0")} / {String(visiblePhotos.length).padStart(3, "0")}
                </span>
                {visiblePhotos[lightboxIndex].category && (
                  <span className={cn("font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border", accent.badge)}>
                    {visiblePhotos[lightboxIndex].category}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleToggleFavorite(visiblePhotos[lightboxIndex]._id)}
                  className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-white/25 transition-colors cursor-pointer rounded">
                  <Heart size={13} style={favorites.includes(visiblePhotos[lightboxIndex]._id) ? { fill: FAV_COLOR, color: FAV_COLOR } : { color: "white" }} />
                </button>
                <button onClick={() => handleSingleDownload(visiblePhotos[lightboxIndex])}
                  className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-white/25 transition-colors cursor-pointer rounded">
                  <Download size={13} className="text-white/70" />
                </button>
                <button onClick={() => setLightboxIndex(null)}
                  className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-white/25 transition-colors cursor-pointer rounded">
                  <X size={13} className="text-white/70" />
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center relative px-4 py-4">
              <button
                onClick={() => setLightboxIndex(p => (p !== null && p > 0 ? p - 1 : visiblePhotos.length - 1))}
                className="absolute left-3 md:left-6 z-10 w-10 h-10 flex items-center justify-center text-white/30 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>

              <AnimatePresence mode="wait">
                <motion.img
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  src={visiblePhotos[lightboxIndex].url}
                  alt="Enlarged photo"
                  className="max-w-full max-h-full object-contain select-none rounded-sm"
                  style={{ maxHeight: "calc(100vh - 140px)" }}
                />
              </AnimatePresence>

              <button
                onClick={() => setLightboxIndex(p => (p !== null && p < visiblePhotos.length - 1 ? p + 1 : 0))}
                className="absolute right-3 md:right-6 z-10 w-10 h-10 flex items-center justify-center text-white/30 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom hint */}
            <div className="text-center py-3 border-t border-white/[0.07]">
              <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/20">
                ← → arrow keys to navigate • esc to close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/[0.07] py-14 text-center bg-[#0A0806]">
        <p className="font-serif text-xl text-white/60 mb-1">
          {branding.brandName || "New Avathar"}
        </p>
        <p className={cn("font-mono text-[9px] uppercase tracking-[0.35em] mb-8", accent.text)}>
          Photography &amp; Cinematography
        </p>

        <div className="flex items-center justify-center gap-3 mb-8">
          {branding.whatsappNumber && (
            <a href={`https://wa.me/${branding.whatsappNumber.replace(/[^0-9]/g, "")}`}
              target="_blank" rel="noreferrer"
              className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all rounded">
              <FaWhatsapp size={14} />
            </a>
          )}
          {branding.instagramLink && (
            <a href={branding.instagramLink} target="_blank" rel="noreferrer"
              className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all rounded">
              <FaInstagram size={14} />
            </a>
          )}
          {branding.facebookLink && (
            <a href={branding.facebookLink} target="_blank" rel="noreferrer"
              className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all rounded">
              <FaFacebook size={14} />
            </a>
          )}
        </div>

        <p className="font-mono text-[9px] tracking-widest uppercase text-white/20">
          {branding.footerText || `© ${new Date().getFullYear()} New Avathar Photography. All rights reserved.`}
        </p>
      </footer>
    </div>
  );
}