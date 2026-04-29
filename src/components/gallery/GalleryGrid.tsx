"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Lightbox from "./Lightbox";

const allImages = [
  { id: 1, src: "/2N2A3890.jpg.jpeg", alt: "Wedding 1", category: "Weddings", ratio: "aspect-[3/4]" },
  { id: 2, src: "/RAVI1026.jpg.jpeg", alt: "Pre-wedding 1", category: "Pre-Wedding", ratio: "aspect-[16/9]" },
  { id: 3, src: "/JKP00510.jpg.jpeg", alt: "Portrait 1", category: "Portraits", ratio: "aspect-[3/4]" },
  { id: 4, src: "/2N2A4012.jpg.jpeg", alt: "Event 1", category: "Events", ratio: "aspect-square" },
  { id: 5, src: "/JKP00422.jpg.jpeg", alt: "Wedding 2", category: "Weddings", ratio: "aspect-[16/9]" },
  { id: 6, src: "/RAVI0201.jpg.jpeg", alt: "Pre-wedding 2", category: "Pre-Wedding", ratio: "aspect-[3/4]" },
  { id: 7, src: "/2N2A4712.jpg.jpeg", alt: "Portrait 2", category: "Portraits", ratio: "aspect-[4/5]" },
  { id: 8, src: "/2N2A6060.jpg.jpeg", alt: "Event 2", category: "Events", ratio: "aspect-video" },
  { id: 9, src: "/JKP00868.jpg.jpeg", alt: "Wedding 3", category: "Weddings", ratio: "aspect-[4/5]" },
  { id: 10, src: "/RAVI0978.jpg.jpeg", alt: "Pre-wedding 3", category: "Pre-Wedding", ratio: "aspect-[3/4]" },
  { id: 11, src: "/2N2A4141.jpg.jpeg", alt: "Portrait 3", category: "Portraits", ratio: "aspect-square" },
  { id: 12, src: "/2N2A6484.jpg.jpeg", alt: "Event 3", category: "Events", ratio: "aspect-[3/4]" },
];

const categories = ["All", "Weddings", "Pre-Wedding", "Events", "Portraits"];

export default function GalleryGrid() {
  const [filter, setFilter] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredImages = filter === "All" 
    ? allImages 
    : allImages.filter(img => img.category === filter);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <>
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-6 mb-16">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`font-inter tracking-[0.2em] text-xs uppercase transition-all duration-300 pb-1 border-b ${
              filter === cat 
                ? "text-brand-gold border-brand-gold" 
                : "text-brand-mutedLight border-transparent hover:text-brand-text"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry-style Grid using columns */}
      <motion.div 
        layout 
        className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
      >
        <AnimatePresence>
          {filteredImages.map((img, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              key={img.id}
              className={`relative break-inside-avoid overflow-hidden group cursor-pointer ${img.ratio} bg-brand-surface`}
              onClick={() => openLightbox(index)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              
              <div className="absolute inset-0 bg-brand-bg/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="font-playfair tracking-wider text-xl text-brand-text transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  View
                </p>
                <div className="absolute bottom-6 font-inter text-xs tracking-widest text-brand-gold uppercase transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                  {img.category}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Lightbox 
        images={filteredImages}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </>
  );
}
