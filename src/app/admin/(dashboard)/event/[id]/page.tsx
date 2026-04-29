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
} from "lucide-react";

export default function ManageEvent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}`);
      const data = await res.json();
      if (data.event) setEvent(data.event);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const handleUploadSuccess = async (result: any) => {
    if (result.info && result.info.secure_url) {
      const newImage = {
        url: result.info.secure_url,
        publicId: result.info.public_id,
      };
      try {
        const updatedImages = [...(event.images || []), newImage];
        const coverImage = event.coverImage || result.info.secure_url;
        await fetch(`/api/events/${eventId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images: updatedImages, coverImage }),
        });
        fetchEvent();
      } catch (err) {
        console.error("Upload save failed", err);
      }
    }
  };

  const handleDeleteImage = async (publicId: string) => {
    if (!confirm("Remove this image from the gallery?")) return;
    setDeleting(publicId);
    try {
      const updatedImages = event.images.filter(
        (img: any) => img.publicId !== publicId
      );
      await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: updatedImages }),
      });
      fetchEvent();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="manage-loading">
        <Loader2 size={28} strokeWidth={1.5} className="manage-spinner" />
        <p>Loading event…</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="manage-error">
        <AlertCircle size={28} strokeWidth={1.5} />
        <p>Event not found.</p>
        <Link href="/admin" className="btn-ghost">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="manage-root">
      {/* Back */}
      <Link href="/admin" className="manage-back">
        <ArrowLeft size={14} strokeWidth={1.75} />
        All Events
      </Link>

      {/* Header */}
      <div className="manage-header">
        <div className="manage-header-left">
          <div className="manage-tag-row">
            <span className="manage-tag">{event.eventType}</span>
            <span className="manage-meta">
              <CalendarDays size={12} strokeWidth={1.5} />
              {new Date(event.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="manage-title">
            {event.brideName} <span className="manage-amp">&</span>{" "}
            {event.groomName}
          </h1>
          <div className="manage-stats-row">
            <span className="manage-stat-chip">
              <ImageIcon size={12} strokeWidth={1.5} />
              {event.images.length} Photos
            </span>
          </div>
        </div>

        <div className="manage-header-actions">
          <Link
            href={`/event/${event.slug}`}
            target="_blank"
            className="btn-ghost-gold"
          >
            <ExternalLink size={14} strokeWidth={1.75} />
            View Gallery
          </Link>

          <CldUploadWidget
            uploadPreset="newavathar_gallery"
            onSuccess={handleUploadSuccess}
            options={{ multiple: true }}
          >
            {({ open }) => (
              <button
                onClick={() => open()}
                className="btn-gold"
                type="button"
              >
                <Upload size={14} strokeWidth={2} />
                Upload Photos
              </button>
            )}
          </CldUploadWidget>
        </div>
      </div>

      {/* Gallery */}
      {event.images.length === 0 ? (
        <div className="gallery-empty">
          <div className="gallery-empty-icon">
            <Camera size={32} strokeWidth={1} />
          </div>
          <h3 className="gallery-empty-title">No photos yet</h3>
          <p className="gallery-empty-desc">
            Upload images to populate this client&apos;s gallery. You can upload
            multiple files at once.
          </p>
          <CldUploadWidget
            uploadPreset="newavathar_gallery"
            onSuccess={handleUploadSuccess}
            options={{ multiple: true }}
          >
            {({ open }) => (
              <button onClick={() => open()} className="btn-gold" type="button">
                <Upload size={14} />
                Upload First Photos
              </button>
            )}
          </CldUploadWidget>
        </div>
      ) : (
        <div className="gallery-grid">
          {event.images.map((img: any) => (
            <div key={img.publicId} className="gallery-item">
              <Image
                src={img.url}
                alt="Gallery preview"
                fill
                className="gallery-img"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              />
              <div className="gallery-overlay">
                <button
                  onClick={() => handleDeleteImage(img.publicId)}
                  className="gallery-delete-btn"
                  title="Remove image"
                  disabled={deleting === img.publicId}
                >
                  {deleting === img.publicId ? (
                    <Loader2 size={14} className="spin-icon" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .manage-root { max-width: 1200px; margin: 0 auto; }

        /* Loading / error */
        .manage-loading, .manage-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          gap: 1rem;
          color: #50506a;
          font-size: 0.875rem;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .manage-spinner { animation: spin 1s linear infinite; }
        .spin-icon { animation: spin 0.8s linear infinite; }

        /* Back */
        .manage-back {
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
        .manage-back:hover { color: #c8c8dc; }

        /* Header */
        .manage-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .manage-tag-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.625rem;
        }
        .manage-tag {
          font-size: 0.625rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 600;
          color: #c3a364;
          background: rgba(195,163,100,0.1);
          padding: 0.2rem 0.5rem;
          border-radius: 3px;
        }
        .manage-meta {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: #44445a;
        }
        .manage-title {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 1.875rem;
          font-weight: 500;
          color: #f0f0f8;
          margin: 0 0 0.75rem 0;
          letter-spacing: 0.02em;
        }
        .manage-amp { color: #c3a364; margin: 0 0.25rem; }
        .manage-stats-row { display: flex; align-items: center; gap: 0.5rem; }
        .manage-stat-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.6875rem;
          color: #50506a;
          background: #14141e;
          border: 1px solid #1e1e2a;
          padding: 0.2rem 0.625rem;
          border-radius: 99px;
        }
        .manage-header-actions {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          flex-wrap: wrap;
        }

        /* Buttons */
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
          display: inline-flex;
          align-items: center;
          gap: 0;
        }
        .btn-ghost:hover { border-color: #2a2a3a; color: #c8c8dc; background: #14141e; }
        .btn-ghost-gold {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5625rem 1rem;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: #c3a364;
          border: 1px solid rgba(195,163,100,0.2);
          border-radius: 5px;
          background: rgba(195,163,100,0.05);
          text-decoration: none;
          transition: background 0.15s, border-color 0.15s;
        }
        .btn-ghost-gold:hover {
          background: rgba(195,163,100,0.1);
          border-color: rgba(195,163,100,0.35);
        }
        .btn-gold {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5625rem 1.125rem;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #c3a364, #a8893f);
          color: #0a0a0e;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.15s, transform 0.1s, box-shadow 0.15s;
          box-shadow: 0 2px 8px rgba(195,163,100,0.2);
        }
        .btn-gold:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(195,163,100,0.25);
        }

        /* Gallery grid */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 0.75rem;
        }
        @media (max-width: 480px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
        }
        .gallery-item {
          position: relative;
          aspect-ratio: 1;
          background: #12121e;
          border: 1px solid #1e1e2a;
          border-radius: 6px;
          overflow: hidden;
          group: true;
        }
        .gallery-img { object-fit: cover; transition: transform 0.3s; }
        .gallery-item:hover .gallery-img { transform: scale(1.04); }
        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0);
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
        }
        .gallery-item:hover .gallery-overlay { background: rgba(0,0,0,0.55); }
        .gallery-delete-btn {
          opacity: 0;
          transform: scale(0.8);
          transition: opacity 0.2s, transform 0.2s;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(239,68,68,0.85);
          border: none;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .gallery-item:hover .gallery-delete-btn {
          opacity: 1;
          transform: scale(1);
        }
        .gallery-delete-btn:hover { background: rgb(239,68,68); }
        .gallery-delete-btn:disabled { cursor: not-allowed; opacity: 0.5; }

        /* Empty */
        .gallery-empty {
          background: #0e0e18;
          border: 1px dashed #1e1e2a;
          border-radius: 8px;
          padding: 5rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.875rem;
        }
        .gallery-empty-icon {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          background: #14141e;
          border: 1px solid #1e1e2a;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #30305a;
          margin-bottom: 0.25rem;
        }
        .gallery-empty-title {
          font-size: 1.0625rem;
          font-weight: 600;
          color: #c8c8dc;
          margin: 0;
        }
        .gallery-empty-desc {
          font-size: 0.875rem;
          color: #40405a;
          max-width: 380px;
          line-height: 1.6;
          margin: 0 0 0.5rem 0;
        }
      `}</style>
    </div>
  );
}
