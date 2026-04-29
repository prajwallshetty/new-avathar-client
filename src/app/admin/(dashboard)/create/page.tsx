"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle, ChevronDown } from "lucide-react";

const EVENT_TYPES = ["Wedding", "Pre-Wedding", "Mehndi / Sangeet", "Portraits"];

export default function CreateEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    brideName: "",
    groomName: "",
    eventType: "Wedding",
    date: "",
    template: "default",
  });

  const set = (key: string, val: string) =>
    setFormData((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/event/${data.event._id}`);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create event");
      }
    } catch {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-root">
      {/* Back */}
      <Link href="/admin" className="create-back">
        <ArrowLeft size={14} strokeWidth={1.75} />
        Back to Dashboard
      </Link>

      {/* Heading */}
      <div className="create-heading">
        <h1 className="create-title">Create New Event</h1>
        <p className="create-sub">Set up a new client gallery session</p>
      </div>

      {/* Card */}
      <div className="create-card">
        {error && (
          <div className="create-error">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2 className="form-section-title">Client Details</h2>
            <div className="form-grid-2">
              <div className="form-field">
                <label className="form-label" htmlFor="bride">Bride Name</label>
                <input
                  id="bride"
                  type="text"
                  required
                  value={formData.brideName}
                  onChange={(e) => set("brideName", e.target.value)}
                  className="form-input"
                  placeholder="e.g. Ananya"
                />
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="groom">Groom Name</label>
                <input
                  id="groom"
                  type="text"
                  required
                  value={formData.groomName}
                  onChange={(e) => set("groomName", e.target.value)}
                  className="form-input"
                  placeholder="e.g. Rahul"
                />
              </div>
            </div>
          </div>

          <div className="form-divider" />

          <div className="form-section">
            <h2 className="form-section-title">Event Details</h2>
            <div className="form-grid-2">
              <div className="form-field">
                <label className="form-label" htmlFor="eventType">Event Type</label>
                <div className="form-select-wrap">
                  <select
                    id="eventType"
                    required
                    value={formData.eventType}
                    onChange={(e) => set("eventType", e.target.value)}
                    className="form-input form-select"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="form-select-arrow" />
                </div>
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="date">Event Date</label>
                <input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => set("date", e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-divider" />

          <div className="form-actions">
            <Link href="/admin" className="btn-ghost">Cancel</Link>
            <button type="submit" disabled={loading} className="btn-gold">
              {loading ? (
                <>
                  <Loader2 size={14} className="spin-icon" />
                  Creating…
                </>
              ) : (
                "Create Event"
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .create-root { max-width: 680px; margin: 0 auto; }
        .create-back {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #50506a;
          text-decoration: none;
          transition: color 0.15s;
          margin-bottom: 1.75rem;
        }
        .create-back:hover { color: #c8c8dc; }
        .create-heading { margin-bottom: 1.75rem; }
        .create-title {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 1.75rem;
          font-weight: 500;
          color: #f0f0f8;
          margin: 0 0 0.25rem 0;
          letter-spacing: 0.02em;
        }
        .create-sub { font-size: 0.875rem; color: #50506a; margin: 0; }
        .create-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.25);
          color: #f87171;
          padding: 0.75rem 1rem;
          margin-bottom: 1.5rem;
          font-size: 0.8125rem;
          border-radius: 6px;
        }
        .create-card {
          background: #0e0e18;
          border: 1px solid #1a1a28;
          border-radius: 8px;
          overflow: hidden;
        }
        .form-section { padding: 1.75rem 2rem; }
        .form-section-title {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 600;
          color: #50506a;
          margin: 0 0 1.25rem 0;
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        @media (max-width: 520px) { .form-grid-2 { grid-template-columns: 1fr; } }
        .form-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-label {
          font-size: 0.6875rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6060a0;
          font-weight: 500;
        }
        .form-input {
          background: #12121e;
          border: 1px solid #1e1e2e;
          border-radius: 5px;
          padding: 0.625rem 0.875rem;
          color: #e8e8f4;
          font-size: 0.875rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          width: 100%;
          box-sizing: border-box;
        }
        .form-input:focus {
          border-color: rgba(195,163,100,0.4);
          box-shadow: 0 0 0 3px rgba(195,163,100,0.06);
        }
        .form-input::placeholder { color: #2e2e44; }
        .form-input::-webkit-calendar-picker-indicator { filter: invert(0.4); cursor: pointer; }
        .form-select-wrap { position: relative; }
        .form-select {
          appearance: none;
          -webkit-appearance: none;
          padding-right: 2.5rem;
          cursor: pointer;
        }
        .form-select-arrow {
          position: absolute;
          right: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          color: #50506a;
          pointer-events: none;
        }
        .form-select option { background: #12121e; }
        .form-divider { height: 1px; background: #14141e; }
        .form-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          padding: 1.25rem 2rem;
        }
        .btn-ghost {
          padding: 0.5625rem 1.125rem;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #50506a;
          background: none;
          border: 1px solid #1e1e2e;
          border-radius: 5px;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .btn-ghost:hover { border-color: #2a2a3a; color: #c8c8dc; background: #14141e; }
        .btn-gold {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5625rem 1.375rem;
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          background: linear-gradient(135deg, #c3a364, #a8893f);
          color: #0a0a0e;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.15s, transform 0.1s, box-shadow 0.15s;
          box-shadow: 0 2px 8px rgba(195,163,100,0.2);
        }
        .btn-gold:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(195,163,100,0.25);
        }
        .btn-gold:disabled { opacity: 0.5; cursor: not-allowed; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin-icon { animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
}
