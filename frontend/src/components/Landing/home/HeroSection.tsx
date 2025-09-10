import Image from "next/image";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="bg-white">
      {/* Main heading - keep xl: design, add responsive for smaller screens */}
      <h1 className="text-3xl md:text-4xl lg:text-[96px] font-montserrat font-bold">
        UNLOCK YOUR FULL GAME
      </h1>
      
      {/* Content container - keep original xl: layout, make responsive for smaller screens */}
      <div className="flex flex-col xl:flex-row xl:items-center gap-6 lg:gap-7 sm:-mt-4 md:mt-0 lg:mt-0 xl:-mt-6 min-h-[500px] sm:min-h-[600px] lg:h-[790px]">
        
        {/* Left content */}
        <div>
          {/* Orange heading */}
          <h1 className="text-3xl md:text-4xl lg:text-[96px] font-montserrat font-bold text-[#F15A24]">
            POTAINCIAL
          </h1>
          
          {/* Description - keep original styling for lg+ */}
          <p className="max-w-full lg:w-[710px] text-base lg:text-lg sm:text-xl xl:text-2xl font-semibold text-[#808080] mt-4 lg:mt-0">
            From beginners to aspiring athletes, we provide step-by-step training, skill development, and mentorship to help you succeed in sports
          </p>
          
          {/* CTA Button - keep original styling */}
          <Button className="mt-6 px-14 py-4 text-lg font-bold">Join Academy</Button>
          
          {/* First Image - keep original dimensions for lg+, responsive for smaller */}
          <div className="w-full max-w-full lg:max-w-full lg:max-h-[435px] h-[250px] sm:h-[300px] lg:h-[435px] overflow-hidden relative rounded-2xl mt-8">
            <Image
              src="/Landing/hero-1.jpg"
              alt="handing Image"
              width={617}
              height={435}
              className="object-cover relative w-full bottom-20 md:bottom-50  lg:bottom-30 "
            />
          </div>
        </div>
        
        {/* Right Image - keep original styling for lg+ */}
        <div className="h-[400px] sm:h-[500px] lg:h-[92%] overflow-hidden relative rounded-2xl lg:mt-9">
          <Image
            src="/Landing/hero-2.jpg"
            alt="handing Image"
            width={692}
            height={697}
            className="object-cover w-full h-full lg:w-7xl lg:h-full object-center relative"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;