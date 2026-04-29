"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Camera, Loader2, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      setError("Network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-root">
      {/* Background */}
      <div className="admin-login-bg">
        <Image
          src="/JKP00401.jpg.jpeg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="admin-login-bg-overlay" />
        <div className="admin-login-bg-noise" />
      </div>

      {/* Grid pattern */}
      <div className="admin-login-grid" />

      {/* Card */}
      <div className="admin-login-card">
        {/* Brand */}
        <div className="admin-login-brand">
          <div className="admin-login-brand-icon">
            <Camera size={20} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="admin-login-brand-title">NEW AVATHAR</h1>
            <p className="admin-login-brand-sub">Admin Portal</p>
          </div>
        </div>

        <div className="admin-login-divider" />

        <div className="admin-login-heading">
          <h2 className="admin-login-heading-title">Welcome back</h2>
          <p className="admin-login-heading-sub">Sign in to manage your studio</p>
        </div>

        {error && (
          <div className="admin-login-error">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-field">
            <label className="admin-label" htmlFor="admin-email">Email address</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="admin-input"
              placeholder="admin@newavathar.com"
            />
          </div>

          <div className="admin-field">
            <label className="admin-label" htmlFor="admin-password">Password</label>
            <div className="admin-input-wrap">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="admin-input admin-input-icon"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="admin-input-eye"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-login-btn"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="admin-login-btn-spin" />
                Authenticating…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="admin-login-footer">
          New Avathar Photography Studio &mdash; Internal Access Only
        </p>
      </div>

      <style>{`
        .admin-login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: #050508;
          position: relative;
          overflow: hidden;
          font-family: var(--font-inter), system-ui, sans-serif;
        }
        .admin-login-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .admin-login-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(5,5,8,0.88) 0%, rgba(5,5,8,0.72) 50%, rgba(5,5,8,0.92) 100%);
          z-index: 1;
        }
        .admin-login-bg-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          z-index: 2;
          pointer-events: none;
        }
        .admin-login-grid {
          position: absolute;
          inset: 0;
          z-index: 1;
          background-image:
            linear-gradient(rgba(195,163,100,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(195,163,100,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        .admin-login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          background: rgba(10,10,14,0.92);
          border: 1px solid rgba(195,163,100,0.15);
          padding: 2.5rem;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.7), 0 0 60px rgba(195,163,100,0.05);
          border-radius: 2px;
        }
        .admin-login-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .admin-login-brand-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #c3a364, #a8893f);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0a0a0e;
          flex-shrink: 0;
          border-radius: 1px;
        }
        .admin-login-brand-title {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 0.875rem;
          letter-spacing: 0.25em;
          color: #fff;
          font-weight: 600;
          line-height: 1.2;
          margin: 0;
        }
        .admin-login-brand-sub {
          font-size: 0.625rem;
          letter-spacing: 0.3em;
          color: #c3a364;
          text-transform: uppercase;
          margin: 0;
          margin-top: 2px;
        }
        .admin-login-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(195,163,100,0.2), transparent);
          margin-bottom: 1.75rem;
        }
        .admin-login-heading {
          margin-bottom: 1.75rem;
        }
        .admin-login-heading-title {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 1.5rem;
          color: #fff;
          font-weight: 500;
          letter-spacing: 0.02em;
          margin: 0 0 0.25rem 0;
        }
        .admin-login-heading-sub {
          font-size: 0.8125rem;
          color: #6b6b7a;
          margin: 0;
        }
        .admin-login-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.25);
          color: #f87171;
          padding: 0.75rem 1rem;
          margin-bottom: 1.25rem;
          font-size: 0.8125rem;
          border-radius: 1px;
        }
        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .admin-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .admin-label {
          font-size: 0.6875rem;
          letter-spacing: 0.12em;
          color: #9898a8;
          text-transform: uppercase;
          font-weight: 500;
        }
        .admin-input {
          width: 100%;
          background: rgba(20,20,26,0.8);
          border: 1px solid #22222e;
          padding: 0.75rem 1rem;
          color: #fff;
          font-size: 0.875rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          border-radius: 1px;
          box-sizing: border-box;
        }
        .admin-input:focus {
          border-color: rgba(195,163,100,0.5);
          box-shadow: 0 0 0 3px rgba(195,163,100,0.06);
        }
        .admin-input::placeholder { color: #3a3a48; }
        .admin-input-wrap { position: relative; }
        .admin-input-icon { padding-right: 2.75rem; }
        .admin-input-eye {
          position: absolute;
          right: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          color: #5a5a6a;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .admin-input-eye:hover { color: #c3a364; }
        .admin-login-btn {
          margin-top: 0.5rem;
          width: 100%;
          background: linear-gradient(135deg, #c3a364, #a8893f);
          color: #0a0a0e;
          font-family: inherit;
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 600;
          padding: 0.875rem 1.5rem;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 1px;
          box-shadow: 0 4px 16px rgba(195,163,100,0.2);
        }
        .admin-login-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(195,163,100,0.25);
        }
        .admin-login-btn:active:not(:disabled) { transform: translateY(0); }
        .admin-login-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        @keyframes admin-spin { to { transform: rotate(360deg); } }
        .admin-login-btn-spin { animation: admin-spin 0.8s linear infinite; }
        .admin-login-footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.6875rem;
          color: #3a3a48;
          letter-spacing: 0.05em;
          border-top: 1px solid #16161e;
          padding-top: 1.25rem;
        }
      `}</style>
    </div>
  );
}
