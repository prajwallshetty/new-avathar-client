"use client";

import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";

const featuredImages = [
  { id: 1, src: "/JKP00422.jpg.jpeg", alt: "Editorial Wedding", category: "Weddings", className: "md:col-span-2 md:row-span-2" },
  { id: 2, src: "/RAVI1026.jpg.jpeg", alt: "Pre-wedding shoot", category: "Pre-Wedding", className: "md:col-span-1 md:row-span-1" },
  { id: 3, src: "/JKP00510.jpg.jpeg", alt: "Bride portrait", category: "Portraits", className: "md:col-span-1 md:row-span-1" },
  { id: 4, src: "/2N2A4012.jpg.jpeg", alt: "Event decor", category: "Events", className: "md:col-span-2 md:row-span-1" },
];

export default function FeaturedWork() {
  return (
    <section className="py-24 md:py-32 bg-brand-bg w-full">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading title="Featured Work" subtitle="Selected Portfolio" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px] mb-16">
          {featuredImages.map((img, index) => (
            <ScrollReveal
              key={img.id}
              direction="up"
              delay={0.1 * index}
              className={`relative group overflow-hidden ${img.className}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center">
                <span className="font-inter tracking-widest text-brand-gold text-xs uppercase mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {img.category}
                </span>
                <Link
                  href="/gallery"
                  className="font-playfair text-brand-text text-xl md:text-2xl tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75"
                >
                  View Details
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up" className="flex justify-center">
          <Button href="/gallery" variant="outline">
            Explore Full Gallery
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
