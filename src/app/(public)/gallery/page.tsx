import { Suspense } from "react";
import PageTransition from "@/components/layout/PageTransition";
import SectionHeading from "@/components/ui/SectionHeading";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export const metadata = {
  title: "Portfolio | New Avatar Photography",
  description: "View our cinematic photography portfolio — Weddings, Pre-Wedding, Reception, Haldi, and Portraits.",
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

          <Suspense fallback={
            <div className="flex justify-center py-24 text-brand-mutedLight text-sm tracking-widest uppercase">
              Loading Portfolio…
            </div>
          }>
            <GalleryGrid />
          </Suspense>
        </div>
      </div>
    </PageTransition>
  );
}

