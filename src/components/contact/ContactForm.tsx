"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      date: formData.get("date"),
      type: formData.get("type"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
        // Reset state back to idle after 5 seconds to allow sending another inquiry
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to submit inquiry. Please try again.");
        setStatus("error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMsg("Network error. Please try again later.");
      setStatus("error");
    }
  };

  return (
    <div className="bg-brand-surface p-8 md:p-12 border border-brand-border">
      <h3 className="font-playfair text-3xl text-brand-text mb-8">Send an Inquiry</h3>
      
      {status === "success" ? (
        <div className="bg-brand-gold/10 border border-brand-gold/30 p-6 text-center animate-in fade-in zoom-in duration-500">
          <p className="font-playfair text-2xl text-brand-gold mb-2">Thank You</p>
          <p className="text-brand-mutedLight font-inter text-sm">We've received your request and will get back to you within 24 hours.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {status === "error" && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-sm text-red-400 text-xs font-inter text-center animate-in fade-in duration-300">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-xs font-inter tracking-widest text-brand-mutedLight uppercase">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                required
                disabled={status === "submitting"}
                className="w-full bg-brand-bg border-b border-brand-border px-4 py-3 text-brand-text focus:outline-none focus:border-brand-gold transition-colors font-inter text-sm disabled:opacity-50"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-xs font-inter tracking-widest text-brand-mutedLight uppercase">Phone</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                required
                disabled={status === "submitting"}
                className="w-full bg-brand-bg border-b border-brand-border px-4 py-3 text-brand-text focus:outline-none focus:border-brand-gold transition-colors font-inter text-sm disabled:opacity-50"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs font-inter tracking-widest text-brand-mutedLight uppercase">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              required
              disabled={status === "submitting"}
              className="w-full bg-brand-bg border-b border-brand-border px-4 py-3 text-brand-text focus:outline-none focus:border-brand-gold transition-colors font-inter text-sm disabled:opacity-50"
              placeholder="john@example.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="date" className="block text-xs font-inter tracking-widest text-brand-mutedLight uppercase">Event Date</label>
              <input 
                type="date" 
                id="date" 
                name="date"
                disabled={status === "submitting"}
                className="w-full bg-brand-bg border-b border-brand-border px-4 py-3 text-brand-mutedLight focus:outline-none focus:border-brand-gold transition-colors font-inter text-sm disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="type" className="block text-xs font-inter tracking-widest text-brand-mutedLight uppercase">Event Type</label>
              <select 
                id="type" 
                name="type"
                disabled={status === "submitting"}
                className="w-full bg-brand-bg border-b border-brand-border px-4 py-3 text-brand-mutedLight focus:outline-none focus:border-brand-gold transition-colors font-inter text-sm disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a0a0a0%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E')] bg-[length:0.65rem_auto] bg-[right_1rem_center] bg-no-repeat pr-8"
              >
                <option value="wedding">Wedding</option>
                <option value="pre-wedding">Pre-Wedding / Engagement</option>
                <option value="portrait">Portrait Session</option>
                <option value="event">Commercial / Luxury Event</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-xs font-inter tracking-widest text-brand-mutedLight uppercase">Tell us about your day</label>
            <textarea 
              id="message" 
              name="message"
              rows={4}
              required
              disabled={status === "submitting"}
              className="w-full bg-brand-bg border-b border-brand-border px-4 py-3 text-brand-text focus:outline-none focus:border-brand-gold transition-colors font-inter text-sm disabled:opacity-50 resize-none"
              placeholder="Share some details about your vision, location, and what you're looking for..."
            />
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              variant="default" 
              className={`w-full ${status === "submitting" ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {status === "submitting" ? "Sending..." : "Submit Inquiry"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

