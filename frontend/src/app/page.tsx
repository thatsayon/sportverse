import CompanyOverviewSection from "@/components/Landing/home/CompanyOverviewSection";
import HeroSection from "@/components/Landing/home/HeroSection";
import OurMentorsSection from "@/components/Landing/home/OurMentorsSection";
import PlanSection from "@/components/Landing/home/PlanSection";
import TestimonialsSection from "@/components/Landing/home/TestimonialsSection";
import WhyChooseUsSection from "@/components/Landing/home/WhyChooseUsSection";

export default function Home() {
  return (
    <div className="py-6 md:py-8 lg:py-10 px-6 md:px-8 lg:px-20 border-2 bg-white">
      <HeroSection/>
      <CompanyOverviewSection/>
      <WhyChooseUsSection/>
      <OurMentorsSection/>
      <PlanSection/>
      <TestimonialsSection/>
    </div>
  );
}
