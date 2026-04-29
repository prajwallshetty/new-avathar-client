"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface LightboxProps {
  images: { src: string; alt: string; category?: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-brand-bg/95 backdrop-blur-xl flex items-center justify-center pt-20 pb-10 px-4 md:px-20"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 md:top-10 md:right-10 text-brand-text hover:text-brand-gold transition-colors z-50 p-2"
        >
          <FaTimes className="text-3xl" />
        </button>

        <button
          onClick={onPrev}
          className="absolute left-2 md:left-10 text-brand-text/50 hover:text-brand-text hover:scale-110 transition-all z-50 p-4"
        >
          <FaChevronLeft className="text-3xl md:text-5xl" />
        </button>

        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="relative w-full h-full max-w-6xl max-h-[85vh]"
          >
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
            {images[currentIndex].category && (
              <div className="absolute bottom-[-40px] left-0 right-0 text-center font-inter tracking-widest text-brand-gold text-xs uppercase">
                {images[currentIndex].category}
              </div>
            )}
          </motion.div>
        </div>

        <button
          onClick={onNext}
          className="absolute right-2 md:right-10 text-brand-text/50 hover:text-brand-text hover:scale-110 transition-all z-50 p-4"
        >
          <FaChevronRight className="text-3xl md:text-5xl" />
        </button>
        
        <div className="absolute bottom-6 left-0 right-0 text-center text-brand-text/50 font-inter tracking-[0.2em] text-xs">
          {currentIndex + 1} / {images.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
