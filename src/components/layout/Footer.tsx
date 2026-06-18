import Link from "next/link";
import { FaInstagram, FaWhatsapp, FaEnvelope, FaVimeo } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-surface pt-24 pb-12 border-t border-brand-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-2">
            <h2 className="font-playfair text-2xl tracking-widest text-brand-text mb-2">
              NEW AVATAR
            </h2>
            <p className="text-brand-gold tracking-[0.2em] text-xs font-inter mb-6">
              PHOTOGRAPHY
            </p>
            <p className="font-cormorant text-brand-mutedLight text-lg max-w-sm leading-relaxed mb-8 italic">
              "We don't just take photographs, we create cinematic legacies.
              Documenting the extraordinary, the raw, and the beautiful."
            </p>
            <div className="flex space-x-5">
              <a href="#" className="text-brand-mutedLight hover:text-brand-gold transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-brand-mutedLight hover:text-brand-gold transition-colors">
                <FaVimeo size={20} />
              </a>
              <a href="#" className="text-brand-mutedLight hover:text-brand-gold transition-colors">
                <FaWhatsapp size={20} />
              </a>
              <a href="#" className="text-brand-mutedLight hover:text-brand-gold transition-colors">
                <FaEnvelope size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-inter tracking-widest text-sm text-brand-text mb-6 uppercase">Explore</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-brand-mutedLight hover:text-brand-gold transition-colors font-inter text-sm tracking-wide">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-brand-mutedLight hover:text-brand-gold transition-colors font-inter text-sm tracking-wide">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-brand-mutedLight hover:text-brand-gold transition-colors font-inter text-sm tracking-wide">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-brand-mutedLight hover:text-brand-gold transition-colors font-inter text-sm tracking-wide">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-brand-mutedLight hover:text-brand-gold transition-colors font-inter text-sm tracking-wide">
                  Inquire
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-inter tracking-widest text-sm text-brand-text mb-6 uppercase">Contact</h3>
            <ul className="space-y-4 text-brand-mutedLight font-inter text-sm tracking-wide">
              <li>
                <a href="mailto:hello@newavatar.com" className="hover:text-brand-gold transition-colors">
                  hello@newavatar.com
                </a>
              </li>
              <li>
                <a href="tel:+919876543210" className="hover:text-brand-gold transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="pt-2 leading-relaxed text-brand-mutedLight">
                Available worldwide.<br />
                Based in Bangalore, India.
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs tracking-wider font-inter text-brand-mutedLight">
          <p>&copy; {currentYear} New Avatar Photography. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-brand-text transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-text transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
