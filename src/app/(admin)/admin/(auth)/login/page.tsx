"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Camera, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

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
        toast.success("Successfully logged in!");
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        const errorMsg = data.error || "Invalid credentials. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
      }
    } catch (err) {
      setError("Network error occurred. Please try again.");
      toast.error("Network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Visual panel - visible on md screens */}
      <div className="hidden md:flex md:w-1/2 relative bg-muted overflow-hidden border-r border-border">
        <Image
          src="/wedding/JKP00401.jpg.jpeg"
          alt="Studio Background"
          fill
          className="object-cover opacity-80 filter saturate-50 hover:saturate-100 transition-all duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-12 left-12 max-w-md z-10 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 shadow-lg">
            <Camera size={20} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
            New Avatar Photography
          </h2>
          <p className="text-xs text-white/75 font-medium leading-relaxed max-w-sm drop-shadow-sm">
            Capturing stories beyond frames. Access client portals and design beautiful event galleries from the dashboard.
          </p>
        </div>
      </div>

      {/* Login Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <Card className="w-full max-w-md border-border bg-card shadow-sm rounded-xl">
          <CardHeader className="space-y-4 pb-6">
            {/* Minimal Brand logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-xs">
                <Camera size={16} strokeWidth={2} />
              </div>
              <span className="font-bold text-sm tracking-widest text-foreground uppercase">
                New Avatar
              </span>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold tracking-tight text-foreground">Welcome back</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Sign in to manage your client galleries</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive-foreground text-xs p-3 rounded-lg font-medium">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="admin-email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Email address
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="admin@newavatar.com"
                  className="bg-muted/50 border-border text-xs h-10 px-3"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-password" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="bg-muted/50 border-border text-xs h-10 pl-3 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full text-xs font-semibold uppercase tracking-wider h-10 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin mr-2" />
                    Authenticating…
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
