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
  ImageIcon,
  Aperture,
  Settings as SettingsIcon,
  Users as UsersIcon,
  Mail,
} from "lucide-react";

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// ─── Sidebar Link ───────────────────────────────────────────────────────────────
function NavItem({
  item,
  collapsed,
  pathname,
}: {
  item: { href: string; label: string; icon: any; exact: boolean };
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
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-xs font-medium relative whitespace-nowrap ${
        isActive
          ? "bg-primary/10 text-primary font-semibold"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      }`}
    >
      <span className="flex items-center justify-center flex-shrink-0 w-4 h-4">
        <item.icon size={16} strokeWidth={isActive ? 2 : 1.75} />
      </span>
      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
      {isActive && !collapsed && (
        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 absolute right-3" />
      )}
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
    <nav className="flex items-center gap-1.5 text-xs overflow-hidden">
      {crumbs.map((c, i) => (
        <span key={c.href} className="flex items-center gap-1.5 min-w-0">
          {i > 0 && <ChevronRight size={12} className="text-muted-foreground/30 flex-shrink-0" />}
          {i < crumbs.length - 1 ? (
            <Link href={c.href} className="text-muted-foreground hover:text-foreground transition-all truncate">
              {c.label}
            </Link>
          ) : (
            <span className="text-foreground font-semibold truncate">{c.label}</span>
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
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);

  // Fetch recent activities for the notification center
  useEffect(() => {
    if (showNotifications) {
      const fetchActivities = async () => {
        try {
          const res = await fetch("/api/admin/dashboard");
          if (res.ok) {
            const data = await res.json();
            setActivities(data.recentActivity || []);
          }
        } catch (err) {
          console.error("Failed to load notifications:", err);
        }
      };
      fetchActivities();
    }
  }, [showNotifications]);

  // Fetch logged-in user session details
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Session load error:", err);
      }
    };
    fetchSession();
  }, []);

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

  const navGroups = [
    {
      label: "Main",
      items: [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
        { href: "/admin/create", label: "Create Event", icon: PlusCircle, exact: false },
        { href: "/admin/inquiries", label: "Inquiries", icon: Mail, exact: false },
      ],
    },
    ...(user?.role === "admin"
      ? [
          {
            label: "System",
            items: [
              { href: "/admin/settings", label: "Branding Settings", icon: SettingsIcon, exact: true },
              { href: "/admin/users", label: "User Accounts", icon: UsersIcon, exact: true },
            ],
          },
        ]
      : []),
  ];

  const SidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 border-b border-border h-14 relative flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 shadow-sm">
          <Aperture size={18} strokeWidth={1.5} />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-sm whitespace-nowrap text-foreground leading-tight tracking-tight">New Avatar</span>
            <span className="text-[9px] tracking-wider text-muted-foreground uppercase font-medium mt-0.5">Admin Panel</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4 select-none">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            {!collapsed && (
              <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider px-2 mb-1.5">
                {group.label}
              </p>
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
        <div className="h-[1px] bg-border my-3 mx-2" />

        {/* External */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all text-xs font-medium cursor-pointer whitespace-nowrap"
          title={collapsed ? "View Live Site" : undefined}
        >
          <span className="flex items-center justify-center flex-shrink-0 w-4 h-4">
            <ExternalLink size={15} strokeWidth={1.75} />
          </span>
          {!collapsed && <span className="flex-1 truncate">Live Site</span>}
        </Link>
      </nav>

      {/* Footer / User */}
      <div className="p-3 border-t border-border flex-shrink-0 bg-card">
        <div className="flex items-center gap-2 px-2 py-1.5 overflow-hidden">
          {user ? (
            <>
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs border border-border flex-shrink-0">
                {user.name ? user.name.charAt(0) : (user.email ? user.email.charAt(0).toUpperCase() : "A")}
              </div>
              {!collapsed && (
                <div className="flex flex-col overflow-hidden min-w-0">
                  <span className="text-xs font-semibold text-foreground truncate leading-none">{user.name || user.email || "Studio User"}</span>
                  <span className="text-[8px] text-muted-foreground tracking-wider uppercase font-medium mt-1 truncate">
                    {user.role === "admin" ? "Studio Admin" : "Studio Editor"}
                  </span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="w-7 h-7 rounded-full bg-muted animate-pulse flex-shrink-0" />
              {!collapsed && (
                <div className="flex flex-col space-y-1.5 flex-1 min-w-0">
                  <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-2 w-16 bg-muted/70 animate-pulse rounded" />
                </div>
              )}
            </>
          )}
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full mt-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all text-xs font-medium cursor-pointer text-left"
        >
          <LogOut size={14} strokeWidth={1.75} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col flex-shrink-0 h-screen bg-card border-r border-border relative z-20 transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}>
        {SidebarContent}
        <button
          className="absolute -right-3 top-[16px] w-6 h-6 bg-card border border-border rounded-full hidden md:flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer shadow-sm hover:border-muted-foreground/30 transition-all z-30"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand ([ key)" : "Collapse ([ key)"}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Mobile Sidebar drawer */}
      <aside className={`fixed top-0 bottom-0 left-0 w-60 bg-card border-r border-border z-40 flex flex-col md:hidden transition-transform duration-300 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {SidebarContent}
      </aside>

      {/* Right panel */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 flex-shrink-0 gap-4 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="md:hidden text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-accent cursor-pointer"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>
            <Breadcrumb pathname={pathname} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition-all hover:bg-accent ${
                showNotifications ? "bg-accent border-primary/20 text-primary" : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`} 
              title="Notifications"
            >
              <Bell size={15} strokeWidth={1.75} />
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-10 w-80 bg-card/95 border border-border rounded-xl shadow-xl z-50 py-3 backdrop-blur-md select-none">
                  <div className="px-4 pb-2 border-b border-border flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">Recent Activity Alerts</span>
                    <span className="text-[9px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded-full">Live Feed</span>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto px-2 pt-2 divide-y divide-border/40 scrollbar-thin">
                    {activities.length > 0 ? (
                      activities.map((act, idx) => (
                        <div key={idx} className="p-2 hover:bg-accent/40 rounded-lg transition-all flex flex-col gap-1 text-[11px]">
                          <p className="text-muted-foreground leading-normal">{act.description}</p>
                          <span className="text-[8px] text-muted-foreground/60 font-medium self-end">{formatRelativeTime(act.time)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-xs text-muted-foreground/60">
                        No recent activity recorded.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <Link href="/" target="_blank" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary border border-primary/20 rounded-lg bg-primary/5 hover:bg-primary/10 transition-all">
              <ExternalLink size={12} />
              <span>Live Site</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
