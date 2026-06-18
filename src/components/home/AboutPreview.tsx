"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";

export default function AboutPreview() {
  return (
    <section className="py-24 md:py-32 bg-brand-bg overflow-hidden relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          <div className="w-full lg:w-1/2 relative">
            <ScrollReveal direction="right" delay={0.2} className="relative aspect-[4/5] w-full max-w-md mx-auto lg:ml-auto">
              <Image
                src="/prewedding/2N2A4803.jpg.jpeg"
                alt="Photographer at work"
                fill
                className="object-cover z-10"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute -inset-4 border border-brand-gold/30 z-0 transform translate-x-4 translate-y-4" />
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-brand-surface z-20 hidden md:flex items-center justify-center p-6 border border-brand-border text-center">
                <p className="font-playfair text-brand-gold text-sm tracking-widest leading-relaxed">
                  "WE CAPTURE<br/>THE FLEETING<br/>MOMENTS."
                </p>
              </div>
            </ScrollReveal>
          </div>

          <div className="w-full lg:w-1/2 lg:pl-10">
            <ScrollReveal direction="left" delay={0.1}>
              <p className="font-inter tracking-[0.2em] text-brand-gold text-xs uppercase mb-6">
                Our Story
              </p>
            </ScrollReveal>
            
            <ScrollReveal direction="left" delay={0.2}>
              <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-brand-text tracking-wider mb-8">
                The Artists Behind The Lens
              </h2>
            </ScrollReveal>
            
            <ScrollReveal direction="left" delay={0.3}>
              <p className="font-cormorant text-xl text-brand-muted italic mb-6">
                We believe that every love story is a piece of art waiting to be framed. 
              </p>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.4}>
              <p className="text-brand-mutedLight font-inter font-light leading-relaxed mb-10 max-w-lg">
                At New Avathar Photography, we specialize in high-end, editorial-style wedding photography and cinematic films. Our approach blends raw emotion with stylized composition to create ageless visual narratives.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.5}>
              <Button href="/about" variant="outline">
                Discover Our Journey
              </Button>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
