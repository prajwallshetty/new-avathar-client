import PageTransition from "@/components/layout/PageTransition";
import HeroSection from "@/components/home/HeroSection";
import FeaturedWork from "@/components/home/FeaturedWork";
import Categories from "@/components/home/Categories";
import AboutPreview from "@/components/home/AboutPreview";
import Testimonials from "@/components/home/Testimonials";
import GalleryStrip from "@/components/home/GalleryStrip";
import ContactCTA from "@/components/home/ContactCTA";

export default function Home() {
  return (
    <PageTransition>
      <HeroSection />
      <FeaturedWork />
      <Categories />
      <AboutPreview />
      <Testimonials />
      <GalleryStrip />
      <ContactCTA />
    </PageTransition>
  );
}
