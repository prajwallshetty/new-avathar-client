"use client";

import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";

const featuredImages = [
  {
    id: 1,
    src: "/wedding/JKP00510.jpg.jpeg",
    alt: "Wedding Day",
    category: "Wedding",
    href: "/gallery?category=wedding",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    src: "/prewedding/2N2A3948.jpg.jpeg",
    alt: "Pre-wedding shoot",
    category: "Pre-Wedding",
    href: "/gallery?category=pre-wedding",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: 3,
    src: "/haldi/RAVI0201.jpg.jpeg",
    alt: "Haldi Ceremony",
    category: "Haldi",
    href: "/gallery?category=haldi",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: 4,
    src: "/reception/RAVI1026.jpg.jpeg",
    alt: "Reception Evening",
    category: "Reception",
    href: "/gallery?category=reception",
    className: "md:col-span-2 md:row-span-1",
  },
];

export default function FeaturedWork() {
  return (
    <section className="py-24 md:py-32 bg-brand-bg w-full">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading title="Featured Work" subtitle="Selected Portfolio" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[260px] md:auto-rows-[300px] mb-16">
          {featuredImages.map((img, index) => (
            <ScrollReveal
              key={img.id}
              direction="up"
              delay={0.1 * index}
              className={`relative group overflow-hidden ${img.className}`}
            >
              <Link href={img.href} className="block w-full h-full">
                {/* Image */}
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Always-visible gradient scrim at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Category label — always visible at bottom-left */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col">
                  <span
                    className="font-inter text-[#D4AF72] text-[10px] tracking-[0.28em] uppercase mb-1
                               [text-shadow:0_1px_8px_rgba(0,0,0,1)]"
                  >
                    {img.category}
                  </span>
                  <span
                    className="font-playfair text-white text-lg tracking-wide
                               [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]
                               opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                               transition-all duration-400"
                  >
                    View Gallery →
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up" className="flex justify-center">
          <Button href="/gallery" variant="outline">
            Explore Full Portfolio
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
