"use client";

import Image from "next/image";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";

const stripImages = [
  "/JKP00465.jpg.jpeg",
  "/RAVI0201.jpg.jpeg",
  "/2N2A4712.jpg.jpeg",
  "/2N2A4884.jpg.jpeg",
  "/2N2A5421.jpg.jpeg",
  "/2N2A6060.jpg.jpeg",
  "/JKP00602.jpg.jpeg",
  "/RAVI1087.jpg.jpeg",
];

export default function GalleryStrip() {
  return (
    <section className="py-0 bg-brand-bg overflow-hidden relative group">
      <Link href="https://instagram.com" target="_blank" className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
        <div className="bg-brand-gold text-brand-black font-inter text-xs tracking-widest uppercase px-6 py-3 flex items-center gap-3">
          <FaInstagram className="text-lg" />
          Follow @newavathar
        </div>
      </Link>

      <div className="flex w-[200%] animate-marquee hover:animation-play-state-paused">
        {[...stripImages, ...stripImages].map((src, index) => (
          <div key={index} className="relative w-1/4 sm:w-1/5 md:w-1/6 lg:w-[12.5%] aspect-square flex-shrink-0">
            <Image
              src={src}
              alt="Instagram Feed"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer"
              sizes="20vw"
            />
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .hover\\:animation-play-state-paused:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
