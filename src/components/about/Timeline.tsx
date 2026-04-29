"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

const milestones = [
  {
    year: "2015",
    title: "The Genesis",
    description: "New Avathar Photography was founded with a single camera and a grand vision to redefine wedding photography in India.",
  },
  {
    year: "2018",
    title: "The Editorial Shift",
    description: "Pivoted towards a heavily fine-art and fashion-inspired approach, setting a new standard for luxury weddings.",
  },
  {
    year: "2021",
    title: "Global Recognition",
    description: "Featured in international publications and began taking exclusive destination wedding commissions worldwide.",
  },
  {
    year: "2024",
    title: "Cinematic Expansion",
    description: "Launched our dedicated cinematography division, employing cinema-grade equipment and narrative storytelling techniques.",
  },
];

export default function Timeline() {
  return (
    <section className="py-24 md:py-32 bg-brand-surface border-t border-brand-border">
      <div className="container mx-auto px-6 max-w-4xl">
        <ScrollReveal direction="up" className="text-center mb-24">
          <p className="font-inter tracking-[0.2em] text-brand-gold text-xs uppercase mb-4">The Journey</p>
          <h2 className="font-playfair text-4xl md:text-5xl text-brand-text">Milestones</h2>
        </ScrollReveal>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-brand-border md:-translate-x-1/2" />

          {milestones.map((item, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div key={item.year} className="relative flex items-center justify-between mb-16 md:mb-24 w-full">
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-brand-gold border-4 border-brand-charcoal box-content transform -translate-x-[5px] md:-translate-x-1/2 z-10" />

                {/* Content Left (Desktop) */}
                <div className={`hidden md:block w-[45%] ${isLeft ? "pr-12 text-right" : "invisible"}`}>
                  <ScrollReveal direction="right" delay={0.1}>
                    <h3 className="font-cormorant text-5xl text-brand-text mb-2">{item.year}</h3>
                    <h4 className="font-playfair text-xl text-brand-gold mb-4 tracking-wider">{item.title}</h4>
                    <p className="text-brand-mutedLight font-inter font-light text-sm leading-relaxed">{item.description}</p>
                  </ScrollReveal>
                </div>

                {/* Content Right (Desktop) & Mobile Content */}
                <div className={`w-full pl-12 md:pl-0 md:w-[45%] ${!isLeft ? mdRightClass : mdHideLeftClass}`}>
                  <ScrollReveal direction="left" delay={0.1}>
                    <h3 className="font-cormorant text-4xl md:text-5xl text-brand-text mb-2">{item.year}</h3>
                    <h4 className="font-playfair text-xl text-brand-gold mb-3 tracking-wider">{item.title}</h4>
                    <p className="text-brand-mutedLight font-inter font-light text-sm leading-relaxed">{item.description}</p>
                  </ScrollReveal>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const mdRightClass = "md:pl-12 text-left";
const mdHideLeftClass = "md:hidden";
