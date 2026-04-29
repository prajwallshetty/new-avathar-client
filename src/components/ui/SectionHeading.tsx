"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  center?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  className = "",
  center = true,
}: SectionHeadingProps) {
  return (
    <div className={`mb-16 md:mb-24 ${center ? "text-center" : "text-left"} ${className}`}>
      {subtitle && (
        <ScrollReveal direction="down" distance={20} className="mb-4">
          <p className="font-inter tracking-[0.2em] text-brand-gold text-xs uppercase">
            {subtitle}
          </p>
        </ScrollReveal>
      )}
      <ScrollReveal direction="up" delay={0.1}>
        <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-brand-text tracking-wider">
          {title}
        </h2>
      </ScrollReveal>
      
      {center && (
        <ScrollReveal direction="up" delay={0.2} className="flex justify-center mt-8">
          <div className="w-16 h-[1px] bg-brand-gold/50" />
        </ScrollReveal>
      )}
    </div>
  );
}
