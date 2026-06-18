"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      // Reset after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-xs font-inter tracking-widest text-brand-mutedLight uppercase">Name</label>
              <input 
                type="text" 
                id="name" 
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
                disabled={status === "submitting"}
                className="w-full bg-brand-bg border-b border-brand-border px-4 py-3 text-brand-mutedLight focus:outline-none focus:border-brand-gold transition-colors font-inter text-sm disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="type" className="block text-xs font-inter tracking-widest text-brand-mutedLight uppercase">Event Type</label>
              <select 
                id="type" 
                disabled={status === "submitting"}
                className="w-full bg-brand-bg border-b border-brand-border px-4 py-3 text-brand-mutedLight focus:outline-none focus:border-brand-gold transition-colors font-inter text-sm disabled:opacity-50 appearance-none"
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
