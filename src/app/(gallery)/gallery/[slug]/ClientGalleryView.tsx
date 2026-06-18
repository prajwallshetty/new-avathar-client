"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Fraunces, Archivo, IBM_Plex_Mono } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import {
  Lock,
  Key,
  Download,
  Heart,
  Share2,
  Copy,
  Loader2,
  Aperture,
  X,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CalendarDays,
} from "lucide-react";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
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
  status: string;
  template: string;
  isPasswordProtected: boolean;
  coverImage?: string;
  coverVideo?: string;
  description?: string;
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

interface BrandingType {
  brandName?: string;
  whatsappNumber?: string;
  instagramLink?: string;
  facebookLink?: string;
  footerText?: string;
}

// ─── Typography ───────────────────────────────────────────────────────────
// A characterful display serif, an architectural sans for UI, and a utility
// mono for plate numbers / labels — the vocabulary of a print house, not a
// generic "elegant wedding" font pairing.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const FONT_VARS = `${fraunces.variable} ${archivo.variable} ${plexMono.variable}`;
const SANS = "font-[family-name:var(--font-sans)]";
const MONO = "font-[family-name:var(--font-mono)]";

// ─── Shared chassis ──────────────────────────────────────────────────────
// Every gallery lives on the same deep, warm "gallery wall" canvas — photos
// are the subject, so the surrounding room stays quiet and consistent. What
// changes per event type is the "finish": the paper mat, the accent metal
// or pigment, and the title's voice.
const INK = "bg-[#15110D]";
const INK_TEXT = "text-[#EDE6D9]";
const INK_TEXT_SOFT = "text-[#A89B89]";
const INK_SOFT = "bg-[#1D1712]";
const FAVORITE = "#B23B3B";

interface Finish {
  kicker: string; // museum-plaque edition label, written for this event type
  mat: string; // bg + text classes for paper/mat surfaces
  matMuted: string; // secondary text on mat
  line: string; // hairline border, accent at low opacity
  lineStrong: string; // hairline border, accent at higher opacity
  tint: string; // soft accent wash, used for badges
  accentText: string; // accent legible on the dark canvas
  accentBtn: string; // solid accent button
  accentHex: string; // raw hex, for one-off inline marks (registration ticks)
  display: string; // title typography for this finish
}

