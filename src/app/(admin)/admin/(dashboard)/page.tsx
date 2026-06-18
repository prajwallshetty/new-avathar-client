"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Camera,
  TrendingUp,
  ImageIcon,
  CalendarDays,
  CheckCircle2,
  Copy,
  ChevronRight,
  Eye,
  Download,
  Users,
  Activity,
  Heart,
  Lock,
  Unlock,
  MapPin,
  FolderSync
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  photoCount: number;
  clientDetails?: ClientDetails;
}

interface DashboardMetrics {
  totalEvents: number;
  activeEvents: number;
  draftEvents: number;
  deliveredEvents: number;
  archivedEvents: number;
  totalPhotos: number;
  totalClients: number;
  totalDownloads: number;
  totalViews: number;
}

interface RecentActivity {
  type: string;
  description: string;
  time: string;
  metadata?: any;
}

// ─── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  className,
}: {
  label: string;
  value: string | number;
  icon: any;
  accent?: boolean;
  className?: string;
}) {
  return (
    <Card className={cn(
      "overflow-hidden border-border transition-all duration-200 hover:shadow-md",
      accent ? "border-primary/25 bg-primary/5" : "bg-card",
      className
    )}>
      <CardContent className="p-4 flex items-center gap-3.5">
        <div className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
          accent ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
        )}>
          <Icon size={16} strokeWidth={2.25} />
        </div>
        <div>
          <p className="text-xl font-extrabold text-foreground tracking-tight leading-none mb-1">{value}</p>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper to get formatted name based on event type
function getEventClientName(event: EventType): string {
  const details = event.clientDetails;
  if (!details) return event.title;

  switch (event.eventType) {
    case "Wedding":
    case "Pre-Wedding":
    case "Engagement":
    case "Reception":
      if (details.brideName && details.groomName) {
        return `${details.brideName} & ${details.groomName}`;
      }
      break;
    case "Mehndi":
    case "Portrait":
      if (details.personName) {
        return details.personName;
      }
      break;
    case "Maternity":
      if (details.motherName) {
        return details.fatherName
          ? `${details.motherName} & ${details.fatherName}`
          : `${details.motherName}`;
      }
      break;
    case "Birthday":
      if (details.celebrantName) {
        return details.celebrantName;
      }
      break;
    case "Corporate":
      if (details.companyName) {
        return details.companyName;
      }
      break;
  }
  return event.title;
}

