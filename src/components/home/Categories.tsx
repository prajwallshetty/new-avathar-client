"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";

const categories = [
  { id: "weddings", title: "Weddings", desc: "Cinematic memories of your special day", src: "/JKP00868.jpg.jpeg" },
  { id: "pre-wedding", title: "Pre-Wedding", desc: "Epic stories before the 'I Do'", src: "/RAVI2056.jpg.jpeg" },
  { id: "portraits", title: "Portraits", desc: "Editorial and fine-art portraiture", src: "/2N2A4141.jpg.jpeg" },
  { id: "events", title: "Events", desc: "Luxury celebrations perfectly captured", src: "/2N2A6484.jpg.jpeg" },
];

export default function Categories() {
  return (
    <section className="py-24 bg-brand-surface">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading title="Specialties" subtitle="What We Do" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <ScrollReveal
              key={cat.id}
              direction="up"
              delay={0.1 * index}
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                </motion.div>

                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="font-playfair text-2xl text-brand-text tracking-wide mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {cat.title}
                  </h3>
                  <p className="font-inter text-brand-mutedLight text-sm tracking-wide transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                    {cat.desc}
                  </p>
                  <div className="w-0 h-px bg-brand-gold mt-4 group-hover:w-12 transition-all duration-500 delay-150" />
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
