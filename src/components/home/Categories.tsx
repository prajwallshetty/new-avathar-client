"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";

const categories = [
  {
    id: "wedding",
    title: "Wedding",
    desc: "Cinematic memories of your most sacred day",
    src: "/wedding/JKP00868.jpg.jpeg",
    count: "120+ Stories",
  },
  {
    id: "pre-wedding",
    title: "Pre-Wedding",
    desc: "Epic journeys before the 'I Do'",
    src: "/prewedding/2N2A3890.jpg.jpeg",
    count: "80+ Sessions",
  },
  {
    id: "reception",
    title: "Reception",
    desc: "Celebrations that last a lifetime",
    src: "/reception/RAVI1026.jpg.jpeg",
    count: "60+ Events",
  },
  {
    id: "haldi",
    title: "Haldi",
    desc: "Vibrant colours, pure joy",
    src: "/haldi/RAVI0201.jpg.jpeg",
    count: "50+ Moments",
  },
  {
    id: "portraits",
    title: "Portraits",
    desc: "Editorial and fine-art portraiture",
    src: "/Portraits/JKP00422.jpg.jpeg",
    count: "200+ Frames",
  },
];

export default function Categories() {
  return (
    <section className="py-24 bg-brand-surface">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading title="Specialties" subtitle="What We Do" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {categories.map((cat, index) => (
            <ScrollReveal
              key={cat.id}
              direction="up"
              delay={0.08 * index}
              className="relative aspect-[3/4] group overflow-hidden cursor-pointer"
            >
              <Link href={`/gallery?category=${cat.id}`} className="block w-full h-full">
                <motion.div
                  className="w-full h-full relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <Image
                    src={cat.src}
                    alt={cat.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 transition-opacity duration-300" />
                </motion.div>

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  {/* Count — slides up on hover */}
                  <span className="font-inter text-[#D4AF72] text-[9px] tracking-[0.25em] uppercase mb-2
                    opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                    transition-all duration-300">
                    {cat.count}
                  </span>

                  {/* Title — ALWAYS visible */}
                  <h3 className="font-playfair text-xl sm:text-lg lg:text-xl text-white tracking-wide
                    [text-shadow:0_2px_12px_rgba(0,0,0,0.95),0_0_6px_rgba(0,0,0,1)]">
                    {cat.title}
                  </h3>

                  {/* Gold divider + desc — reveal on hover */}
                  <div className="overflow-hidden">
                    <p className="font-inter text-white/70 text-[11px] tracking-wide mt-2
                      opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0
                      transition-all duration-400 delay-75">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="h-px bg-[#D4AF72] mt-3 w-0 group-hover:w-8 transition-all duration-500 delay-100" />
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
