import { AboutUs } from "@/components/home/about-us";
import { BrowseByCategory } from "@/components/home/browse-by-category";
import { FeaturedStudiosSection } from "@/components/home/featured-studios-section";
import { HeroSlider } from "@/components/home/hero-slider";
import { HostGuarantee } from "@/components/home/host-guarantee";
import { HowItWorks } from "@/components/home/how-it-works";

export default function Home() {
  return (
    <>
      <HeroSlider />

      <FeaturedStudiosSection />

      <BrowseByCategory />

      <HowItWorks />
      <HostGuarantee />
      <AboutUs />
    </>
  );
}
