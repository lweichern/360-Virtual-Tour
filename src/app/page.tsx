import HeroSection from "@/components/sections/home/HeroSection";
import StatsBar from "@/components/sections/home/StatsBar";
import FeaturedTours from "@/components/sections/home/FeaturedTours";
import WhyChooseUs from "@/components/sections/home/WhyChooseUs";
import Testimonials from "@/components/sections/home/Testimonials";
import CTABanner from "@/components/sections/home/CTABanner";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <FeaturedTours />
      <WhyChooseUs />
      <Testimonials />
      <CTABanner />
    </>
  );
}
