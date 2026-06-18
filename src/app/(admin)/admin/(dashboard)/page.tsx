"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus, Camera, ImageIcon, CalendarDays, CheckCircle2,
  Copy, ChevronRight, Eye, Download, Users, Activity,
  Lock, Unlock, MapPin, FolderSync, TrendingUp, Heart,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ClientDetails {
  brideName?: string; groomName?: string; personName?: string;
  gender?: "Bride" | "Groom"; motherName?: string; fatherName?: string;
  celebrantName?: string; companyName?: string;
}
interface EventType {
  _id: string; title: string; eventType: string; date: string; venue: string;
  slug: string; status: "Draft" | "Editing" | "Delivered" | "Archived";
  template: string; isPasswordProtected: boolean; photoCount: number;
  clientDetails?: ClientDetails;
}
interface DashboardMetrics {
  totalEvents: number; activeEvents: number; draftEvents: number;
  deliveredEvents: number; archivedEvents: number; totalPhotos: number;
  totalClients: number; totalDownloads: number; totalViews: number;
}
interface RecentActivity {
  type: string; description: string; time: string; metadata?: any;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getEventClientName(event: EventType): string {
  const d = event.clientDetails;
  if (!d) return event.title;
  if (["Wedding", "Pre-Wedding", "Engagement", "Reception"].includes(event.eventType) && d.brideName && d.groomName)
    return `${d.brideName} & ${d.groomName}`;
  if (["Mehndi", "Portrait"].includes(event.eventType) && d.personName) return d.personName;
  if (event.eventType === "Maternity" && d.motherName)
    return d.fatherName ? `${d.motherName} & ${d.fatherName}` : d.motherName;
  if (event.eventType === "Birthday" && d.celebrantName) return d.celebrantName;
  if (event.eventType === "Corporate" && d.companyName) return d.companyName;
  return event.title;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color = "default" }: {
  label: string; value: string | number; icon: any;
  color?: "default" | "blue" | "emerald" | "amber" | "rose" | "violet";
}) {
  const colorMap = {
    default: { bg: "bg-muted/60",      icon: "bg-muted text-muted-foreground",         border: "border-border" },
    blue:    { bg: "bg-blue-50/60",    icon: "bg-blue-100 text-blue-600",              border: "border-blue-100" },
    emerald: { bg: "bg-emerald-50/60", icon: "bg-emerald-100 text-emerald-600",        border: "border-emerald-100" },
    amber:   { bg: "bg-amber-50/60",   icon: "bg-amber-100 text-amber-600",            border: "border-amber-100" },
    rose:    { bg: "bg-rose-50/60",    icon: "bg-rose-100 text-rose-600",              border: "border-rose-100" },
    violet:  { bg: "bg-violet-50/60",  icon: "bg-violet-100 text-violet-600",          border: "border-violet-100" },
  };
  const c = colorMap[color];
  return (
    <div className={cn("rounded-xl border p-4 flex items-center gap-4 transition-all duration-200 hover:shadow-sm", c.bg, c.border)}>
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", c.icon)}>
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-foreground tracking-tight leading-none">{value}</p>
        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-1 truncate">{label}</p>
      </div>
    </div>
  );
}