// ─── Event card ────────────────────────────────────────────────────────────────
function EventCard({ event, onCopy }: { event: EventType; onCopy: (slug: string) => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(event.slug);
    setCopied(true);
    toast.success("Public gallery link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const tagColors: Record<string, string> = {
    Wedding: "bg-amber-100 text-amber-800 border-amber-200/40",
    "Pre-Wedding": "bg-violet-100 text-violet-800 border-violet-200/40",
    Engagement: "bg-pink-100 text-pink-800 border-pink-200/40",
    Reception: "bg-rose-100 text-rose-800 border-rose-200/40",
    Mehndi: "bg-emerald-100 text-emerald-800 border-emerald-200/40",
    Portrait: "bg-sky-100 text-sky-800 border-sky-200/40",
    Maternity: "bg-blue-100 text-blue-800 border-blue-200/40",
    Birthday: "bg-indigo-100 text-indigo-800 border-indigo-200/40",
    Corporate: "bg-slate-100 text-slate-800 border-slate-200/40",
  };

  const statusColors: Record<string, string> = {
    Draft: "bg-slate-100 text-slate-700 border-slate-200/50",
    Editing: "bg-amber-100 text-amber-700 border-amber-200/50",
    Delivered: "bg-emerald-100 text-emerald-700 border-emerald-200/50",
    Archived: "bg-red-100 text-red-700 border-red-200/50",
  };

  const tagClass = tagColors[event.eventType] ?? "bg-slate-100 text-slate-800 border-slate-200/40";
  const statusClass = statusColors[event.status] ?? "bg-slate-100 text-slate-700 border-slate-200/50";
  const displayName = getEventClientName(event);

  return (
    <Card className="overflow-hidden border-border flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-muted-foreground/25">
      <CardHeader className="p-4 pb-2.5 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className={cn("text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border", tagClass)}>
            {event.eventType}
          </span>
          <span className={cn("text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border", statusClass)}>
            {event.status}
          </span>
        </div>

        <CardTitle className="text-sm font-bold text-foreground tracking-tight leading-snug line-clamp-2">
          {displayName}
        </CardTitle>

        <div className="flex flex-col gap-1 text-[11px] text-muted-foreground font-medium">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={12} className="flex-shrink-0 text-muted-foreground/60" />
            {new Date(event.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1.5 truncate">
            <MapPin size={12} className="flex-shrink-0 text-muted-foreground/60" />
            {event.venue}
          </span>
        </div>

        <div className="flex items-center gap-1.5 pt-1">
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-md">
            <ImageIcon size={10} className="text-muted-foreground/70" />
            {event.photoCount} photos
          </span>
          {event.isPasswordProtected ? (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
              <Lock size={9} />
              Locked
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
              <Unlock size={9} />
              Public
            </span>
          )}
        </div>
      </CardHeader>

      <CardFooter className="p-3.5 pt-2.5 border-t border-border flex gap-1.5 bg-muted/10">
        <Link
          href={`/admin/event/${event._id}`}
          className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "flex-1 text-xs font-semibold h-8.5")}
        >
          Manage Gallery
          <ChevronRight size={13} className="ml-0.5" />
        </Link>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="icon"
          className="w-8.5 h-8.5 border-border hover:bg-accent text-muted-foreground hover:text-foreground flex-shrink-0 cursor-pointer"
          title="Copy public link"
        >
          {copied ? (
            <CheckCircle2 size={14} className="text-emerald-500" strokeWidth={2.5} />
          ) : (
            <Copy size={13} strokeWidth={2} />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const fetchData = async () => {
    try {
      // Fetch Metrics & Activities
      const dashboardRes = await fetch("/api/admin/dashboard");
      if (dashboardRes.ok) {
        const dData = await dashboardRes.json();
        setMetrics(dData.metrics);
        setRecentActivity(dData.recentActivity || []);
      }
    } catch (err) {
      console.error("Dashboard statistics load failed:", err);
    } finally {
      setLoadingMetrics(false);
    }

    try {
      // Fetch Events List
      const eventsRes = await fetch("/api/events");
      if (eventsRes.ok) {
        const eData = await eventsRes.json();
        if (eData.events) setEvents(eData.events);
      }
    } catch (error) {
      console.error("Events load failed:", error);
      toast.error("Failed to load events.");
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/gallery/${slug}`;
    navigator.clipboard.writeText(url);
  };

  const filteredEvents = events.filter((e) => {
    if (statusFilter === "All") return true;
    return e.status === statusFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">Real-time gallery analytics and event management portal.</p>
        </div>
        <Link
          href="/admin/create"
          className={cn(buttonVariants({ variant: "default" }), "shadow-xs text-xs font-bold uppercase tracking-wider px-4 h-9.5")}
        >
          <Plus size={14} strokeWidth={2.75} className="mr-1" />
          Create Event
        </Link>
      </div>

      {/* Analytics Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
        <StatCard label="Total Events" value={metrics?.totalEvents ?? 0} icon={Camera} accent />
        <StatCard label="Active (Editing)" value={metrics?.activeEvents ?? 0} icon={FolderSync} />
        <StatCard label="Draft Status" value={metrics?.draftEvents ?? 0} icon={CheckCircle2} />
        <StatCard label="Total Downloads" value={metrics?.totalDownloads ?? 0} icon={Download} />
        <StatCard label="Total Views" value={metrics?.totalViews ?? 0} icon={Eye} className="col-span-2 sm:col-span-1" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <StatCard label="Delivered" value={metrics?.deliveredEvents ?? 0} icon={CheckCircle2} />
        <StatCard label="Archived" value={metrics?.archivedEvents ?? 0} icon={CheckCircle2} />
        <StatCard label="Photos Uploaded" value={metrics?.totalPhotos ?? 0} icon={ImageIcon} />
        <StatCard label="Unique Clients" value={metrics?.totalClients ?? 0} icon={Users} />
      </div>

      {/* Main split sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Events List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3.5">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Galleries Directory</h2>
              <span className="text-[10px] font-bold text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full">
                {filteredEvents.length} list
              </span>
            </div>
            
            {/* Status Filter Tab Group */}
            <div className="flex flex-wrap gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/50">
              {["All", "Draft", "Editing", "Delivered", "Archived"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-2.5 py-1 text-[10px] font-semibold rounded-md transition-all cursor-pointer",
                    statusFilter === status
                      ? "bg-card text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {loadingEvents ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden border-border p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="w-16 h-3.5 bg-muted rounded-md animate-pulse" />
                    <div className="w-20 h-3 bg-muted rounded-md animate-pulse" />
                  </div>
                  <div className="w-3/4 h-4.5 bg-muted rounded-md animate-pulse" />
                  <div className="w-1/3 h-3.5 bg-muted rounded-md animate-pulse" />
                  <div className="h-[1px] bg-border" />
                  <div className="flex gap-2 justify-between pt-1">
                    <div className="w-full h-8.5 bg-muted rounded-md animate-pulse" />
                    <div className="w-8.5 h-8.5 bg-muted rounded-md animate-pulse flex-shrink-0" />
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="border border-dashed border-border rounded-xl p-10 text-center bg-card flex flex-col items-center justify-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-muted text-muted-foreground/60 flex items-center justify-center">
                <Camera size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-foreground">No events found</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs mx-auto leading-normal">
                  There are no galleries matching the selected "{statusFilter}" status filter.
                </p>
              </div>
              {statusFilter !== "All" && (
                <Button onClick={() => setStatusFilter("All")} variant="outline" size="sm" className="h-8 text-[11px]">
                  Reset filter
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredEvents.map((event) => (
                <EventCard key={event._id} event={event} onCopy={copyLink} />
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Activity Feed */}
        <div className="space-y-4 lg:sticky lg:top-4">
          <div className="flex items-center gap-2 border-b border-border pb-3.5">
            <Activity size={14} className="text-primary" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Recent Activities</h2>
          </div>

          <Card className="border-border">
            <CardContent className="p-4">
              {loadingMetrics ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-2.5 h-2.5 bg-muted rounded-full animate-pulse mt-1.5 flex-shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="w-full h-3.5 bg-muted rounded animate-pulse" />
                        <div className="w-20 h-2.5 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <p className="text-[11px] text-muted-foreground text-center py-6">No recent actions logged yet.</p>
              ) : (
                <div className="relative border-l border-border/80 pl-4 ml-1.5 space-y-4.5">
                  {recentActivity.map((activity, idx) => {
                    let dotColor = "bg-primary";
                    if (activity.type === "favorite_added") dotColor = "bg-rose-500";
                    if (activity.type === "download_logged") dotColor = "bg-emerald-500";

                    return (
                      <div key={idx} className="relative group">
                        {/* Bullet point indicator */}
                        <span className={cn(
                          "absolute -left-[21.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-card ring-1 ring-border",
                          dotColor
                        )} />

                        <div className="flex flex-col gap-0.5">
                          <p className="text-[11px] leading-relaxed text-foreground font-medium">
                            {activity.description}
                          </p>
                          <span className="text-[9px] text-muted-foreground font-semibold">
                            {new Date(activity.time).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                            })} at {new Date(activity.time).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
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
