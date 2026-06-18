"use client";

import { useState, useEffect } from "react";
import { Loader2, UserPlus, Trash2, Mail, Shield, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor",
  });

  const fetchUsers = async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUserEmail(meData.user.email);
        if (meData.user.role !== "admin") {
          toast.error("Unauthorized access.");
          window.location.href = "/admin";
          return;
        }
      }

      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      toast.error("Failed to load users list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("User created successfully!");
        setFormData({ name: "", email: "", password: "", role: "editor" });
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create user.");
      }
    } catch {
      toast.error("Network error occurred.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (email === currentUserEmail) {
      toast.error("You cannot delete your own account.");
      return;
    }

    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("User deleted successfully.");
        fetchUsers();
      } else {
        toast.error("Failed to delete user.");
      }
    } catch {
      toast.error("Network error occurred.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-muted-foreground">
        <Loader2 size={24} className="animate-spin text-primary" />
        <p className="text-xs font-semibold uppercase tracking-wider">Loading users…</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 select-none">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">User Accounts</h1>
        <p className="text-xs text-muted-foreground font-medium mt-1">Manage team credentials, passwords, and access roles (Admin / Editor) for client galleries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create user form */}
        <div className="lg:col-span-1">
          <Card className="border-border bg-card shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="p-5 border-b border-border bg-muted/20">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Add User Account</CardTitle>
              <CardDescription className="text-xs text-muted-foreground/80 mt-1">Create credentials for a new administrator or editor.</CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="p-5 space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Priyan Seth"
                    className="bg-muted/50 border-border text-xs h-10 px-3"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="e.g. editor@newavatar.com"
                    className="bg-muted/50 border-border text-xs h-10 px-3"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="bg-muted/50 border-border text-xs h-10 px-3"
                  />
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Access Role</Label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer h-10"
                  >
                    <option value="editor">Editor (Create & Edit Galleries)</option>
                    <option value="admin">Administrator (Full System Access)</option>
                  </select>
                </div>

                <Button type="submit" disabled={creating} className="w-full text-xs font-semibold h-10 mt-2">
                  {creating ? (
                    <>
                      <Loader2 size={14} className="animate-spin mr-2" />
                      Creating Account…
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} className="mr-1.5" />
                      Add Account
                    </>
                  )}
                </Button>
              </CardContent>
            </form>
          </Card>
        </div>

        {/* Users list */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card shadow-sm rounded-xl overflow-hidden h-full">
            <CardHeader className="p-5 border-b border-border bg-muted/20">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Active Team Accounts</CardTitle>
              <CardDescription className="text-xs text-muted-foreground/80 mt-1">Authorized editors and administrators listed below.</CardDescription>
            </CardHeader>

            <CardContent className="p-5 divide-y divide-border">
              {users.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-xs font-medium">
                  No other active accounts found.
                </div>
              ) : (
                users.map((item: any) => (
                  <div key={item._id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center border flex-shrink-0 ${
                        item.role === "admin"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}>
                        {item.role === "admin" ? <ShieldCheck size={16} /> : <Shield size={16} />}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-foreground flex items-center gap-2">
                          {item.name}
                          {item.email === currentUserEmail && (
                            <span className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full uppercase tracking-wider">You</span>
                          )}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                          <Mail size={11} />
                          {item.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        item.role === "admin"
                          ? "bg-amber-100 text-amber-800 border-amber-200/40"
                          : "bg-blue-100 text-blue-800 border-blue-200/40"
                      }`}>
                        {item.role}
                      </span>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={item.email === currentUserEmail || deletingId === item._id}
                        onClick={() => handleDelete(item._id, item.email)}
                        className="w-8 h-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-30 cursor-pointer"
                        title="Delete User Account"
                      >
                        {deletingId === item._id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Trash2 size={13} />
                        )}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
