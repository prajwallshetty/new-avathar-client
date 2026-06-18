import PageTransition from "@/components/layout/PageTransition";
import ContactForm from "@/components/contact/ContactForm";
import SectionHeading from "@/components/ui/SectionHeading";
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export const metadata = {
  title: "Contact | New Avatar Photography",
  description: "Inquire about our photography services for your upcoming wedding or event.",
};

export default function ContactPage() {
  return (
    <PageTransition>
      <div className="pt-24 pb-32 bg-brand-bg min-h-screen">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <SectionHeading 
            title="Let's Connect" 
            subtitle="Inquiries" 
            className="mb-16 md:mb-24"
          />

          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            {/* Form Side */}
            <div className="w-full lg:w-3/5">
              <ContactForm />
            </div>

            {/* Info Side */}
            <div className="w-full lg:w-2/5 flex flex-col justify-center">
              <div className="mb-12">
                <h3 className="font-playfair text-2xl text-brand-text mb-6 tracking-wider">Direct Contact</h3>
                <p className="text-brand-mutedLight font-inter font-light mb-8 max-w-sm leading-relaxed">
                  We take on a limited number of events each year to ensure the highest quality of service. Please provide as much detail as possible.
                </p>
                
                <div className="space-y-6">
                  <a href="mailto:hello@newavatar.com" className="flex items-center gap-4 text-brand-muted hover:text-brand-gold transition-colors group">
                    <div className="w-12 h-12 flex items-center justify-center border border-brand-border rounded-full group-hover:border-brand-gold transition-colors">
                      <FaEnvelope />
                    </div>
                    <span className="font-inter tracking-wide text-sm">hello@newavatar.com</span>
                  </a>
                  
                  <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-brand-muted hover:text-brand-gold transition-colors group">
                    <div className="w-12 h-12 flex items-center justify-center border border-brand-border rounded-full group-hover:border-[#25D366] transition-colors">
                      <FaWhatsapp className="group-hover:text-[#25D366] transition-colors" />
                    </div>
                    <span className="font-inter tracking-wide text-sm">+91 98765 43210</span>
                  </a>
                  
                  <div className="flex items-center gap-4 text-brand-muted">
                    <div className="w-12 h-12 flex items-center justify-center border border-brand-border rounded-full">
                      <FaMapMarkerAlt />
                    </div>
                    <span className="font-inter tracking-wide text-sm text-brand-mutedLight">Available Worldwide.<br/>Based in Bangalore, India.</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
