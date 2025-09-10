import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const WhyChooseUsSection = () => {
  return (
    <section className="py-16">
      <div className="">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-black">
            Why choose us?
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 lg:gap-44 items-center justify-center">
          {/* Left - Images */}
          <div className="relative border-2 right-0">
            <div className="grid grid-cols-2 gap-4">
              {/* Main large image */}
              <div className="col-span-2 relative lg:w-[334px] xl:w-[480px] lg:h-64 xl:h-[450px]  md:h-80 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/Landing/why-1.jpg"
                  alt="Soccer player training"
                  fill
                  className="object-cover absolute z-0"
                />
                <div className="bg-black/50 absolute z-10 w-full h-full" />
              </div>
              <div className="lg:w-[198px] xl:w-[290px] lg:h-[187px] xl:h-[250px] absolute -bottom-20 -right-30 rounded-lg">
                <Image
                  src="/Landing/why-2.jpg"
                  alt="Athletes running"
                  fill
                  className="object-cover absolute z-40 rounded-lg"
                />
                <div className="absolute z-40 w-full h-full bg-black/40 rounded-lg"/>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6 col-span-2">
            <p className="text-[#808080] text-lg md:text-2xl xl:text-3xl leading-relaxed">
              At our Sports Learning Academy, we provide expert coaching from
              certified trainers, personalized programs designed for every age
              and skill level, world-class facilities with modern equipment, a
              strong focus on discipline, teamwork, and sportsmanship, and a
              proven track record of helping athletes grow their skills and
              transform into champions......
            </p>

            <Button
              variant="outline"
              className="border-[#F15A24] text-[#F15A24] hover:bg-[#F15A24] hover:text-white px-6 py-3 rounded-md group"
            >
              Learn more
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
