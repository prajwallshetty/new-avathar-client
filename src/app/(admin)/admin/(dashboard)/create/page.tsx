"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle, ChevronDown, Shield, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

const EVENT_TYPES = [
  "Wedding",
  "Pre-Wedding",
  "Engagement",
  "Reception",
  "Mehndi",
  "Portrait",
  "Maternity",
  "Birthday",
  "Corporate",
];

const TEMPLATES = [
  "Wedding Luxury",
  "Cinematic Wedding",
  "Traditional Wedding",
  "Pre-Wedding Love Story",
  "Engagement Elegant",
  "Mehndi Traditional",
  "Portrait Minimal",
  "Maternity Premium",
  "Birthday Celebration",
  "Corporate Showcase",
];

export default function CreateEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    eventType: "Wedding",
    date: "",
    venue: "",
    description: "",
    template: "Wedding Luxury",
    allowDownloads: true,
    isPasswordProtected: false,
    password: "",
    status: "Draft",
  });

  const [clientDetails, setClientDetails] = useState({
    brideName: "",
    groomName: "",
    personName: "",
    gender: "Bride",
    motherName: "",
    fatherName: "",
    celebrantName: "",
    companyName: "",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const val = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    
    setFormData((p) => ({ ...p, [name]: val }));
  };

  const handleClientDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setClientDetails((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const setEventType = (type: string) => {
    setFormData((p) => ({ ...p, eventType: type }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        clientDetails,
      };

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Event created successfully!");
        router.push(`/admin/event/${data.event._id}`);
      } else {
        const data = await res.json();
        const errorMsg = data.error || "Failed to create event";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch {
      setError("Network error occurred");
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 select-none pb-12">
      {/* Back button */}
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all uppercase tracking-wider">
          <ArrowLeft size={13} strokeWidth={2.5} />
          Back to Dashboard
        </Link>
      </div>

      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Create New Event</h1>
        <p className="text-xs text-muted-foreground font-medium mt-1">Set up a new client gallery and configure templates, analytics, and security.</p>
      </div>

      {/* Card Wrapper */}
      <Card className="border-border bg-card shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="p-6 border-b border-border bg-muted/20">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Gallery Configuration</CardTitle>
          <CardDescription className="text-xs text-muted-foreground/80 mt-1">Set up all necessary parameters for generating a client website.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-6">
            {error && (
              <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive-foreground text-xs p-3 rounded-lg font-medium">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Core details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground/90 uppercase tracking-widest border-b border-border pb-1.5">Core Event Details</h3>
              
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Event Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. Priya weds Arjun"
                  className="bg-muted/50 border-border text-xs h-10 px-3"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="eventType" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Event Type</Label>
                  <div className="relative">
                    <select
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer h-10"
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-card text-foreground">{t}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/75 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="date" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Event Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={handleFormChange}
                    className="bg-muted/50 border-border text-xs h-10 px-3 text-foreground"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="status" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</Label>
                  <div className="relative">
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer h-10"
                    >
                      <option value="Draft" className="bg-card text-foreground">Draft</option>
                      <option value="Editing" className="bg-card text-foreground">Editing</option>
                      <option value="Delivered" className="bg-card text-foreground">Delivered</option>
                      <option value="Archived" className="bg-card text-foreground">Archived</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/75 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="venue" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Venue</Label>
                <Input
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. Taj West End, Bangalore"
                  className="bg-muted/50 border-border text-xs h-10 px-3"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Description (Optional)</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="A cinematic story of their celebration..."
                  className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                />
              </div>
            </div>

            {/* Dynamic client details section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground/90 uppercase tracking-widest border-b border-border pb-1.5">Client Details</h3>
              
              {/* Wedding / Pre-Wedding / Engagement / Reception inputs */}
              {["Wedding", "Pre-Wedding", "Engagement", "Reception"].includes(formData.eventType) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1.5">
                    <Label htmlFor="brideName" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Bride Name</Label>
                    <Input
                      id="brideName"
                      name="brideName"
                      value={clientDetails.brideName}
                      onChange={handleClientDetailChange}
                      required
                      placeholder="e.g. Priya"
                      className="bg-muted/50 border-border text-xs h-10 px-3"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="groomName" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Groom Name</Label>
                    <Input
                      id="groomName"
                      name="groomName"
                      value={clientDetails.groomName}
                      onChange={handleClientDetailChange}
                      required
                      placeholder="e.g. Arjun"
                      className="bg-muted/50 border-border text-xs h-10 px-3"
                    />
                  </div>
                </div>
              )}

              {/* Mehndi inputs */}
              {formData.eventType === "Mehndi" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1.5">
                    <Label htmlFor="personName" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Person Name</Label>
                    <Input
                      id="personName"
                      name="personName"
                      value={clientDetails.personName}
                      onChange={handleClientDetailChange}
                      required
                      placeholder="e.g. Riya"
                      className="bg-muted/50 border-border text-xs h-10 px-3"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="gender" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Gender Designation</Label>
                    <div className="relative">
                      <select
                        id="gender"
                        name="gender"
                        value={clientDetails.gender}
                        onChange={handleClientDetailChange}
                        className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer h-10"
                      >
                        <option value="Bride" className="bg-card text-foreground">Bride</option>
                        <option value="Groom" className="bg-card text-foreground">Groom</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/75 pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* Portrait inputs */}
              {formData.eventType === "Portrait" && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Label htmlFor="personName" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Person Name</Label>
                  <Input
                    id="personName"
                    name="personName"
                    value={clientDetails.personName}
                    onChange={handleClientDetailChange}
                    required
                    placeholder="e.g. Rahul"
                    className="bg-muted/50 border-border text-xs h-10 px-3"
                  />
                </div>
              )}

              {/* Maternity inputs */}
              {formData.eventType === "Maternity" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1.5">
                    <Label htmlFor="motherName" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Mother Name</Label>
                    <Input
                      id="motherName"
                      name="motherName"
                      value={clientDetails.motherName}
                      onChange={handleClientDetailChange}
                      required
                      placeholder="e.g. Simran"
                      className="bg-muted/50 border-border text-xs h-10 px-3"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="fatherName" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Father Name (Optional)</Label>
                    <Input
                      id="fatherName"
                      name="fatherName"
                      value={clientDetails.fatherName}
                      onChange={handleClientDetailChange}
                      placeholder="e.g. Vicky"
                      className="bg-muted/50 border-border text-xs h-10 px-3"
                    />
                  </div>
                </div>
              )}

              {/* Birthday inputs */}
              {formData.eventType === "Birthday" && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Label htmlFor="celebrantName" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Celebrant Name</Label>
                  <Input
                    id="celebrantName"
                    name="celebrantName"
                    value={clientDetails.celebrantName}
                    onChange={handleClientDetailChange}
                    required
                    placeholder="e.g. Aarav"
                    className="bg-muted/50 border-border text-xs h-10 px-3"
                  />
                </div>
              )}

              {/* Corporate inputs */}
              {formData.eventType === "Corporate" && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Label htmlFor="companyName" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={clientDetails.companyName}
                    onChange={handleClientDetailChange}
                    required
                    placeholder="e.g. ABC Company"
                    className="bg-muted/50 border-border text-xs h-10 px-3"
                  />
                </div>
              )}
            </div>

            {/* Template Selection */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground/90 uppercase tracking-widest border-b border-border pb-1.5">Website Template selection</h3>
              <div className="space-y-1.5">
                <Label htmlFor="template" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Select Visual Template</Label>
                <div className="relative">
                  <select
                    id="template"
                    name="template"
                    value={formData.template}
                    onChange={handleFormChange}
                    className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer h-10"
                  >
                    {TEMPLATES.map((t) => (
                      <option key={t} value={t} className="bg-card text-foreground">{t}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/75 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Security & Access */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground/90 uppercase tracking-widest border-b border-border pb-1.5">Security & Accessibility</h3>
              
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Downloads toggle */}
                <div className="flex items-start gap-3 flex-1 p-4 rounded-xl border border-border bg-muted/20">
                  <input
                    type="checkbox"
                    id="allowDownloads"
                    name="allowDownloads"
                    checked={formData.allowDownloads}
                    onChange={handleFormChange}
                    className="mt-1 h-4 w-4 rounded-sm border-border bg-muted focus:ring-primary focus:ring-2 cursor-pointer"
                  />
                  <div className="space-y-0.5 cursor-pointer" onClick={() => setFormData((p) => ({ ...p, allowDownloads: !p.allowDownloads }))}>
                    <Label className="text-xs font-bold text-foreground flex items-center gap-1.5 cursor-pointer">
                      <Download size={14} /> Allow Photo Downloads
                    </Label>
                    <p className="text-[10px] text-muted-foreground">Allow guests to download individual images and full gallery ZIP albums.</p>
                  </div>
                </div>

                {/* Password Protection */}
                <div className="flex items-start gap-3 flex-1 p-4 rounded-xl border border-border bg-muted/20">
                  <input
                    type="checkbox"
                    id="isPasswordProtected"
                    name="isPasswordProtected"
                    checked={formData.isPasswordProtected}
                    onChange={handleFormChange}
                    className="mt-1 h-4 w-4 rounded-sm border-border bg-muted focus:ring-primary focus:ring-2 cursor-pointer"
                  />
                  <div className="space-y-0.5 cursor-pointer" onClick={() => setFormData((p) => ({ ...p, isPasswordProtected: !p.isPasswordProtected }))}>
                    <Label className="text-xs font-bold text-foreground flex items-center gap-1.5 cursor-pointer">
                      <Shield size={14} /> Password Protection
                    </Label>
                    <p className="text-[10px] text-muted-foreground">Lock access to this gallery with a custom entry password.</p>
                  </div>
                </div>
              </div>

              {/* Password text field */}
              {formData.isPasswordProtected && (
                <div className="space-y-1.5 pt-1 animate-in fade-in slide-in-from-top-2 duration-200 max-w-sm">
                  <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Gallery Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="text"
                    required={formData.isPasswordProtected}
                    value={formData.password}
                    onChange={handleFormChange}
                    placeholder="e.g. Wedding2026"
                    className="bg-muted/50 border-border text-xs h-10 px-3"
                  />
                </div>
              )}
            </div>
          </CardContent>

          {/* Form Actions */}
          <div className="p-6 pt-2 border-t border-border bg-muted/10 flex justify-end items-center gap-3">
            <Button href="/admin" variant="ghost" size="sm" className="text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} size="sm" className="text-xs font-semibold px-5">
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin mr-2" />
                  Creating Gallery…
                </>
              ) : (
                "Create Gallery"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
