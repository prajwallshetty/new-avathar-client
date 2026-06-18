import PageTransition from "@/components/layout/PageTransition";
import StorySection from "@/components/about/StorySection";
import Timeline from "@/components/about/Timeline";

export const metadata = {
  title: "Our Story | New Avatar Photography",
  description: "Learn about the artists behind New Avatar Photography. We specialize in luxury, cinematic wedding photography and videography.",
};

export default function AboutPage() {
  return (
    <PageTransition>
      <StorySection />
      <Timeline />
    </PageTransition>
  );
}