// ─── Event Card ────────────────────────────────────────────────────────────────
function EventCard({ event, onCopy }: { event: EventType; onCopy: (slug: string) => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(event.slug);
    setCopied(true);
    toast.success("Public gallery link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const typeColor: Record<string, string> = {
    Wedding:      "bg-amber-100 text-amber-800",
    "Pre-Wedding":"bg-violet-100 text-violet-800",
    Engagement:   "bg-pink-100 text-pink-800",
    Reception:    "bg-rose-100 text-rose-800",
    Mehndi:       "bg-emerald-100 text-emerald-800",
    Portrait:     "bg-sky-100 text-sky-800",
    Maternity:    "bg-blue-100 text-blue-800",
    Birthday:     "bg-indigo-100 text-indigo-800",
    Corporate:    "bg-slate-100 text-slate-800",
  };
  const statusDot: Record<string, string> = {
    Draft:     "bg-slate-400",
    Editing:   "bg-amber-400",
    Delivered: "bg-emerald-500",
    Archived:  "bg-red-400",
  };
  const statusText: Record<string, string> = {
    Draft:     "text-slate-600",
    Editing:   "text-amber-700",
    Delivered: "text-emerald-700",
    Archived:  "text-red-700",
  };

  const displayName = getEventClientName(event);
  const tagCls = typeColor[event.eventType] ?? "bg-slate-100 text-slate-800";
  const dotCls = statusDot[event.status] ?? "bg-slate-400";
  const txtCls = statusText[event.status] ?? "text-slate-600";

  return (
    <Card className="group overflow-hidden border-border flex flex-col hover:shadow-md hover:border-primary/20 transition-all duration-200">
      <CardHeader className="p-4 pb-3 space-y-3">
        {/* Top row: type badge + status */}
        <div className="flex items-center justify-between gap-2">
          <span className={cn("text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full", tagCls)}>
            {event.eventType}
          </span>
          <span className={cn("flex items-center gap-1.5 text-[10px] font-semibold", txtCls)}>
            <span className={cn("w-1.5 h-1.5 rounded-full", dotCls)} />
            {event.status}
          </span>
        </div>

        {/* Name */}
        <CardTitle className="text-sm font-bold text-foreground leading-snug line-clamp-2">
          {displayName}
        </CardTitle>

        {/* Meta */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <CalendarDays size={11} className="text-muted-foreground/60 flex-shrink-0" />
            {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
            <MapPin size={11} className="text-muted-foreground/60 flex-shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Photo count + lock */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            <ImageIcon size={9} /> {event.photoCount} photos
          </span>
          {event.isPasswordProtected ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              <Lock size={9} /> Protected
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <Unlock size={9} /> Public
            </span>
          )}
        </div>
      </CardHeader>

      <CardFooter className="p-3 pt-2 border-t border-border bg-muted/20 flex gap-2 mt-auto">
        <Link
          href={`/admin/event/${event._id}`}
          className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "flex-1 text-xs font-semibold")}
        >
          Manage
          <ChevronRight size={13} className="ml-0.5" />
        </Link>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="icon"
          className="w-8 h-8 border-border cursor-pointer flex-shrink-0 hover:bg-primary/10 hover:border-primary/30"
          title="Copy public gallery link"
        >
          {copied
            ? <CheckCircle2 size={13} className="text-emerald-500" strokeWidth={2.5} />
            : <Copy size={13} strokeWidth={2} />}
        </Button>
      </CardFooter>
    </Card>
  );
}

