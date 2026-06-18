"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[580px] w-full overflow-hidden -mt-20">
      {/* Background Image — Ken Burns slow zoom */}
      <motion.div
        initial={{ scale: 1.08 }}
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
        {/* Gradient: dark top band for nav legibility, heavy bottom for text */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/85" />
      </motion.div>

      {/* ── Brand block — bottom of the frame ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-10 sm:px-10 sm:pb-12 md:px-16 md:pb-16">

        {/* Tagline — clearly above the title */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1.2 }}
          className="font-inter text-[#D4AF72] text-[10px] sm:text-xs tracking-[0.35em] uppercase mb-4
                     [text-shadow:0_2px_16px_rgba(0,0,0,1),0_0_8px_rgba(0,0,0,0.9)]"
        >
          Capturing Stories Beyond Frames
        </motion.p>

        {/* Studio name */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1.4, ease: "easeOut" }}
          className="font-playfair text-[11vw] sm:text-7xl md:text-8xl lg:text-[90px] xl:text-[110px]
                     text-white leading-none tracking-[0.08em]
                     [text-shadow:0_4px_40px_rgba(0,0,0,0.95),0_2px_10px_rgba(0,0,0,1)]"
        >
          NEW AVATHAR
        </motion.h1>

        {/* Divider + subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 1.1 }}
          className="flex items-center gap-4 mt-4"
        >
          <div className="w-10 sm:w-14 h-px bg-[#D4AF72] flex-shrink-0" />
          <p className="font-inter text-white/75 text-[9px] sm:text-xs tracking-[0.22em] uppercase
                        [text-shadow:0_1px_10px_rgba(0,0,0,0.9)]">
            Luxury Fine Art Photography &amp; Cinematography
          </p>
        </motion.div>
      </div>
    </section>
  );
}
