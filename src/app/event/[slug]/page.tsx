import Image from "next/image";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Event from "@/lib/models/Event";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { FaDownload, FaShare } from "react-icons/fa";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  await connectToDatabase();
  const event = await Event.findOne({ slug: params.slug });
  if (!event) return { title: "Event Not Found" };

  return {
    title: `${event.brideName} & ${event.groomName} | New Avathar`,
    description: `View the official gallery for ${event.brideName} and ${event.groomName}'s ${event.eventType}.`,
  };
}

export default async function ClientEventPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  await connectToDatabase();
  const event = await Event.findOne({ slug: params.slug }).lean();

  if (!event) {
    notFound();
  }

  // Fallback to a placeholder if no cover image
  const coverImage = event.coverImage || "/JKP00401.jpg.jpeg";

  return (
    <div className="bg-[#050505] min-h-screen text-white font-inter">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden flex flex-col items-center justify-center pt-24 pb-12">
        <Image
          src={coverImage}
          alt={`${event.brideName} and ${event.groomName}`}
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505]" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <ScrollReveal direction="down" delay={0.2}>
            <p className="font-inter tracking-[0.4em] text-brand-gold text-xs uppercase mb-6 shadow-black drop-shadow-md">
              {event.eventType}
            </p>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.4}>
            <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl tracking-widest mb-4 shadow-black drop-shadow-xl">
              {event.brideName} <span className="font-cormorant italic text-brand-gold">&</span> {event.groomName}
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.6}>
            <p className="font-cormorant text-xl text-gray-300 italic tracking-wider mt-4">
              {new Date(event.date).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery Details Bar */}
      <div className="container mx-auto px-6 py-6 border-b border-[#1a1a1a] flex justify-between items-center bg-[#0a0a0a] sticky top-0 z-40 shadow-xl">
        <div className="text-sm font-inter tracking-widest text-gray-400">
          <span className="text-brand-gold">{event.images?.length || 0}</span> Portraits
        </div>
        <button 
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
          onClick={() => {}} // In a real app, copy link native sharing
        >
          <FaShare /> Share Gallery
        </button>
      </div>

      {/* Gallery Section */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        {(!event.images || event.images.length === 0) ? (
          <div className="text-center py-32">
            <h3 className="font-playfair text-2xl text-gray-400">This gallery is currently being curated.</h3>
            <p className="font-inter text-sm text-gray-600 mt-4">Check back soon for the full collection.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {event.images.map((img: any, index: number) => (
              <ScrollReveal 
                key={img.publicId} 
                direction="up" 
                delay={0.1} 
                className="relative break-inside-avoid overflow-hidden group bg-[#111]"
              >
                <div className="relative w-full aspect-auto h-auto">
                  <Image
                    src={img.url}
                    alt={`Gallery Image ${index + 1}`}
                    width={800} // providing intrinsic width for Masonry to layout
                    height={1200}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                    <a 
                      href={img.url}
                      download={`new-avathar-${event.slug}-${index}.jpg`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-brand-gold text-black w-12 h-12 rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
                      title="Download Image"
                    >
                      <FaDownload />
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* Client Footer */}
      <footer className="py-16 text-center border-t border-[#1a1a1a] bg-[#0a0a0a]">
        <h2 className="font-playfair text-xl tracking-widest text-white mb-2">
          NEW AVATHAR
        </h2>
        <p className="font-inter text-brand-gold text-xs tracking-[0.3em] uppercase mb-8">Photography</p>
        <p className="font-inter text-xs text-gray-600 tracking-wider">
          © {new Date().getFullYear()} All rights reserved. Do not distribute without permission.
        </p>
      </footer>
    </div>
  );
}
