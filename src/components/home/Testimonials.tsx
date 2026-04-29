"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    quote: "They didn't just take pictures; they directed a masterpiece. Looking at our photos feels like watching a beautiful movie of the best day of our lives.",
    author: "Elena & Marcus",
    location: "Lake Como Wedding",
    img: "/2N2A5144.jpg.jpeg",
  },
  {
    id: 2,
    quote: "Working with New Avathar was the best decision we made. Their attention to detail, lighting, and raw emotion is unmatched in the industry.",
    author: "Sarah & John",
    location: "Tuscany Pre-Wedding",
    img: "/2N2A4086.jpg.jpeg",
  },
  {
    id: 3,
    quote: "Our portraits look like they belong in Vogue. The luxury experience and the final artwork completely exceeded our highest expectations.",
    author: "Isabella Rossi",
    location: "Editorial Session",
    img: "/2N2A4127.jpg.jpeg",
  }
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 md:py-32 bg-brand-surface overflow-hidden border-y border-brand-border">
      <div className="container mx-auto px-6 max-w-5xl">
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <FaQuoteLeft className="text-brand-gold/30 text-5xl mx-auto mb-6" />
            <h2 className="font-playfair text-3xl md:text-4xl text-brand-text tracking-widest">
              Words of Love
            </h2>
          </div>
        </ScrollReveal>

        <div className="relative min-h-[400px] md:min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col md:flex-row items-center gap-8 md:gap-16"
            >
              <div className="w-32 h-32 md:w-48 md:h-48 relative rounded-full overflow-hidden border-2 border-brand-gold/20 flex-shrink-0">
                <Image
                  src={testimonials[current].img}
                  alt={testimonials[current].author}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center md:text-left flex-1">
                <p className="font-cormorant text-2xl md:text-3xl text-brand-muted italic leading-relaxed mb-8">
                  "{testimonials[current].quote}"
                </p>
                <h4 className="font-inter tracking-[0.2em] text-brand-gold text-xs uppercase mb-1">
                  {testimonials[current].author}
                </h4>
                <p className="text-brand-mutedLight font-inter text-xs tracking-wider">
                  {testimonials[current].location}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-12 space-x-3">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === current ? "bg-brand-gold w-6" : "bg-gray-600 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
