"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function StorySection() {
  return (
    <section className="pt-24 pb-16 bg-brand-bg overflow-hidden">
      {/* Hero Image */}
      <div className="relative h-[60vh] md:h-[80vh] w-full mb-20 md:mb-32">
        <Image
          src="/prewedding/2N2A4013.jpg.jpeg"
          alt="New Avatar Story"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-brand-bg/60 flex items-center justify-center">
          <ScrollReveal direction="up">
            <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl text-brand-text tracking-widest text-center px-4">
              OUR <span className="italic font-cormorant text-brand-gold">STORY</span>
            </h1>
          </ScrollReveal>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl">
        <ScrollReveal direction="up" className="mb-16 md:mb-32 text-center">
          <p className="font-cormorant text-2xl md:text-4xl text-brand-muted italic leading-relaxed">
            "Photography is not just about seeing. It's about feeling. We don't document events; we capture the essence of your legacy."
          </p>
        </ScrollReveal>

        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center mb-24 md:mb-40">
          <div className="w-full md:w-5/12">
            <ScrollReveal direction="right">
              <div className="relative aspect-[3/4] w-full border border-brand-gold/20 p-2">
                <Image
                  src="/reception/RAVI0978.jpg.jpeg"
                  alt="The Lead Photographer"
                  fill
                  className="object-cover border border-brand-charcoal"
                />
              </div>
            </ScrollReveal>
          </div>
          <div className="w-full md:w-7/12">
            <ScrollReveal direction="left" delay={0.2}>
              <p className="font-inter tracking-[0.2em] text-brand-gold text-xs uppercase mb-6">The Beginning</p>
              <h2 className="font-playfair text-3xl md:text-5xl text-brand-text mb-6">Born from a passion for cinematic arts.</h2>
              <p className="text-brand-mutedLight font-inter font-light leading-relaxed mb-6">
                New Avatar Photography started with a simple belief: weddings and milestones shouldn't be photographed like standard events. They should be captured like epic films. 
              </p>
              <p className="text-brand-mutedLight font-inter font-light leading-relaxed">
                Drawing inspiration from high-fashion editorial spreads and classic cinema, we developed a distinctive style that relies on dramatic lighting, intentional composition, and an unflinching focus on raw emotion.
              </p>
            </ScrollReveal>
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row gap-12 md:gap-20 items-center">
          <div className="w-full md:w-7/12">
            <ScrollReveal direction="right" delay={0.2}>
              <p className="font-inter tracking-[0.2em] text-brand-gold text-xs uppercase mb-6">Our Philosophy</p>
              <h2 className="font-playfair text-3xl md:text-5xl text-brand-text mb-6">Luxury is an experience, not just a price tag.</h2>
              <p className="text-brand-mutedLight font-inter font-light leading-relaxed mb-6">
                From the moment we first speak until the final handcrafted album is delivered to your hands, our process is designed to be seamless, bespoke, and deeply personal.
              </p>
              <p className="text-brand-mutedLight font-inter font-light leading-relaxed">
                We take on a limited number of commissions each year to ensure that every story receives the obsessive attention to detail it deserves. You are not just a client; you are our muse.
              </p>
            </ScrollReveal>
          </div>
          <div className="w-full md:w-5/12">
            <ScrollReveal direction="left">
              <div className="relative aspect-square md:aspect-[4/5] w-[80%] ml-auto border border-brand-gold/20 p-2">
                <Image
                  src="/prewedding/2N2A4925.jpg.jpeg"
                  alt="Our Approach"
                  fill
                  className="object-cover border border-brand-charcoal"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
