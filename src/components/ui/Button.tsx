import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "text";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center transition-all duration-500 font-inter tracking-[0.15em] text-xs uppercase font-medium";
  
  const variants = {
    primary: "bg-brand-gold text-brand-black px-8 py-4 hover:bg-brand-goldLight hover:shadow-[0_0_20px_rgba(200,165,90,0.3)]",
    outline: "border border-brand-gold text-brand-gold px-8 py-4 hover:bg-brand-gold hover:text-brand-black",
    text: "text-brand-gold hover:text-brand-goldLight pb-1 border-b border-brand-gold/30 hover:border-brand-gold",
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedStyles}>
      {children}
    </button>
  );
}
