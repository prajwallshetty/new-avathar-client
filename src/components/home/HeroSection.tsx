"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden flex items-center justify-center -mt-20">
      {/* Background Image with slow zoom animation to simulate video/cinematic feel */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/hero.jpeg"
          alt="Cinematic Wedding Couple"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/60 via-brand-black/40 to-brand-black/90" />
      </motion.div>

      <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto flex flex-col items-center">
        <ScrollReveal direction="down" duration={1.2} delay={0.2}>
          <p className="font-inter tracking-[0.4em] text-brand-gold text-xs sm:text-sm uppercase mb-6 drop-shadow-md">
            Capturing Stories Beyond Frames
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" duration={1.5} delay={0.4}>
          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl text-brand-text tracking-widest leading-tight drop-shadow-xl mb-4">
            NEW<br className="md:hidden" /> AVATHAR
          </h1>
        </ScrollReveal>
        
        <ScrollReveal direction="up" duration={1.5} delay={0.6}>
          <p className="font-cormorant text-xl md:text-3xl text-brand-muted italic max-w-2xl mx-auto mt-6 drop-shadow-md">
            Luxury Fine Art Photography & Cinematography
          </p>
        </ScrollReveal>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth"
          });
        }}
      >
        <span className="font-inter text-[10px] tracking-[0.3em] text-brand-text/70 uppercase mb-3 text-vertical">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-brand-gold to-transparent"
        />
      </motion.div>
    </section>
  );
}
