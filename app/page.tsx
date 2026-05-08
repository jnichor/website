import { Hero } from "@/components/home/Hero";
import { TrustStats } from "@/components/home/TrustStats";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BrandStrip } from "@/components/home/BrandStrip";
import { WhyUs } from "@/components/home/WhyUs";
import { Testimonials } from "@/components/home/Testimonials";
import { CTA } from "@/components/home/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStats />
      <CategoryGrid />
      <FeaturedProducts />
      <BrandStrip />
      <WhyUs />
      <Testimonials />
      <CTA />
    </>
  );
}
