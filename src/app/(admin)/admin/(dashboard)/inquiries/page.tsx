"use client";

import { useState, useEffect } from "react";
import {
  Mail, Phone, Calendar, User, Trash2, Archive, CheckCircle2,
  Clock, Search, ArrowUpDown, MessageSquare, AlertCircle, Loader2,
  ExternalLink, Inbox
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface InquiryType {
  _id: string;
  name: string;
  phone: string;
  email: string;
  date?: string;
  type: "wedding" | "pre-wedding" | "portrait" | "event" | "other";
  message: string;
  status: "New" | "Replied" | "Archived";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<InquiryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"All" | "New" | "Replied" | "Archived">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryType | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/admin/inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      } else {
        toast.error("Failed to load inquiries.");
      }
    } catch (error) {
      console.error("Fetch inquiries error:", error);
      toast.error("An error occurred while fetching inquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: "New" | "Replied" | "Archived") => {
    setUpdatingStatus(id);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        const data = await res.json();
        setInquiries(prev => prev.map(inq => inq._id === id ? data.inquiry : inq));
        if (selectedInquiry?._id === id) {
          setSelectedInquiry(data.inquiry);
        }
        toast.success(`Inquiry marked as ${status}`);
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update status.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${selectedInquiry._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: adminNotes })
      });

      if (res.ok) {
        const data = await res.json();
        setInquiries(prev => prev.map(inq => inq._id === selectedInquiry._id ? data.inquiry : inq));
        setSelectedInquiry(data.inquiry);
        toast.success("Notes saved successfully.");
      } else {
        toast.error("Failed to save notes.");
      }
    } catch (error) {
      console.error("Notes save error:", error);
      toast.error("Failed to save notes.");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this inquiry?")) return;

    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setInquiries(prev => prev.filter(inq => inq._id !== id));
        if (selectedInquiry?._id === id) {
          setSelectedInquiry(null);
        }
        toast.success("Inquiry deleted successfully.");
      } else {
        toast.error("Failed to delete inquiry.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete inquiry.");
    }
  };

  const openInquiryDetail = (inq: InquiryType) => {
    setSelectedInquiry(inq);
    setAdminNotes(inq.notes || "");
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      wedding: "Wedding",
      "pre-wedding": "Pre-Wedding",
      portrait: "Portrait",
      event: "Commercial Event",
      other: "Other"
    };
    return labels[type] || type;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Replied":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Archived":
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  // Filter and search
  const filteredInquiries = inquiries
    .filter(inq => statusFilter === "All" || inq.status === statusFilter)
    .filter(inq => {
      const query = searchQuery.toLowerCase();
      return (
        inq.name.toLowerCase().includes(query) ||
        inq.email.toLowerCase().includes(query) ||
        inq.phone.toLowerCase().includes(query) ||
        inq.message.toLowerCase().includes(query)
      );
    });

  return (
    <div className="max-w-6xl mx-auto space-y-7">
      
      {/* Page Header */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Client Requests
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Contact Inquiries
        </h1>
      </div>

      {/* Filters & Actions Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/50 self-start">
          {(["All", "New", "Replied", "Archived"] as const).map((s) => (
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
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse border-border">
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-48 bg-muted rounded" />
                </div>
                <div className="w-16 h-5 bg-muted rounded-full" />
                <div className="w-8 h-8 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-16 text-center flex flex-col items-center gap-3 bg-card">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
            <Inbox size={22} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">No inquiries found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {searchQuery ? "No results match your search query." : `There are no "${statusFilter}" inquiries.`}
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
          {filteredInquiries.map((inq) => (
            <Card
              key={inq._id}
              onClick={() => openInquiryDetail(inq)}
              className="group border border-border hover:border-primary/20 hover:shadow-sm cursor-pointer transition-all duration-200 bg-card overflow-hidden"
            >
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {inq.name}
                    </h3>
                    <span className={cn("text-[9px] font-mono border px-2 py-0.5 rounded-full uppercase tracking-wider", getStatusBadgeClass(inq.status))}>
                      {inq.status}
                    </span>
                    <span className="text-[10px] bg-muted text-muted-foreground border border-border/50 px-2 py-0.5 rounded">
                      {getEventTypeLabel(inq.type)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail size={11} />
                      {inq.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={11} />
                      {inq.phone}
                    </span>
                    {inq.date && (
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(inq.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground/80 line-clamp-1 pt-1 font-inter italic">
                    "{inq.message}"
                  </p>
                </div>

                {/* Date submitted & Actions */}
                <div className="flex items-center gap-4 sm:self-center self-end flex-shrink-0">
                  <span className="text-[10px] font-semibold text-muted-foreground/60 flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(inq.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    {inq.status !== "Replied" && (
                      <button
                        onClick={() => handleUpdateStatus(inq._id, "Replied")}
                        disabled={updatingStatus === inq._id}
                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all cursor-pointer"
                        title="Mark as Replied"
                      >
                        <CheckCircle2 size={13} />
                      </button>
                    )}
                    {inq.status !== "Archived" && (
                      <button
                        onClick={() => handleUpdateStatus(inq._id, "Archived")}
                        disabled={updatingStatus === inq._id}
                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10 hover:border-orange-500/20 transition-all cursor-pointer"
                        title="Archive Inquiry"
                      >
                        <Archive size={13} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteInquiry(inq._id)}
                      className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-all cursor-pointer"
                      title="Delete Inquiry"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Inquiry Detail Dialog */}
      <Dialog open={selectedInquiry !== null} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
        <DialogContent className="max-w-lg bg-card border border-border/80 shadow-2xl p-6 text-foreground">
          {selectedInquiry && (
            <>
              <DialogHeader className="border-b border-border pb-4 mb-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <DialogTitle className="text-lg font-bold text-foreground">
                      Inquiry Details
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-1">
                      Submitted on {new Date(selectedInquiry.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </DialogDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[10px] font-mono border px-2.5 py-0.5 rounded-full uppercase tracking-wider", getStatusBadgeClass(selectedInquiry.status))}>
                      {selectedInquiry.status}
                    </span>
                    <span className="text-[10px] bg-muted border border-border px-2 py-0.5 rounded text-muted-foreground font-semibold">
                      {getEventTypeLabel(selectedInquiry.type)}
                    </span>
                  </div>
                </div>
              </DialogHeader>

              {/* Inquiry details */}
              <div className="space-y-4 font-inter text-xs">
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg border border-border/40">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Client Name</span>
                    <span className="font-bold flex items-center gap-1 text-foreground">
                      <User size={12} className="text-muted-foreground" />
                      {selectedInquiry.name}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Event Date</span>
                    <span className="font-bold flex items-center gap-1 text-foreground">
                      <Calendar size={12} className="text-muted-foreground" />
                      {selectedInquiry.date ? new Date(selectedInquiry.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      }) : "TBD"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Email Address</span>
                    <a href={`mailto:${selectedInquiry.email}`} className="font-bold text-primary hover:underline flex items-center gap-1">
                      <Mail size={12} />
                      {selectedInquiry.email}
                      <ExternalLink size={10} className="ml-0.5 opacity-50" />
                    </a>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Phone Number</span>
                    <a href={`tel:${selectedInquiry.phone}`} className="font-bold text-primary hover:underline flex items-center gap-1">
                      <Phone size={12} />
                      {selectedInquiry.phone}
                      <ExternalLink size={10} className="ml-0.5 opacity-50" />
                    </a>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Message / Inquiry Details</span>
                  <div className="bg-card border border-border/60 rounded-lg p-4 font-inter leading-relaxed text-foreground whitespace-pre-wrap max-h-40 overflow-y-auto italic">
                    "{selectedInquiry.message}"
                  </div>
                </div>

                {/* Admin Notes */}
                <div className="space-y-1.5 pt-2 border-t border-border/60">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Internal Admin Notes</span>
                    <button
                      onClick={handleSaveNotes}
                      disabled={savingNotes}
                      className="text-[10px] text-primary hover:text-primary/80 disabled:opacity-50 font-bold"
                    >
                      {savingNotes ? "Saving..." : "Save Notes"}
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Add internal notes here (e.g. quoted wedding pricing, status of response, follow up date)..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full bg-muted/40 border border-border rounded-lg p-3 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-all font-inter resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <DialogFooter className="mt-6 flex flex-wrap justify-between items-center border-t border-border pt-4 -mx-6 -mb-6 bg-muted/20 px-6 rounded-b-xl gap-2">
                <Button
                  onClick={() => handleDeleteInquiry(selectedInquiry._id)}
                  variant="destructive"
                  size="sm"
                  className="mr-auto font-bold text-xs"
                >
                  <Trash2 size={13} className="mr-1" />
                  Delete
                </Button>

                <div className="flex items-center gap-2">
                  {selectedInquiry.status !== "Replied" && (
                    <Button
                      onClick={() => handleUpdateStatus(selectedInquiry._id, "Replied")}
                      variant="secondary"
                      size="sm"
                      className="font-bold text-xs"
                    >
                      <CheckCircle2 size={13} className="mr-1 text-emerald-500" />
                      Mark Replied
                    </Button>
                  )}
                  {selectedInquiry.status !== "Archived" && (
                    <Button
                      onClick={() => handleUpdateStatus(selectedInquiry._id, "Archived")}
                      variant="outline"
                      size="sm"
                      className="font-bold text-xs"
                    >
                      <Archive size={13} className="mr-1 text-orange-400" />
                      Archive
                    </Button>
                  )}
                  {selectedInquiry.status !== "New" && (
                    <Button
                      onClick={() => handleUpdateStatus(selectedInquiry._id, "New")}
                      variant="outline"
                      size="sm"
                      className="font-bold text-xs"
                    >
                      <Clock size={13} className="mr-1 text-blue-400" />
                      Set New
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