const FINISHES: Record<string, Finish> = {
  "Wedding Luxury": {
    kicker: "Wedding Archive",
    mat: "bg-[#F3EADA] text-[#241D12]",
    matMuted: "text-[#241D12]/55",
    line: "border-[#C8A24B]/25",
    lineStrong: "border-[#C8A24B]/55",
    tint: "bg-[#C8A24B]/10",
    accentText: "text-[#D8B978]",
    accentBtn: "bg-[#C8A24B] hover:bg-[#AD8A3E] text-[#241407]",
    accentHex: "#C8A24B",
    display: `${SANS} font-[family-name:var(--font-display)] italic font-light tracking-wide`,
  },
  "Cinematic Wedding": {
    kicker: "Director's Reel",
    mat: "bg-[#DCDCD9] text-[#161615]",
    matMuted: "text-[#161615]/55",
    line: "border-[#A7ADB3]/30",
    lineStrong: "border-[#A7ADB3]/60",
    tint: "bg-[#A7ADB3]/12",
    accentText: "text-[#C7CBCF]",
    accentBtn: "bg-[#A7ADB3] hover:bg-[#898F95] text-[#161615]",
    accentHex: "#A7ADB3",
    display: "font-[family-name:var(--font-display)] font-black uppercase tracking-tight",
  },
  "Traditional Wedding": {
    kicker: "Heritage Album",
    mat: "bg-[#F1DFC9] text-[#2B1414]",
    matMuted: "text-[#2B1414]/55",
    line: "border-[#C8A24B]/35",
    lineStrong: "border-[#C8A24B]/65",
    tint: "bg-[#7A2630]/10",
    accentText: "text-[#D8B978]",
    accentBtn: "bg-[#7A2630] hover:bg-[#631C24] text-[#F1DFC9]",
    accentHex: "#7A2630",
    display: "font-[family-name:var(--font-display)] font-semibold tracking-wide",
  },
  "Pre-Wedding Love Story": {
    kicker: "Love Story, Vol. I",
    mat: "bg-[#F6E3DC] text-[#3A2420]",
    matMuted: "text-[#3A2420]/55",
    line: "border-[#C98A82]/30",
    lineStrong: "border-[#C98A82]/60",
    tint: "bg-[#C98A82]/12",
    accentText: "text-[#E2B0A8]",
    accentBtn: "bg-[#C98A82] hover:bg-[#B06F66] text-[#2E1714]",
    accentHex: "#C98A82",
    display: "font-[family-name:var(--font-display)] italic font-light",
  },
  "Engagement Elegant": {
    kicker: "Engagement Edition",
    mat: "bg-[#E6E9E0] text-[#23281F]",
    matMuted: "text-[#23281F]/55",
    line: "border-[#7C8C6E]/30",
    lineStrong: "border-[#7C8C6E]/60",
    tint: "bg-[#7C8C6E]/12",
    accentText: "text-[#AEBBA0]",
    accentBtn: "bg-[#7C8C6E] hover:bg-[#677559] text-[#161A12]",
    accentHex: "#7C8C6E",
    display: "font-[family-name:var(--font-display)] font-extralight tracking-[0.18em] uppercase",
  },
  "Mehndi Traditional": {
    kicker: "Mehndi Archive",
    mat: "bg-[#F1DEAF] text-[#3A2A0E]",
    matMuted: "text-[#3A2A0E]/55",
    line: "border-[#B5732A]/30",
    lineStrong: "border-[#B5732A]/60",
    tint: "bg-[#B5732A]/12",
    accentText: "text-[#E3AE6A]",
    accentBtn: "bg-[#B5732A] hover:bg-[#95601F] text-[#241404]",
    accentHex: "#B5732A",
    display: "font-[family-name:var(--font-display)] font-bold tracking-wide",
  },
  "Portrait Minimal": {
    kicker: "Studio Portrait",
    mat: "bg-[#ECECEA] text-[#101010]",
    matMuted: "text-[#101010]/55",
    line: "border-[#5B5B5B]/25",
    lineStrong: "border-[#5B5B5B]/55",
    tint: "bg-[#5B5B5B]/10",
    accentText: "text-[#C9C9C7]",
    accentBtn: "bg-[#ECECEA] hover:bg-[#D8D8D6] text-[#101010]",
    accentHex: "#5B5B5B",
    display: "font-[family-name:var(--font-display)] font-black uppercase tracking-tighter",
  },
  "Maternity Premium": {
    kicker: "Maternity Edition",
    mat: "bg-[#E6EAF1] text-[#1F2733]",
    matMuted: "text-[#1F2733]/55",
    line: "border-[#7E93B5]/30",
    lineStrong: "border-[#7E93B5]/60",
    tint: "bg-[#7E93B5]/12",
    accentText: "text-[#AEBEDA]",
    accentBtn: "bg-[#7E93B5] hover:bg-[#6A7EA0] text-[#10151D]",
    accentHex: "#7E93B5",
    display: "font-[family-name:var(--font-display)] italic font-light tracking-wide",
  },
  "Birthday Celebration": {
    kicker: "Celebration Reel",
    mat: "bg-[#FAE3D6] text-[#3A2018]",
    matMuted: "text-[#3A2018]/55",
    line: "border-[#C76B5B]/30",
    lineStrong: "border-[#C76B5B]/60",
    tint: "bg-[#C76B5B]/12",
    accentText: "text-[#E6A597]",
    accentBtn: "bg-[#C76B5B] hover:bg-[#AD584A] text-[#240F0A]",
    accentHex: "#C76B5B",
    display: "font-[family-name:var(--font-display)] font-bold tracking-tight",
  },
  "Corporate Showcase": {
    kicker: "Brand Archive",
    mat: "bg-[#E2E5EA] text-[#161A1F]",
    matMuted: "text-[#161A1F]/55",
    line: "border-[#5B6B82]/30",
    lineStrong: "border-[#5B6B82]/60",
    tint: "bg-[#5B6B82]/12",
    accentText: "text-[#A9B4C2]",
    accentBtn: "bg-[#5B6B82] hover:bg-[#485568] text-[#0E1115]",
    accentHex: "#5B6B82",
    display: `${SANS} font-bold tracking-tight not-italic`,
  },
};

