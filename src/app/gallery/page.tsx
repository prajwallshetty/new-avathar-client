import PageTransition from "@/components/layout/PageTransition";
import SectionHeading from "@/components/ui/SectionHeading";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export const metadata = {
  title: "Portfolio | New Avathar Photography",
  description: "View our cinematic photography portfolio across weddings, pre-weddings, portraits, and luxury events.",
};

export default function GalleryPage() {
  return (
    <PageTransition>
      <div className="pt-24 pb-32 bg-brand-bg min-h-screen">
        <div className="container mx-auto px-6 md:px-12">
          <SectionHeading 
            title="Our Portfolio" 
            subtitle="The Visual Symphony" 
            className="mb-12"
          />
          
          <GalleryGrid />
        </div>
      </div>
    </PageTransition>
  );
}
