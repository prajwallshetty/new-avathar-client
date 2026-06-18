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
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/95 via-brand-black/30 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-300" />
                </motion.div>

                {/* Content */}
                <div className="absolute inset-0 p-7 flex flex-col justify-end">
                  <span className="font-inter text-brand-gold text-[10px] tracking-[0.22em] uppercase mb-2 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-400">
                    {cat.count}
                  </span>
                  <h3 className="font-playfair text-xl text-brand-text tracking-wide mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    {cat.title}
                  </h3>
                  <p className="font-inter text-brand-mutedLight text-xs tracking-wide transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                    {cat.desc}
                  </p>
                  <div className="w-0 h-px bg-brand-gold mt-4 group-hover:w-10 transition-all duration-500 delay-150" />
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
