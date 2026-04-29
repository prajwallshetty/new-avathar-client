"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Link2,
  Camera,
  TrendingUp,
  ImageIcon,
  CalendarDays,
  CheckCircle2,
  Copy,
} from "lucide-react";

interface EventType {
  _id: string;
  brideName: string;
  groomName: string;
  eventType: string;
  date: string;
  slug: string;
  images: any[];
}

// ─── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: any;
  accent?: boolean;
}) {
  return (
    <div className={`stat-card${accent ? " stat-card-accent" : ""}`}>
      <div className="stat-icon">
        <Icon size={18} strokeWidth={1.5} />
      </div>
      <div className="stat-body">
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}

// ─── Event card ────────────────────────────────────────────────────────────────
function EventCard({ event, onCopy }: { event: EventType; onCopy: (slug: string) => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(event.slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tagColors: Record<string, string> = {
    Wedding: "tag-wedding",
    "Pre-Wedding": "tag-prewedding",
    Mehndi: "tag-mehndi",
    Portraits: "tag-portraits",
  };

  return (
    <div className="event-card">
      {/* Top accent line */}
      <div className="event-card-accent" />

      <div className="event-card-body">
        {/* Header */}
        <div className="event-card-header">
          <span className={`event-tag ${tagColors[event.eventType] ?? "tag-default"}`}>
            {event.eventType}
          </span>
          <span className="event-date">
            <CalendarDays size={11} strokeWidth={1.5} />
            {new Date(event.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Names */}
        <h3 className="event-couple">
          {event.brideName} <span className="event-amp">&</span> {event.groomName}
        </h3>

        {/* Stats row */}
        <div className="event-meta">
          <span className="event-meta-chip">
            <ImageIcon size={11} strokeWidth={1.5} />
            {event.images.length} photos
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="event-card-actions">
        <Link
          href={`/admin/event/${event._id}`}
          className="event-btn event-btn-primary"
        >
          Manage Gallery
        </Link>
        <button
          onClick={handleCopy}
          className="event-btn event-btn-icon"
          title="Copy public link"
        >
          {copied ? (
            <CheckCircle2 size={14} strokeWidth={2} style={{ color: "#4ade80" }} />
          ) : (
            <Copy size={14} strokeWidth={1.75} />
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.events) setEvents(data.events);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/event/${slug}`;
    navigator.clipboard.writeText(url);
  };

  const totalPhotos = events.reduce((acc, e) => acc + e.images.length, 0);

  return (
    <div className="dash-root">
      {/* Page header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-subtitle">Manage your client galleries and event sessions.</p>
        </div>
        <Link href="/admin/create" className="btn-primary">
          <Plus size={15} strokeWidth={2} />
          New Event
        </Link>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        <StatCard label="Total Events" value={events.length} icon={Camera} accent />
        <StatCard label="Total Photos" value={totalPhotos} icon={ImageIcon} />
        <StatCard
          label="This Month"
          value={
            events.filter((e) => {
              const d = new Date(e.date);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length
          }
          icon={TrendingUp}
        />
      </div>

      {/* Events section */}
      <div className="section-header">
        <h2 className="section-title">All Events</h2>
        <span className="section-count">{events.length} total</span>
      </div>

      {loading ? (
        <div className="loading-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-line short" />
              <div className="skeleton-line" />
              <div className="skeleton-line medium" />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Camera size={28} strokeWidth={1} />
          </div>
          <h3 className="empty-title">No events yet</h3>
          <p className="empty-desc">
            Create your first client gallery to get started with managing photo sessions.
          </p>
          <Link href="/admin/create" className="btn-primary">
            <Plus size={14} />
            Create First Event
          </Link>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard key={event._id} event={event} onCopy={copyLink} />
          ))}
        </div>
      )}

      <style>{`
        /* ── Root ──────────────────────────────────────────────────── */
        .dash-root {
          max-width: 1200px;
          margin: 0 auto;
        }
        .dash-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .dash-title {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 1.875rem;
          font-weight: 500;
          color: #f0f0f8;
          letter-spacing: 0.02em;
          margin: 0 0 0.25rem 0;
        }
        .dash-subtitle {
          font-size: 0.875rem;
          color: #50506a;
          margin: 0;
        }

        /* ── Primary button ────────────────────────────────────────── */
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #c3a364, #a8893f);
          color: #0a0a0e;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.625rem 1.125rem;
          border-radius: 5px;
          text-decoration: none;
          transition: opacity 0.15s, transform 0.1s, box-shadow 0.15s;
          border: none;
          cursor: pointer;
          font-family: inherit;
          box-shadow: 0 2px 8px rgba(195,163,100,0.2);
          flex-shrink: 0;
        }
        .btn-primary:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(195,163,100,0.25);
        }

        /* ── Stat cards ────────────────────────────────────────────── */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .stat-card {
          background: #0e0e18;
          border: 1px solid #1a1a28;
          border-radius: 8px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: border-color 0.2s;
        }
        .stat-card:hover { border-color: #2a2a3a; }
        .stat-card-accent { border-color: rgba(195,163,100,0.2); }
        .stat-card-accent:hover { border-color: rgba(195,163,100,0.35); }
        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #16162a;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c3a364;
          flex-shrink: 0;
        }
        .stat-body { min-width: 0; }
        .stat-value {
          font-size: 1.5rem;
          font-weight: 600;
          color: #f0f0f8;
          margin: 0 0 2px 0;
          line-height: 1.2;
        }
        .stat-label {
          font-size: 0.75rem;
          color: #50506a;
          margin: 0;
        }

        /* ── Section ───────────────────────────────────────────────── */
        .section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: #c8c8dc;
          margin: 0;
          letter-spacing: 0.01em;
        }
        .section-count {
          font-size: 0.6875rem;
          color: #40404e;
          background: #14141e;
          border: 1px solid #1e1e2a;
          padding: 0.125rem 0.5rem;
          border-radius: 99px;
        }

        /* ── Events grid ───────────────────────────────────────────── */
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        /* ── Event card ────────────────────────────────────────────── */
        .event-card {
          background: #0e0e18;
          border: 1px solid #1a1a28;
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
        }
        .event-card:hover {
          border-color: #2a2a3a;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .event-card-accent {
          height: 2px;
          background: linear-gradient(90deg, #c3a364, transparent);
        }
        .event-card-body { padding: 1.25rem; flex: 1; }
        .event-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.875rem;
        }
        .event-tag {
          font-size: 0.625rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
          padding: 0.2rem 0.5rem;
          border-radius: 3px;
        }
        .tag-wedding { background: rgba(195,163,100,0.12); color: #c3a364; }
        .tag-prewedding { background: rgba(139,92,246,0.12); color: #a78bfa; }
        .tag-mehndi { background: rgba(34,197,94,0.1); color: #86efac; }
        .tag-portraits { background: rgba(59,130,246,0.1); color: #93c5fd; }
        .tag-default { background: rgba(255,255,255,0.06); color: #9090b0; }
        .event-date {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.6875rem;
          color: #44445a;
        }
        .event-couple {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 1.0625rem;
          font-weight: 500;
          color: #e8e8f4;
          margin: 0 0 0.75rem 0;
          line-height: 1.3;
        }
        .event-amp { color: #c3a364; margin: 0 0.25rem; }
        .event-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .event-meta-chip {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.6875rem;
          color: #50506a;
          background: #14141e;
          border: 1px solid #1e1e2a;
          padding: 0.2rem 0.5rem;
          border-radius: 99px;
        }
        .event-card-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.25rem;
          border-top: 1px solid #14141e;
        }
        .event-btn {
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 5px;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          cursor: pointer;
          text-decoration: none;
          font-family: inherit;
          border: 1px solid transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .event-btn-primary {
          flex: 1;
          padding: 0.5rem 0.875rem;
          background: #16162a;
          color: #c8c8dc;
          border-color: #202030;
          text-align: center;
        }
        .event-btn-primary:hover {
          background: #1e1e38;
          color: #f0f0f8;
          border-color: rgba(195,163,100,0.2);
        }
        .event-btn-icon {
          width: 34px;
          height: 34px;
          background: #12121e;
          color: #50506a;
          border-color: #1e1e2a;
          flex-shrink: 0;
        }
        .event-btn-icon:hover {
          background: #1a1a2a;
          color: #c8c8dc;
          border-color: #2a2a3a;
        }

        /* ── Loading skeleton ──────────────────────────────────────── */
        .loading-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        .skeleton-card {
          background: #0e0e18;
          border: 1px solid #1a1a28;
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        @keyframes shimmer {
          0% { opacity: 0.4; }
          50% { opacity: 0.7; }
          100% { opacity: 0.4; }
        }
        .skeleton-line {
          height: 12px;
          background: #1e1e2a;
          border-radius: 4px;
          animation: shimmer 1.5s ease-in-out infinite;
        }
        .skeleton-line.short { width: 40%; }
        .skeleton-line.medium { width: 70%; }

        /* ── Empty state ───────────────────────────────────────────── */
        .empty-state {
          background: #0e0e18;
          border: 1px dashed #1e1e2a;
          border-radius: 8px;
          padding: 4rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        .empty-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: #14141e;
          border: 1px solid #1e1e2a;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #30305a;
          margin-bottom: 0.25rem;
        }
        .empty-title {
          font-size: 1.0625rem;
          font-weight: 600;
          color: #c8c8dc;
          margin: 0;
        }
        .empty-desc {
          font-size: 0.875rem;
          color: #40405a;
          max-width: 360px;
          line-height: 1.6;
          margin: 0 0 0.5rem 0;
        }
      `}</style>
    </div>
  );
}
