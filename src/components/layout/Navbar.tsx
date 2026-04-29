"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Portfolio", href: "/gallery" },
  { name: "Our Story", href: "/about" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled || isMenuOpen
            ? "bg-brand-bg/90 backdrop-blur-md py-4 shadow-md shadow-black/50"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="z-50 relative group">
            <h1 className="font-playfair text-xl tracking-widest text-brand-text leading-none">
              NEW AVATHAR
              <span className="block text-[0.6rem] font-inter tracking-[0.3em] text-brand-gold mt-1 transition-colors group-hover:text-brand-text">
                PHOTOGRAPHY
              </span>
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm tracking-widest font-inter transition-all duration-300 relative ${
                    isActive
                      ? "text-brand-gold"
                      : "text-brand-muted hover:text-brand-text"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute -bottom-2 left-0 right-0 h-px bg-brand-gold"
                      initial={false}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="border border-brand-gold text-brand-gold px-6 py-2.5 text-sm tracking-widest font-inter transition-all duration-300 hover:bg-brand-gold hover:text-brand-black"
            >
              INQUIRE
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden z-50 flex flex-col space-y-1.5 focus:outline-none p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span
              className={`block w-6 h-[2px] bg-white transition-transform duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-[8px]" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-[2px] bg-white transition-opacity duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-[2px] bg-brand-gold transition-transform duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-[8px] bg-white" : ""
              }`}
            ></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-10%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-10%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-brand-bg/95 backdrop-blur-xl flex flex-col justify-center items-center h-screen w-screen"
          >
            <div className="flex flex-col items-center space-y-8 w-full px-6">
              {[...navLinks, { name: "Inquire", href: "/contact" }].map(
                (link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i + 0.2 }}
                    className="w-full text-center"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`text-3xl font-playfair tracking-wider block py-4 ${
                        pathname === link.href
                          ? "text-brand-gold"
                          : "text-brand-text"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                )
              )}
            </div>
            
            <motion.div 
              className="absolute bottom-12 flex space-x-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
                <a href="#" className="text-brand-mutedLight hover:text-brand-gold transition-colors">Instagram</a>
                <a href="#" className="text-brand-mutedLight hover:text-brand-gold transition-colors">Vimeo</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
