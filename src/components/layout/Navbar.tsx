"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home",      href: "/" },
  { name: "Portfolio", href: "/gallery" },
  { name: "Our Story", href: "/about" },
  { name: "Contact",   href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  // Transparent only on homepage before scroll
  const isTransparent = isHome && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Check immediately on mount
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isTransparent
            ? "bg-transparent py-7"
            : "bg-[#0D0B08] border-b border-[#D4AF72]/15 py-4 shadow-lg shadow-black/30"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-14 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="group flex flex-col leading-none shrink-0">
            <span
              className={`font-playfair text-xl tracking-[0.2em] transition-colors duration-300
                group-hover:text-[#D4AF72]
                ${isTransparent
                  ? "text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.9)]"
                  : "text-[#F7F1E6]"
                }`}
            >
              NEW AVATHAR
            </span>
            <span
              className={`font-inter text-[7.5px] tracking-[0.4em] uppercase mt-1 transition-colors duration-300
                ${isTransparent ? "text-[#D4AF72]" : "text-[#D4AF72]/80"}`}
            >
              Photography
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              const isInquire = link.name === "Contact";

              if (isInquire) {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`font-inter text-[10px] tracking-[0.25em] uppercase px-5 py-2
                      border border-[#D4AF72]/60 text-[#D4AF72]
                      hover:border-[#D4AF72] hover:bg-[#D4AF72]/10
                      transition-all duration-300`}
                  >
                    Inquire
                  </Link>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative font-inter text-[10px] tracking-[0.25em] uppercase
                    transition-colors duration-300 pb-0.5 group/link
                    ${isTransparent
                      ? active ? "text-[#D4AF72]" : "text-white/85 hover:text-white"
                      : active ? "text-[#D4AF72]" : "text-[#9E9383] hover:text-[#F7F1E6]"
                    }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-[#D4AF72] transition-all duration-300
                      ${active ? "w-full" : "w-0 group-hover/link:w-full"}`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* ── Mobile hamburger ── */}
          <button
            className="md:hidden z-50 w-9 h-9 flex flex-col items-center justify-center gap-[5px] focus:outline-none"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`block h-px transition-all duration-300 origin-center
                ${menuOpen ? "w-5 rotate-45 translate-y-[6px] bg-white" : "w-6 bg-white"}`}
            />
            <span
              className={`block h-px w-4 transition-all duration-300
                ${menuOpen ? "opacity-0 scale-x-0" : "bg-[#D4AF72]"}`}
            />
            <span
              className={`block h-px transition-all duration-300 origin-center
                ${menuOpen ? "w-5 -rotate-45 -translate-y-[6px] bg-white" : "w-6 bg-white"}`}
            />
          </button>
        </div>
      </header>

      {/* ── Mobile full-screen menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{ background: "rgba(13,11,8,0.97)", backdropFilter: "blur(20px)" }}
          >
            {/* Logo repeat inside menu */}
            <div className="h-[72px] flex items-center px-6 border-b border-white/[0.06]">
              <span className="font-playfair text-lg tracking-[0.2em] text-[#F7F1E6]">
                NEW AVATHAR
              </span>
            </div>

            {/* Links */}
            <div className="flex-1 flex flex-col justify-center px-8 gap-1">
              {navLinks.map((link, i) => {
                const active = pathname === link.href;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.055 + 0.05, duration: 0.3, ease: "easeOut" }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center justify-between py-5 border-b border-white/[0.07]
                        font-playfair text-3xl sm:text-4xl tracking-wide
                        transition-colors duration-200
                        ${active ? "text-[#D4AF72]" : "text-white/75 hover:text-white"}`}
                    >
                      {link.name}
                      {active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF72] shrink-0" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="px-8 pb-10 pt-6 border-t border-white/[0.06] flex items-center gap-7"
            >
              <a href="#" className="font-inter text-[9px] tracking-[0.3em] uppercase text-white/35 hover:text-[#D4AF72] transition-colors">
                Instagram
              </a>
              <span className="w-px h-3 bg-white/15" />
              <a href="#" className="font-inter text-[9px] tracking-[0.3em] uppercase text-white/35 hover:text-[#D4AF72] transition-colors">
                Facebook
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
