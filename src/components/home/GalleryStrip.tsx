"use client";

import Image from "next/image";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";

const stripImages = [
  "/wedding/JKP00465.jpg.jpeg",
  "/prewedding/2N2A4012.jpg.jpeg",
  "/reception/RAVI1087.jpg.jpeg",
  "/haldi/RAVI9939.jpg.jpeg",
  "/Portraits/JKP00422.jpg.jpeg",
  "/wedding/JKP00602.jpg.jpeg",
  "/prewedding/2N2A5560.jpg.jpeg",
  "/reception/RAVI0978.jpg.jpeg",
];

// Duplicate for seamless loop
const loopImages = [...stripImages, ...stripImages];

export default function GalleryStrip() {
  return (
    <section className="py-0 bg-brand-bg overflow-hidden relative group">

      {/* Instagram overlay — desktop hover only */}
      <Link
        href="https://instagram.com"
        target="_blank"
        className="absolute inset-0 z-20 hidden sm:flex items-center justify-center
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40"
      >
        <div className="bg-[#D4AF72] text-[#0D0B08] font-inter text-xs tracking-widest uppercase px-6 py-3 flex items-center gap-3">
          <FaInstagram className="text-lg" />
          Follow @newavathar
        </div>
      </Link>

      {/* Marquee track — uses CSS animation via inline keyframes */}
      <div
        className="flex"
        style={{
          width: "max-content",
          animation: "marquee-scroll 28s linear infinite",
          willChange: "transform",
        }}
      >
        {loopImages.map((src, index) => (
          <div
            key={index}
            className="relative aspect-square flex-shrink-0"
            style={{ width: "clamp(120px, 25vw, 200px)" }}
          >
            <Image
              src={src}
              alt="Gallery"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
              sizes="200px"
            />
          </div>
        ))}
      </div>

      {/* Keyframe injected via <style> tag — works in App Router without jsx pragma */}
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
