"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Camera,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Bell,
  Settings,
  ImageIcon,
  Aperture,
} from "lucide-react";

// ─── Nav config ────────────────────────────────────────────────────────────────
const navGroups = [
  {
    label: "Main",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/create", label: "Create Event", icon: PlusCircle, exact: false },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/gallery", label: "All Galleries", icon: ImageIcon, exact: true },
    ],
  },
];

// ─── Sidebar Link ───────────────────────────────────────────────────────────────
function NavItem({
  item,
  collapsed,
  pathname,
}: {
  item: (typeof navGroups)[0]["items"][0];
  collapsed: boolean;
  pathname: string;
}) {
  const isActive = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={`sidebar-nav-item${isActive ? " active" : ""}`}
    >
      <span className="sidebar-nav-icon">
        <item.icon size={17} strokeWidth={1.75} />
      </span>
      {!collapsed && <span className="sidebar-nav-label">{item.label}</span>}
      {isActive && !collapsed && <span className="sidebar-nav-dot" />}
    </Link>
  );
}

// ─── Breadcrumb ─────────────────────────────────────────────────────────────────
function Breadcrumb({ pathname }: { pathname: string }) {
  const parts = pathname
    .replace(/^\/admin\/?/, "")
    .split("/")
    .filter(Boolean);

  const crumbs = [
    { label: "Admin", href: "/admin" },
    ...parts.map((p, i) => ({
      label: p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, " "),
      href: "/admin/" + parts.slice(0, i + 1).join("/"),
    })),
  ];

  return (
    <nav className="breadcrumb">
      {crumbs.map((c, i) => (
        <span key={c.href} className="breadcrumb-item">
          {i > 0 && <ChevronRight size={12} className="breadcrumb-sep" />}
          {i < crumbs.length - 1 ? (
            <Link href={c.href} className="breadcrumb-link">
              {c.label}
            </Link>
          ) : (
            <span className="breadcrumb-current">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// ─── Layout ─────────────────────────────────────────────────────────────────────
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Keyboard shortcut: [ to toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "[" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        setCollapsed((c) => !c);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await fetch("/api/auth/login", { method: "DELETE" });
    window.location.href = "/admin/login";
  };

  const SidebarContent = (
    <div className={`sidebar-inner${collapsed ? " collapsed" : ""}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo">
          <Aperture size={18} strokeWidth={1.5} />
        </div>
        {!collapsed && (
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">New Avathar</span>
            <span className="sidebar-brand-role">Admin Panel</span>
          </div>
        )}
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand ([ key)" : "Collapse ([ key)"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navGroups.map((group) => (
          <div key={group.label} className="sidebar-nav-group">
            {!collapsed && (
              <p className="sidebar-nav-group-label">{group.label}</p>
            )}
            {group.items.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                collapsed={collapsed}
                pathname={pathname}
              />
            ))}
          </div>
        ))}

        {/* Separator */}
        <div className="sidebar-sep" />

        {/* External */}
        <Link
          href="/"
          target="_blank"
          className="sidebar-nav-item external"
          title={collapsed ? "View Live Site" : undefined}
        >
          <span className="sidebar-nav-icon">
            <ExternalLink size={16} strokeWidth={1.75} />
          </span>
          {!collapsed && <span className="sidebar-nav-label">Live Site</span>}
        </Link>
      </nav>

      {/* Footer / User */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-user">
          <div className="sidebar-avatar">
            <Camera size={14} strokeWidth={1.5} />
          </div>
          {!collapsed && (
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">Administrator</span>
              <span className="sidebar-user-role">Studio Admin</span>
            </div>
          )}
        </div>
        <button
          onClick={handleSignOut}
          className="sidebar-signout"
          title="Sign out"
        >
          <LogOut size={15} strokeWidth={1.75} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-shell">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className={`admin-sidebar desktop-sidebar${collapsed ? " collapsed" : ""}`}>
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar drawer */}
      <aside className={`admin-sidebar mobile-sidebar${mobileOpen ? " open" : ""}`}>
        {SidebarContent}
      </aside>

      {/* Right panel */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>
            <Breadcrumb pathname={pathname} />
          </div>
          <div className="topbar-right">
            <button className="topbar-icon-btn" title="Notifications">
              <Bell size={16} strokeWidth={1.75} />
            </button>
            <Link href="/" target="_blank" className="topbar-live-btn">
              <ExternalLink size={13} />
              <span>Live Site</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content">{children}</main>
      </div>

      <style>{`
        /* ── Reset & base ──────────────────────────────────────────── */
        .admin-shell {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background: #08080c;
          color: #e8e8f0;
          font-family: var(--font-inter), system-ui, sans-serif;
        }

        /* ── Sidebar shell ─────────────────────────────────────────── */
        .admin-sidebar {
          flex-shrink: 0;
          height: 100vh;
          background: #0c0c12;
          border-right: 1px solid #1a1a24;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 40;
          transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        .desktop-sidebar { width: 240px; }
        .desktop-sidebar.collapsed { width: 64px; }
        .mobile-sidebar {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 240px;
          transform: translateX(-100%);
          transition: transform 0.25s ease;
          box-shadow: 4px 0 32px rgba(0,0,0,0.6);
        }
        .mobile-sidebar.open { transform: translateX(0); }
        .mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 30;
          backdrop-filter: blur(2px);
        }

        @media (max-width: 768px) {
          .desktop-sidebar { display: none; }
          .mobile-sidebar { display: flex; }
          .mobile-overlay { display: block; }
        }

        /* ── Sidebar inner ─────────────────────────────────────────── */
        .sidebar-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
        }

        /* Brand */
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 1.125rem 1rem;
          border-bottom: 1px solid #1a1a24;
          min-height: 60px;
          position: relative;
        }
        .sidebar-brand-logo {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #c3a364, #a8893f);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0a0a0e;
          flex-shrink: 0;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(195,163,100,0.3);
        }
        .sidebar-brand-text {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          flex: 1;
          min-width: 0;
        }
        .sidebar-brand-name {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 0.875rem;
          font-weight: 600;
          color: #f0f0f8;
          letter-spacing: 0.04em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sidebar-brand-role {
          font-size: 0.625rem;
          letter-spacing: 0.2em;
          color: #c3a364;
          text-transform: uppercase;
          margin-top: 1px;
        }
        .sidebar-collapse-btn {
          position: absolute;
          right: -10px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          background: #1e1e2a;
          border: 1px solid #2a2a38;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #606078;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
          z-index: 10;
          flex-shrink: 0;
        }
        .sidebar-collapse-btn:hover {
          background: #2a2a38;
          color: #c3a364;
          border-color: rgba(195,163,100,0.4);
        }
        .sidebar-inner.collapsed .sidebar-collapse-btn {
          right: -1px;
          border-radius: 0 50% 50% 0;
        }

        /* Nav */
        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 1rem 0.625rem;
          display: flex;
          flex-direction: column;
          gap: 0;
          scrollbar-width: thin;
          scrollbar-color: #1e1e2a transparent;
        }
        .sidebar-nav::-webkit-scrollbar { width: 3px; }
        .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
        .sidebar-nav::-webkit-scrollbar-thumb { background: #1e1e2a; border-radius: 3px; }

        .sidebar-nav-group { margin-bottom: 0.5rem; }
        .sidebar-nav-group-label {
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #40404e;
          font-weight: 600;
          padding: 0 0.625rem;
          margin-bottom: 0.375rem;
          margin-top: 0.5rem;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.5625rem 0.625rem;
          border-radius: 6px;
          color: #68688a;
          text-decoration: none;
          font-size: 0.8125rem;
          font-weight: 450;
          transition: background 0.15s, color 0.15s;
          position: relative;
          cursor: pointer;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
        }
        .sidebar-nav-item:hover {
          background: #14141e;
          color: #c8c8dc;
        }
        .sidebar-nav-item.active {
          background: #16162a;
          color: #f0f0f8;
          box-shadow: inset 3px 0 0 #c3a364;
        }
        .sidebar-nav-item.external { color: #5a5a72; }
        .sidebar-nav-item.external:hover { color: #c3a364; }
        .sidebar-nav-icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          width: 18px;
        }
        .sidebar-nav-label { flex: 1; }
        .sidebar-nav-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #c3a364;
          flex-shrink: 0;
        }
        .sidebar-sep {
          height: 1px;
          background: #1a1a24;
          margin: 0.5rem 0.625rem;
        }

        /* Footer */
        .sidebar-footer {
          border-top: 1px solid #1a1a24;
          padding: 0.75rem 0.625rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .sidebar-footer-user {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.375rem 0.375rem;
          overflow: hidden;
        }
        .sidebar-avatar {
          width: 30px;
          height: 30px;
          background: #1e1e2a;
          border: 1px solid #2a2a38;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6060a0;
          flex-shrink: 0;
        }
        .sidebar-user-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          flex: 1;
          min-width: 0;
        }
        .sidebar-user-name {
          font-size: 0.75rem;
          font-weight: 500;
          color: #c8c8dc;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sidebar-user-role {
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          color: #40404e;
          text-transform: uppercase;
          margin-top: 1px;
        }
        .sidebar-signout {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.5rem 0.625rem;
          border-radius: 6px;
          background: none;
          border: none;
          color: #6060a0;
          font-family: inherit;
          font-size: 0.8125rem;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
        }
        .sidebar-signout:hover {
          background: rgba(239,68,68,0.08);
          color: #f87171;
        }

        /* ── Main area ─────────────────────────────────────────────── */
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }

        /* Topbar */
        .admin-topbar {
          height: 56px;
          border-bottom: 1px solid #1a1a24;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          background: #0a0a10;
          flex-shrink: 0;
          gap: 1rem;
        }
        .topbar-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 0;
        }
        .topbar-right {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          flex-shrink: 0;
        }
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: #6868a8;
          cursor: pointer;
          padding: 0.375rem;
          border-radius: 4px;
          transition: color 0.15s, background 0.15s;
        }
        .mobile-menu-btn:hover { background: #14141e; color: #c8c8dc; }
        @media (max-width: 768px) { .mobile-menu-btn { display: flex; } }
        .topbar-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid #1e1e2a;
          background: #12121a;
          color: #5050a0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .topbar-icon-btn:hover {
          border-color: #2a2a3a;
          color: #c8c8dc;
          background: #1a1a24;
        }
        .topbar-live-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          color: #c3a364;
          border: 1px solid rgba(195,163,100,0.2);
          border-radius: 5px;
          background: rgba(195,163,100,0.06);
          text-decoration: none;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .topbar-live-btn:hover {
          background: rgba(195,163,100,0.12);
          border-color: rgba(195,163,100,0.4);
          color: #d4b474;
        }

        /* Breadcrumb */
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          overflow: hidden;
        }
        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8125rem;
          min-width: 0;
        }
        .breadcrumb-sep { color: #2a2a3a; flex-shrink: 0; }
        .breadcrumb-link {
          color: #5050a0;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.15s;
        }
        .breadcrumb-link:hover { color: #c8c8dc; }
        .breadcrumb-current {
          color: #c8c8dc;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Content */
        .admin-content {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          scrollbar-width: thin;
          scrollbar-color: #1e1e2a transparent;
        }
        .admin-content::-webkit-scrollbar { width: 4px; }
        .admin-content::-webkit-scrollbar-track { background: transparent; }
        .admin-content::-webkit-scrollbar-thumb { background: #1e1e2a; border-radius: 4px; }

        @media (max-width: 640px) {
          .admin-content { padding: 1rem; }
          .admin-topbar { padding: 0 1rem; }
        }
      `}</style>
    </div>
  );
}
