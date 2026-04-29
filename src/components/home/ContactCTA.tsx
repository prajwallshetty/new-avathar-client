"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";

export default function ContactCTA() {
  return (
    <section className="relative py-32 overflow-hidden flex items-center justify-center bg-brand-bg">
      {/* Parallax Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Image
          src="/2N2A6661.jpg.jpeg"
          alt="Contact background"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-brand-bg/80" />
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center max-w-4xl">
        <ScrollReveal direction="down">
          <p className="font-inter text-brand-gold tracking-[0.3em] uppercase text-sm mb-6">
            Ready to frame your story?
          </p>
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={0.1}>
          <h2 className="font-playfair text-5xl md:text-6xl text-brand-text mb-8 tracking-wider">
            Let's Create Cinematic <br className="hidden md:block" /> Memories Together
          </h2>
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={0.2}>
          <p className="font-cormorant text-xl text-brand-muted italic mb-12 max-w-2xl mx-auto">
            Whether it's a grand celebration, a destination wedding, or an intimate portrait session, 
            we would love to hear from you.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.3}>
          <Button href="/contact" variant="primary" className="mx-auto">
            Inquire Now
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
