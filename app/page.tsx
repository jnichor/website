import { Hero } from "@/components/home/Hero";
import { SpecMarquee } from "@/components/home/SpecMarquee";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Pillars } from "@/components/home/Pillars";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BrandStrip } from "@/components/home/BrandStrip";
import { WhyUs } from "@/components/home/WhyUs";
import { Testimonials } from "@/components/home/Testimonials";
import { CTA } from "@/components/home/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <SpecMarquee />
      <CategoryGrid />
      <Pillars />
      <FeaturedProducts />
      <BrandStrip />
      <WhyUs />
      <Testimonials />
      <CTA />
    </>
  );
}
