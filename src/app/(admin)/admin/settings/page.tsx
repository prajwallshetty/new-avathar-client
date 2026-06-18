"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, Upload, Link as LinkIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { toast } from "sonner";

export default function BrandingSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    logoUrl: "",
    brandName: "New Avathar Photography",
    whatsappNumber: "",
    instagramLink: "",
    facebookLink: "",
    footerText: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setFormData({
              logoUrl: data.settings.logoUrl || "",
              brandName: data.settings.brandName || "New Avathar Photography",
              whatsappNumber: data.settings.whatsappNumber || "",
              instagramLink: data.settings.instagramLink || "",
              facebookLink: data.settings.facebookLink || "",
              footerText: data.settings.footerText || "",
            });
          }
        }
      } catch (err) {
        toast.error("Failed to load branding settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    console.log("Cloudinary Debug (Settings Page):", {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "newavathar_gallery",
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      uploadEndpoint: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleUploadSuccess = (result: any) => {
    if (result.info && result.info.secure_url) {
      setFormData((p) => ({ ...p, logoUrl: result.info.secure_url }));
      toast.success("Logo uploaded successfully!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Settings updated successfully!");
      } else {
        toast.error("Failed to save settings.");
      }
    } catch {
      toast.error("Network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-muted-foreground">
        <Loader2 size={24} className="animate-spin text-primary" />
        <p className="text-xs font-semibold uppercase tracking-wider">Loading settings…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 select-none">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Branding Settings</h1>
        <p className="text-xs text-muted-foreground font-medium mt-1">Configure global branding elements, contact paths, and layouts for all shared client galleries.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-border bg-card shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="p-6 border-b border-border bg-muted/20">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">General Branding</CardTitle>
            <CardDescription className="text-xs text-muted-foreground/80 mt-1">Configure your studio details and logo.</CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Logo upload */}
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Studio Logo</Label>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-xl bg-muted border border-border relative overflow-hidden flex items-center justify-center text-muted-foreground">
                  {formData.logoUrl ? (
                    <Image src={formData.logoUrl} alt="Logo" fill className="object-contain p-2" />
                  ) : (
                    <LinkIcon size={20} strokeWidth={1.5} />
                  )}
                </div>
                 {!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
                  <Button
                    type="button"
                    onClick={() => toast.error("Cloudinary is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your .env file.")}
                    variant="outline"
                    size="sm"
                    className="text-xs h-9 border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <AlertCircle size={13} className="mr-1.5" />
                    Upload Disabled
                  </Button>
                ) : (
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "newavathar_gallery"}
                    onSuccess={handleUploadSuccess}
                    config={{
                      cloud: {
                        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "newavathar",
                        apiKey: null as any
                      }
                    }}
                    options={{ multiple: false }}
                  >
                    {({ open }) => (
                      <Button type="button" onClick={() => open()} variant="outline" size="sm" className="text-xs h-9">
                        <Upload size={13} className="mr-1.5" />
                        Upload Logo
                      </Button>
                    )}
                  </CldUploadWidget>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Brand Name */}
              <div className="space-y-1.5">
                <Label htmlFor="brandName" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Brand Name</Label>
                <Input
                  id="brandName"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  required
                  placeholder="New Avathar Photography"
                  className="bg-muted/50 border-border text-xs h-10 px-3"
                />
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-1.5">
                <Label htmlFor="whatsappNumber" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">WhatsApp Link / Number</Label>
                <Input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="e.g. +919999999999"
                  className="bg-muted/50 border-border text-xs h-10 px-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Instagram URL */}
              <div className="space-y-1.5">
                <Label htmlFor="instagramLink" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Instagram Link</Label>
                <Input
                  id="instagramLink"
                  name="instagramLink"
                  value={formData.instagramLink}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                  className="bg-muted/50 border-border text-xs h-10 px-3"
                />
              </div>

              {/* Facebook URL */}
              <div className="space-y-1.5">
                <Label htmlFor="facebookLink" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Facebook Link</Label>
                <Input
                  id="facebookLink"
                  name="facebookLink"
                  value={formData.facebookLink}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  className="bg-muted/50 border-border text-xs h-10 px-3"
                />
              </div>
            </div>

            {/* Footer Text */}
            <div className="space-y-1.5">
              <Label htmlFor="footerText" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Custom Footer copyright Text</Label>
              <Input
                id="footerText"
                name="footerText"
                value={formData.footerText}
                onChange={handleChange}
                placeholder="e.g. © 2026 New Avathar Photography. All Rights Reserved."
                className="bg-muted/50 border-border text-xs h-10 px-3"
              />
            </div>
          </CardContent>

          {/* Form Actions */}
          <div className="p-6 pt-2 border-t border-border bg-muted/10 flex justify-end items-center">
            <Button type="submit" disabled={saving} size="sm" className="text-xs font-semibold px-5">
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin mr-2" />
                  Saving…
                </>
              ) : (
                <>
                  <Save size={14} className="mr-1.5" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
