import { AboutUs } from "@/components/home/about-us";
import { BrowseByCategory } from "@/components/home/browse-by-category";
import { FeaturedStudiosSection } from "@/components/home/featured-studios-section";
import { HeroSlider } from "@/components/home/hero-slider";
import { HowItWorks } from "@/components/home/how-it-works";

export default function Home() {
  return (
    <>
      <HeroSlider />

      <FeaturedStudiosSection />

      <BrowseByCategory />

      <HowItWorks />
      <AboutUs />
    </>
  );
}