// ─── Skeleton Loaders ─────────────────────────────────────────────────────────
function StatSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4 flex items-center gap-4 animate-pulse">
      <div className="w-10 h-10 rounded-lg bg-muted flex-shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="h-5 w-12 bg-muted rounded" />
        <div className="h-2.5 w-20 bg-muted rounded" />
      </div>
    </div>
  );
}
function CardSkeleton() {
  return (
    <Card className="overflow-hidden border-border p-4 space-y-3 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="w-16 h-4 bg-muted rounded-full" />
        <div className="w-14 h-3 bg-muted rounded-full" />
      </div>
      <div className="w-3/4 h-4 bg-muted rounded" />
      <div className="space-y-1.5">
        <div className="w-24 h-3 bg-muted rounded" />
        <div className="w-32 h-3 bg-muted rounded" />
      </div>
      <div className="h-px bg-border" />
      <div className="flex gap-2">
        <div className="flex-1 h-8 bg-muted rounded-md" />
        <div className="w-8 h-8 bg-muted rounded-md flex-shrink-0" />
      </div>
    </Card>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [events, setEvents]               = useState<EventType[]>([]);
  const [metrics, setMetrics]             = useState<DashboardMetrics | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [statusFilter, setStatusFilter]   = useState("All");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/admin/dashboard");
        if (r.ok) { const d = await r.json(); setMetrics(d.metrics); setRecentActivity(d.recentActivity || []); }
      } finally { setLoadingMetrics(false); }
      try {
        const r = await fetch("/api/events");
        if (r.ok) { const d = await r.json(); if (d.events) setEvents(d.events); }
      } catch { toast.error("Failed to load events."); }
      finally { setLoadingEvents(false); }
    })();
  }, []);

  const copyLink = (slug: string) =>
    navigator.clipboard.writeText(`${window.location.origin}/gallery/${slug}`);

  const filteredEvents = statusFilter === "All"
    ? events
    : events.filter(e => e.status === statusFilter);

  return (
    <div className="max-w-6xl mx-auto space-y-7 select-none">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Overview</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        </div>
        <Link
          href="/admin/create"
          className={cn(buttonVariants({ variant: "default" }), "text-xs font-bold uppercase tracking-wider px-5 h-9")}
        >
          <Plus size={14} strokeWidth={2.75} className="mr-1.5" />
          New Event
        </Link>
      </div>

      {/* ── Metrics Grid — 4 primary + 4 secondary in one unified 4-col grid ── */}
      {loadingMetrics ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <StatSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Events"     value={metrics?.totalEvents ?? 0}     icon={Camera}      color="blue" />
          <StatCard label="Active Editing"   value={metrics?.activeEvents ?? 0}    icon={FolderSync}  color="amber" />
          <StatCard label="Delivered"        value={metrics?.deliveredEvents ?? 0} icon={CheckCircle2}color="emerald" />
          <StatCard label="Total Photos"     value={metrics?.totalPhotos ?? 0}     icon={ImageIcon}   color="violet" />
          <StatCard label="Total Downloads"  value={metrics?.totalDownloads ?? 0}  icon={Download}    color="rose" />
          <StatCard label="Total Views"      value={metrics?.totalViews ?? 0}      icon={Eye}         color="blue" />
          <StatCard label="Unique Clients"   value={metrics?.totalClients ?? 0}    icon={Users}       color="emerald" />
          <StatCard label="Drafts"           value={metrics?.draftEvents ?? 0}     icon={TrendingUp}  color="default" />
        </div>
      )}

      {/* ── Main Content: Events + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Events list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground">Galleries</h2>
              <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                {filteredEvents.length}
              </span>
            </div>
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/50">
              {["All", "Draft", "Editing", "Delivered", "Archived"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "px-3 py-1 text-[10px] font-semibold rounded-md transition-all cursor-pointer",
                    statusFilter === s
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {loadingEvents ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="border border-dashed border-border rounded-xl p-12 text-center flex flex-col items-center gap-3 bg-card">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                <Camera size={18} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">No galleries found</p>
                <p className="text-xs text-muted-foreground mt-1">No results for "{statusFilter}"</p>
              </div>
              {statusFilter !== "All" && (
                <Button onClick={() => setStatusFilter("All")} variant="outline" size="sm" className="text-xs">
                  Clear filter
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredEvents.map(event => (
                <EventCard key={event._id} event={event} onCopy={copyLink} />
              ))}
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div className="space-y-4 lg:sticky lg:top-4">
          <div className="flex items-center gap-2">
            <Activity size={13} className="text-primary" />
            <h2 className="text-sm font-bold text-foreground">Recent Activity</h2>
          </div>

          <Card className="border-border">
            <CardContent className="p-4">
              {loadingMetrics ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-2 h-2 bg-muted rounded-full mt-1.5 flex-shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3 bg-muted rounded w-full" />
                        <div className="h-2.5 bg-muted rounded w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <p className="text-[11px] text-muted-foreground text-center py-8">No recent activity yet.</p>
              ) : (
                <div className="relative border-l border-border/70 pl-4 ml-1 space-y-5">
                  {recentActivity.map((act, idx) => {
                    const dot =
                      act.type === "favorite_added"   ? "bg-rose-400" :
                      act.type === "download_logged"  ? "bg-emerald-500" : "bg-primary";
                    return (
                      <div key={idx} className="relative">
                        <span className={cn("absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-card", dot)} />
                        <p className="text-[11px] text-foreground font-medium leading-relaxed">{act.description}</p>
                        <span className="text-[9px] text-muted-foreground font-semibold mt-0.5 block">
                          {new Date(act.time).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                          {" at "}
                          {new Date(act.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
