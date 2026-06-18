"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Lightbox from "./Lightbox";

const allImages = [
  // ── Wedding ── /public/wedding/
  { id: 1,  src: "/wedding/JKP00401.jpg.jpeg", alt: "Wedding Ceremony",     category: "Wedding",     ratio: "aspect-[3/4]" },
  { id: 2,  src: "/wedding/JKP00422.jpg.jpeg", alt: "Wedding Couple",       category: "Wedding",     ratio: "aspect-[4/5]" },
  { id: 3,  src: "/wedding/JKP00423.jpg.jpeg", alt: "Bridal Portrait",      category: "Wedding",     ratio: "aspect-square" },
  { id: 4,  src: "/wedding/JKP00465.jpg.jpeg", alt: "Wedding Ritual",       category: "Wedding",     ratio: "aspect-[3/4]" },
  { id: 5,  src: "/wedding/JKP00500.jpg.jpeg", alt: "Bride & Groom",        category: "Wedding",     ratio: "aspect-[16/9]" },
  { id: 6,  src: "/wedding/JKP00510.jpg.jpeg", alt: "Wedding Day",          category: "Wedding",     ratio: "aspect-[4/5]" },
  { id: 7,  src: "/wedding/JKP00602.jpg.jpeg", alt: "Wedding Candid",       category: "Wedding",     ratio: "aspect-[3/4]" },
  { id: 8,  src: "/wedding/JKP00700.jpg.jpeg", alt: "Wedding Portraits",    category: "Wedding",     ratio: "aspect-square" },
  { id: 9,  src: "/wedding/JKP00718.jpg.jpeg", alt: "Bridal Look",          category: "Wedding",     ratio: "aspect-[4/5]" },
  { id: 10, src: "/wedding/JKP00722.jpg.jpeg", alt: "Wedding Moments",      category: "Wedding",     ratio: "aspect-[3/4]" },
  { id: 11, src: "/wedding/JKP00868.jpg.jpeg", alt: "Wedding Decor",        category: "Wedding",     ratio: "aspect-[16/9]" },
  { id: 12, src: "/wedding/RAVI2056.jpg.jpeg", alt: "Wedding Story",        category: "Wedding",     ratio: "aspect-[3/4]" },

  // ── Pre-Wedding ── /public/prewedding/
  { id: 13, src: "/prewedding/2N2A3890.jpg.jpeg", alt: "Pre-Wedding Shoot",   category: "Pre-Wedding", ratio: "aspect-[3/4]" },
  { id: 14, src: "/prewedding/2N2A3948.jpg.jpeg", alt: "Couple Outdoor",      category: "Pre-Wedding", ratio: "aspect-[4/5]" },
  { id: 15, src: "/prewedding/2N2A3958.jpg.jpeg", alt: "Golden Hour",         category: "Pre-Wedding", ratio: "aspect-[16/9]" },
  { id: 16, src: "/prewedding/2N2A3988.jpg.jpeg", alt: "Candid Couple",       category: "Pre-Wedding", ratio: "aspect-square" },
  { id: 17, src: "/prewedding/2N2A4001.jpg.jpeg", alt: "Romantic Shot",       category: "Pre-Wedding", ratio: "aspect-[3/4]" },
  { id: 18, src: "/prewedding/2N2A4012.jpg.jpeg", alt: "Love Story",          category: "Pre-Wedding", ratio: "aspect-[4/5]" },
  { id: 19, src: "/prewedding/2N2A4013.jpg.jpeg", alt: "Couple Goals",        category: "Pre-Wedding", ratio: "aspect-[3/4]" },
  { id: 20, src: "/prewedding/2N2A4039.jpg.jpeg", alt: "Nature Portraits",    category: "Pre-Wedding", ratio: "aspect-square" },
  { id: 21, src: "/prewedding/2N2A4048.jpg.jpeg", alt: "Sunset Shoot",        category: "Pre-Wedding", ratio: "aspect-[16/9]" },
  { id: 22, src: "/prewedding/2N2A4057.jpg.jpeg", alt: "Pre-Wedding Fun",     category: "Pre-Wedding", ratio: "aspect-[3/4]" },
  { id: 23, src: "/prewedding/2N2A4065.jpg.jpeg", alt: "Couple Walk",         category: "Pre-Wedding", ratio: "aspect-[4/5]" },
  { id: 24, src: "/prewedding/2N2A4127.jpg.jpeg", alt: "Together",            category: "Pre-Wedding", ratio: "aspect-[3/4]" },

  // ── Reception ── /public/reception/
  { id: 25, src: "/reception/RAVI0978.jpg.jpeg", alt: "Reception Dance",     category: "Reception",   ratio: "aspect-[3/4]" },
  { id: 26, src: "/reception/RAVI1026.jpg.jpeg", alt: "Reception Stage",     category: "Reception",   ratio: "aspect-[16/9]" },
  { id: 27, src: "/reception/RAVI1087.jpg.jpeg", alt: "Reception Couple",    category: "Reception",   ratio: "aspect-[4/5]" },
  { id: 28, src: "/reception/RAVI1155.jpg.jpeg", alt: "Reception Moments",   category: "Reception",   ratio: "aspect-square" },

  // ── Haldi ── /public/haldi/
  { id: 29, src: "/haldi/RAVI0012.jpg.jpeg", alt: "Haldi Ceremony",      category: "Haldi",       ratio: "aspect-[3/4]" },
  { id: 30, src: "/haldi/RAVI0201.jpg.jpeg", alt: "Haldi Colours",       category: "Haldi",       ratio: "aspect-[16/9]" },
  { id: 31, src: "/haldi/RAVI9807.jpg.jpeg", alt: "Haldi Fun",           category: "Haldi",       ratio: "aspect-[4/5]" },
  { id: 32, src: "/haldi/RAVI9939.jpg.jpeg", alt: "Haldi Celebration",   category: "Haldi",       ratio: "aspect-square" },

  // ── Portraits ── /public/Portraits/
  { id: 33, src: "/Portraits/JKP00401.jpg.jpeg", alt: "Fine Art Portrait",   category: "Portraits",   ratio: "aspect-[3/4]" },
  { id: 34, src: "/Portraits/JKP00422.jpg.jpeg", alt: "Studio Portrait",     category: "Portraits",   ratio: "aspect-[4/5]" },
  { id: 35, src: "/Portraits/JKP00423.jpg.jpeg", alt: "Editorial Portrait",  category: "Portraits",   ratio: "aspect-square" },
  { id: 36, src: "/Portraits/RAVI9807.jpg.jpeg", alt: "Candid Portrait",     category: "Portraits",   ratio: "aspect-[3/4]" },
  { id: 37, src: "/Portraits/RAVI9939.jpg.jpeg", alt: "Outdoor Portrait",    category: "Portraits",   ratio: "aspect-[4/5]" },
];

const categories = ["All", "Wedding", "Pre-Wedding", "Reception", "Haldi", "Portraits"];

export default function GalleryGrid() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  // Normalize incoming category param to match our category labels
  const normalize = (s: string) => s.toLowerCase().replace(/[-\s]/g, "");
  const matchedCategory =
    categories.find((c) => normalize(c) === normalize(initialCategory || "")) || "All";

  const [filter, setFilter] = useState(matchedCategory);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setFilter(matchedCategory);
  }, [matchedCategory]);

  const filteredImages =
    filter === "All" ? allImages : allImages.filter((img) => img.category === filter);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);

  return (
    <>
      {/* Category Filter Tabs */}
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

      {/* Masonry Grid */}
      <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
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