const categoryCode = (cat: string) =>
  (cat || "GEN").replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "GEN";

// Small print-production registration marks — the corner brackets a printer
// uses to align a plate. Doubles as the gallery's signature framing device.
function RegistrationMarks({ color }: { color: string }) {
  const corner = "absolute w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity duration-300";
  return (
    <>
      <span className={cn(corner, "top-2 left-2 border-l border-t")} style={{ borderColor: color }} />
      <span className={cn(corner, "top-2 right-2 border-r border-t")} style={{ borderColor: color }} />
      <span className={cn(corner, "bottom-2 left-2 border-l border-b")} style={{ borderColor: color }} />
      <span className={cn(corner, "bottom-2 right-2 border-r border-b")} style={{ borderColor: color }} />
    </>
  );
}

export default function ClientGalleryView({ slug }: { slug: string }) {
  const [sessionId, setSessionId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Core Data
  const [event, setEvent] = useState<EventType | null>(null);
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [branding, setBranding] = useState<BrandingType>({});
  const [favorites, setFavorites] = useState<string[]>([]);

  // Interactive view filters
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);

  // Download loadings
  const [zipDownloading, setZipDownloading] = useState(false);
  const [zipProgress, setZipProgress] = useState<number>(0);

  // Modals & Popovers
  const [isSharingOpen, setIsSharingOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Initialize unique session identifier
  useEffect(() => {
    let sess = localStorage.getItem("newavathar_session_id");
    if (!sess) {
      sess = "sess_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem("newavathar_session_id", sess);
    }
    setSessionId(sess);
  }, []);

  // Fetch gallery details
  const fetchGallery = async (sessKey: string, code?: string) => {
    if (!sessKey) return;
    try {
      setLoading(true);
      // Read unlocked code from sessionStorage if it exists
      const savedCode = code || sessionStorage.getItem(`gallery_code_${slug}`) || "";

      let url = `/api/gallery/${slug}?sessionId=${sessKey}`;
      let res;

      if (savedCode) {
        res = await fetch(url.split("?")[0], {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: savedCode, sessionId: sessKey }),
        });
      } else {
        res = await fetch(url);
      }

      if (res.ok) {
        const data = await res.json();
        setIsLocked(data.isLocked || false);

        if (!data.isLocked) {
          setEvent(data.event);
          setPhotos(data.photos || []);
          setBranding(data.branding || {});

          if (savedCode) {
            sessionStorage.setItem(`gallery_code_${slug}`, savedCode);
          }

          // Fetch user session favorites
          const favRes = await fetch(`/api/gallery/${slug}/favorite?sessionId=${sessKey}`);
          if (favRes.ok) {
            const favData = await favRes.json();
            setFavorites(favData.favoritePhotoIds || []);
          }
        } else {
          setEvent(data.event);
          setBranding(data.branding || {});
        }
      } else {
        toast.error("Failed to retrieve gallery.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading gallery data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchGallery(sessionId);
    }
  }, [slug, sessionId]);

  // Handle password unlock
  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Viewing code required");
      return;
    }
    setAuthLoading(true);
    try {
      const res = await fetch(`/api/gallery/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, sessionId }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsLocked(false);
        setEvent(data.event);
        setPhotos(data.photos || []);
        setBranding(data.branding || {});
        sessionStorage.setItem(`gallery_code_${slug}`, password);
        toast.success("Gallery unlocked.");

        // Fetch favorites
        const favRes = await fetch(`/api/gallery/${slug}/favorite?sessionId=${sessionId}`);
        if (favRes.ok) {
          const favData = await favRes.json();
          setFavorites(favData.favoritePhotoIds || []);
        }
      } else {
        toast.error("That viewing code didn't match. Try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't reach the server. Try again in a moment.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Toggle Favorite Action
  const handleToggleFavorite = async (photoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/gallery/${slug}/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId, sessionId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.favorited) {
          setFavorites((prev) => [...prev, photoId]);
          toast.success("Added to favorites.");
        } else {
          setFavorites((prev) => prev.filter((id) => id !== photoId));
          toast.success("Removed from favorites.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't update favorites.");
    }
  };

  // Single Photo Download
  const handleSingleDownload = async (photo: PhotoType, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      toast.info("Downloading print...");
      const response = await fetch(photo.url);
      const blob = await response.blob();
      saveAs(blob, `newavathar-${event?.slug}-${photo._id}.jpg`);

      // Log download to API
      await fetch(`/api/gallery/${slug}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoId: photo._id,
          sessionId,
          category: "single",
        }),
      });
      toast.success("Downloaded.");
    } catch (err) {
      console.error(err);
      toast.error("That download failed. Try again.");
    }
  };

  // ZIP Bulk Download
  const handleZipDownload = async (photosToDownload: PhotoType[], logCategory: "zip" | "bulk") => {
    if (photosToDownload.length === 0) return;
    setZipDownloading(true);
    setZipProgress(0);
    try {
      toast.info(`Preparing ${photosToDownload.length} prints...`);
      const zip = new JSZip();
      const folder = zip.folder("gallery_photos");

      const limit = 5; // concurrent downloads count
      for (let i = 0; i < photosToDownload.length; i += limit) {
        const chunk = photosToDownload.slice(i, i + limit);
        await Promise.all(
          chunk.map(async (photo, index) => {
            const photoIdx = i + index;
            try {
              const res = await fetch(photo.url);
              const blob = await res.blob();
              folder?.file(`photo_${photoIdx + 1}.jpg`, blob);
            } catch (e) {
              console.error(`Failed to load chunk item ${photoIdx}`, e);
            }
          })
        );
        setZipProgress(Math.min(100, Math.floor(((i + chunk.length) / photosToDownload.length) * 100)));
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `newavathar-${event?.slug || "gallery"}.zip`);

      // Log download statistics
      await fetch(`/api/gallery/${slug}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          category: logCategory,
        }),
      });

      toast.success("Download complete.");
      setSelectedPhotoIds([]);
      setSelectMode(false);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't package that download.");
    } finally {
      setZipDownloading(false);
      setZipProgress(0);
    }
  };

  // Select photo toggle
  const toggleSelectPhoto = (photoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedPhotoIds((prev) =>
      prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied.");
  };

  if (loading) {
    return (
      <div className={cn(FONT_VARS, INK, SANS, "flex flex-col items-center justify-center min-h-screen gap-4")}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}>
          <Aperture size={28} strokeWidth={1.5} className="text-[#C8A24B]" />
        </motion.div>
        <p className={cn(MONO, "text-[10px] uppercase tracking-[0.3em] text-[#A89B89]")}>
          Preparing your prints
        </p>
      </div>
    );
  }

  // Active finish for this event's template, defaulting to the house finish
  const finishKey = event?.template && FINISHES[event.template] ? event.template : "Wedding Luxury";
  const finish = FINISHES[finishKey];

  // Locked View (Viewing-code prompt)
  if (isLocked) {
    return (
      <div className={cn(FONT_VARS, SANS, INK, "min-h-screen flex items-center justify-center p-6 relative")}>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none"
          style={{ backgroundImage: event?.coverImage ? `url(${event.coverImage})` : "none" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#15110D]/40 via-[#15110D]/80 to-[#15110D]" />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn("relative max-w-sm w-full p-px", finish.line, "border")}
        >
          <div className={cn(finish.mat, "p-7 md:p-9 space-y-7")}>
            <div className="text-center space-y-3">
              <div
                className={cn("w-10 h-10 mx-auto flex items-center justify-center border", finish.lineStrong)}
              >
                <Lock size={16} strokeWidth={1.75} />
              </div>
              <p className={cn(MONO, "text-[9px] uppercase tracking-[0.35em]", finish.matMuted)}>
                Private Viewing
              </p>
              <h2 className={cn(finish.display, "text-2xl leading-snug")}>{event?.title}</h2>
              <p className={cn("text-xs leading-relaxed max-w-xs mx-auto", finish.matMuted)}>
                This edition is reserved for invited guests. Enter your viewing code to continue.
              </p>
            </div>

            <form onSubmit={handleUnlockSubmit} className="space-y-3.5">
              <div className={cn("relative border", finish.lineStrong)}>
                <Key size={14} className={cn("absolute left-3.5 top-1/2 -translate-y-1/2", finish.matMuted)} />
                <input
                  type="password"
                  placeholder="Viewing code"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={authLoading}
                  className={cn(
                    MONO,
                    "w-full bg-transparent py-3 pl-10 pr-4 text-xs focus:outline-none placeholder:opacity-50 tracking-widest text-center",
                    finish.mat.split(" ")[1]
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={authLoading}
                className={cn(
                  finish.accentBtn,
                  MONO,
                  "w-full font-medium uppercase tracking-[0.2em] text-[11px] py-2.5 h-11 rounded-[2px] border-0"
                )}
              >
                {authLoading ? <Loader2 size={14} className="animate-spin" /> : "Enter Gallery"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // Categories extraction
  const categories = ["All", "Favorites Only", ...Array.from(new Set(photos.map((p) => p.category).filter(Boolean)))];

  // Visible Photos list
  let visiblePhotos = photos;
  if (activeCategory === "Favorites Only") {
    visiblePhotos = photos.filter((p) => favorites.includes(p._id));
  } else if (activeCategory !== "All") {
    visiblePhotos = photos.filter((p) => p.category === activeCategory);
  }

  return (
    <div className={cn(FONT_VARS, SANS, INK, INK_TEXT, "min-h-screen")}>
      {/* Hero — a framed print with a museum wall-label plaque */}
      <section className="relative pt-8 px-4 md:pt-14 md:px-10">
        <div className={cn("relative aspect-[4/5] md:aspect-[16/8] overflow-hidden border", finish.lineStrong)}>
          <Image
            src={event?.coverImage || photos[0]?.url || "/placeholder-gallery.jpg"}
            alt={event?.title || "Gallery"}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#15110D]/85 via-[#15110D]/10 to-[#15110D]/30" />
        </div>

        {/* Wall-label plaque, overlapping the print's lower edge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className={cn(finish.mat, "relative z-10 -mt-10 md:-mt-14 mx-2 md:mx-10 max-w-xl px-6 py-6 md:px-9 md:py-7")}
        >
          <p className={cn(MONO, "text-[9px] tracking-[0.35em] uppercase", finish.matMuted)}>{finish.kicker}</p>
          <h1 className={cn(finish.display, "text-3xl md:text-5xl leading-[1.05] mt-2")}>{event?.title}</h1>
          <div className={cn("h-px w-10 my-4", finish.lineStrong, "border-t")} />
          <div className={cn(MONO, "flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[10px] tracking-widest uppercase", finish.matMuted)}>
            <span className="flex items-center gap-1.5">
              <CalendarDays size={12} />
              {event?.date &&
                new Date(event.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={12} />
              {event?.venue}
            </span>
          </div>
        </motion.div>
      </section>

      {/* Sticky Ledger Toolbar */}
      <div className={cn(INK_SOFT, "sticky top-0 z-40 backdrop-blur-md border-b", finish.line, "mt-10")}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className={cn(MONO, "text-[10px] tracking-[0.25em] uppercase", INK_TEXT_SOFT)}>
            <span className={finish.accentText}>{String(photos.length).padStart(3, "0")}</span> prints in this edition
          </div>

          <div className={cn(MONO, "flex items-center divide-x", finish.line)}>
            <button
              onClick={() => setSelectMode(!selectMode)}
              className={cn(
                "flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] px-4 first:pl-0 transition-colors cursor-pointer",
                selectMode ? finish.accentText : cn(INK_TEXT_SOFT, "hover:text-[#EDE6D9]")
              )}
            >
              <CheckSquare size={12} />
              {selectMode ? "Exit Selection" : "Select"}
            </button>

            <button
              onClick={() => setIsSharingOpen(!isSharingOpen)}
              className={cn(
                "flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] px-4 transition-colors cursor-pointer",
                INK_TEXT_SOFT,
                "hover:text-[#EDE6D9]"
              )}
            >
              <Share2 size={12} />
              Share
            </button>

            <button
              onClick={() => handleZipDownload(photos, "zip")}
              disabled={zipDownloading}
              className={cn(
                "flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] px-4 last:pr-0 transition-colors cursor-pointer disabled:opacity-50",
                finish.accentText
              )}
            >
              {zipDownloading ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Zipping {zipProgress}%
                </>
              ) : (
                <>
                  <Download size={12} />
                  Download All
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Share Panel */}
      <AnimatePresence>
        {isSharingOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={cn("overflow-hidden border-b", INK_SOFT, finish.line)}
          >
            <div className="max-w-xl mx-auto px-6 py-7 text-center space-y-4">
              <h3 className={cn(MONO, "text-[10px] uppercase tracking-[0.3em]", INK_TEXT_SOFT)}>
                Share this edition
              </h3>
              <div className="flex items-center justify-center gap-3">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    "Check out these beautiful photos: " + window.location.href
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className={cn("w-10 h-10 border flex items-center justify-center hover:opacity-80 transition-opacity", finish.line)}
                  title="WhatsApp"
                >
                  <FaWhatsapp size={16} />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noreferrer"
                  className={cn("w-10 h-10 border flex items-center justify-center hover:opacity-80 transition-opacity", finish.line)}
                  title="Facebook"
                >
                  <FaFacebook size={16} />
                </a>
                <button
                  onClick={handleCopyLink}
                  className={cn("w-10 h-10 border flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer", finish.line)}
                  title="Copy link"
                >
                  <Copy size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Directory */}
      <div className={cn(MONO, "max-w-6xl mx-auto px-5 md:px-10 pt-10 pb-6 flex items-center gap-1 flex-wrap")}>
        {categories.map((cat) => {
          if (cat === "Favorites Only" && favorites.length === 0) return null;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3.5 py-2 text-[10px] uppercase tracking-[0.18em] border-b-2 transition-all duration-300 cursor-pointer flex items-center gap-1.5",
                isActive ? cn(finish.accentText, "border-current") : cn(INK_TEXT_SOFT, "border-transparent hover:text-[#EDE6D9]")
              )}
            >
              {cat === "Favorites Only" && <Heart size={10} style={{ fill: FAVORITE, color: FAVORITE }} />}
              {cat}
              {cat === "Favorites Only" && <span className="opacity-70">({favorites.length})</span>}
            </button>
          );
        })}
      </div>

      {/* Contact Sheet — uniform mounted prints */}
      <main className="max-w-6xl mx-auto px-5 md:px-10 py-6 pb-28">
        {visiblePhotos.length === 0 ? (
          <div className={cn(finish.mat, "text-center py-16 px-6 border", finish.line)}>
            <Heart size={20} className={cn("mx-auto mb-3", finish.matMuted)} />
            <h3 className="font-medium text-sm">No prints here yet</h3>
            <p className={cn("text-xs mt-1.5", finish.matMuted)}>
              {activeCategory === "Favorites Only"
                ? "Tap the heart on any print to save it here."
                : "Nothing is filed under this category yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px sm:gap-3">
            {visiblePhotos.map((photo, index) => {
              const isFav = favorites.includes(photo._id);
              const isSel = selectedPhotoIds.includes(photo._id);
              return (
                <div key={photo._id} className={cn(finish.mat, "p-1.5 sm:p-2.5")}>
                  <div
                    onClick={() => (selectMode ? toggleSelectPhoto(photo._id) : setLightboxIndex(index))}
                    className={cn(
                      "relative aspect-[4/5] overflow-hidden border cursor-pointer group",
                      isSel ? cn("border-2", finish.lineStrong) : finish.line
                    )}
                  >
                    <img
                      src={photo.url}
                      alt={`Print ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                    />

                    <RegistrationMarks color={finish.accentHex} />

                    {/* Select-mode checkbox */}
                    {selectMode && (
                      <div className="absolute inset-0 bg-black/15 flex items-start justify-start p-3">
                        <button
                          onClick={(e) => toggleSelectPhoto(photo._id, e)}
                          className="w-6 h-6 bg-white/95 border border-black/10 flex items-center justify-center cursor-pointer"
                        >
                          {isSel ? <CheckSquare size={13} className="text-[#15110D]" /> : <Square size={13} className="text-[#15110D]/40" />}
                        </button>
                      </div>
                    )}

                    {/* Hover controls */}
                    {!selectMode && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <button
                          onClick={(e) => handleToggleFavorite(photo._id, e)}
                          className="w-9 h-9 bg-white/95 hover:bg-white flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                          title={isFav ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart size={14} style={isFav ? { fill: FAVORITE, color: FAVORITE } : { color: "#27221C" }} />
                        </button>
                        <button
                          onClick={(e) => handleSingleDownload(photo, e)}
                          className="w-9 h-9 bg-white/95 hover:bg-white flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                          title="Download print"
                        >
                          <Download size={14} className="text-[#27221C]" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Contact-sheet caption strip */}
                  <div className={cn(MONO, "flex items-center justify-between pt-1.5 px-0.5 text-[9px] uppercase tracking-widest", finish.matMuted)}>
                    <span>
                      {categoryCode(photo.category)}—{String(index + 1).padStart(3, "0")}
                    </span>
                    {isFav && <Heart size={9} style={{ fill: FAVORITE, color: FAVORITE }} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating order ticket — bulk selection */}
      <AnimatePresence>
        {selectMode && selectedPhotoIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className={cn(
              INK_SOFT,
              "fixed bottom-6 left-1/2 -translate-x-1/2 border px-6 py-4 z-40 flex items-center gap-5 max-w-md w-[92%] justify-between",
              finish.line
            )}
          >
            <div className="flex flex-col gap-0.5">
              <span className={cn(MONO, "text-[9px] uppercase tracking-[0.25em]", INK_TEXT_SOFT)}>Selection</span>
              <span className={cn(MONO, "text-xs", finish.accentText)}>
                {selectedPhotoIds.length} print{selectedPhotoIds.length === 1 ? "" : "s"} selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setSelectedPhotoIds([])}
                variant="outline"
                className={cn(MONO, "h-8 text-[10px] uppercase tracking-wider rounded-[2px] border-white/15 text-[#A89B89] hover:text-white hover:bg-white/5")}
              >
                Clear
              </Button>
              <Button
                onClick={() => {
                  const selPhotosList = photos.filter((p) => selectedPhotoIds.includes(p._id));
                  handleZipDownload(selPhotosList, "bulk");
                }}
                disabled={zipDownloading}
                className={cn(finish.accentBtn, MONO, "h-8 text-[10px] uppercase tracking-wider rounded-[2px] px-4 flex items-center gap-1.5 border-0")}
              >
                {zipDownloading ? (
                  <>
                    <Loader2 size={11} className="animate-spin" />
                    Zipping
                  </>
                ) : (
                  <>
                    <Download size={11} />
                    Download
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox — viewing room */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0C0906]/98 flex flex-col items-center justify-between p-4"
          >
            <div className={cn(MONO, "w-full max-w-6xl flex items-center justify-between py-2 text-[10px] uppercase tracking-[0.2em]", INK_TEXT_SOFT)}>
              <span>
                Plate {String(lightboxIndex + 1).padStart(3, "0")} / {String(visiblePhotos.length).padStart(3, "0")}
                {visiblePhotos[lightboxIndex].category && (
                  <span className={cn("ml-3", finish.accentText)}>{visiblePhotos[lightboxIndex].category}</span>
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleFavorite(visiblePhotos[lightboxIndex]._id)}
                  className="w-9 h-9 border border-white/15 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer"
                  title="Favorite"
                >
                  <Heart
                    size={14}
                    style={
                      favorites.includes(visiblePhotos[lightboxIndex]._id)
                        ? { fill: FAVORITE, color: FAVORITE }
                        : { color: "#EDE6D9" }
                    }
                  />
                </button>
                <button
                  onClick={() => handleSingleDownload(visiblePhotos[lightboxIndex])}
                  className="w-9 h-9 border border-white/15 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer"
                  title="Download"
                >
                  <Download size={14} className="text-[#EDE6D9]" />
                </button>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="w-9 h-9 border border-white/15 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X size={14} className="text-[#EDE6D9]" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 w-full flex items-center justify-center gap-4">
              <button
                onClick={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : visiblePhotos.length - 1))}
                className="absolute left-1 md:left-6 z-10 w-9 h-9 flex items-center justify-center text-[#A89B89] hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft size={22} />
              </button>

              <div className={cn("relative max-w-4xl max-h-[72vh] w-full h-full flex items-center justify-center border p-2", finish.line)}>
                <img
                  src={visiblePhotos[lightboxIndex].url}
                  alt="Selected print, enlarged"
                  className="max-w-full max-h-full object-contain select-none"
                />
              </div>

              <button
                onClick={() => setLightboxIndex((prev) => (prev !== null && prev < visiblePhotos.length - 1 ? prev + 1 : 0))}
                className="absolute right-1 md:right-6 z-10 w-9 h-9 flex items-center justify-center text-[#A89B89] hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            <div className={cn(MONO, "text-[#5C5246] text-[9px] tracking-[0.25em] uppercase py-4 select-none")}>
              {branding.brandName || "New Avathar Photography"} • {event?.title?.toUpperCase()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Closing plaque */}
      <footer className={cn(INK_SOFT, "border-t py-16 text-center", finish.line)}>
        <h2 className={cn(finish.display, "text-lg tracking-[0.2em] uppercase")}>{branding.brandName || "New Avathar"}</h2>
        <p className={cn(MONO, "text-[9px] tracking-[0.3em] uppercase mb-8 mt-2", finish.accentText)}>
          Archival Prints, Delivered Privately
        </p>

        <div className="flex items-center justify-center gap-3 mb-8">
          {branding.whatsappNumber && (
            <a
              href={`https://wa.me/${branding.whatsappNumber.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className={cn("w-9 h-9 border flex items-center justify-center text-[#A89B89] hover:text-white transition-colors", finish.line)}
            >
              <FaWhatsapp size={15} />
            </a>
          )}
          {branding.instagramLink && (
            <a
              href={branding.instagramLink}
              target="_blank"
              rel="noreferrer"
              className={cn("w-9 h-9 border flex items-center justify-center text-[#A89B89] hover:text-white transition-colors", finish.line)}
            >
              <FaInstagram size={15} />
            </a>
          )}
          {branding.facebookLink && (
            <a
              href={branding.facebookLink}
              target="_blank"
              rel="noreferrer"
              className={cn("w-9 h-9 border flex items-center justify-center text-[#A89B89] hover:text-white transition-colors", finish.line)}
            >
              <FaFacebook size={15} />
            </a>
          )}
        </div>

        <p className={cn(MONO, "text-[9px] tracking-widest uppercase text-[#5C5246]")}>
          {branding.footerText || `© ${new Date().getFullYear()} New Avathar Photography. All rights reserved.`}
        </p>
      </footer>
    </div>
  );
}