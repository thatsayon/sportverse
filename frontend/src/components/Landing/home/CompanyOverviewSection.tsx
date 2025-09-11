import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const CompanyOverviewSection = () => {
  return (
    <section className="bg-white py-16">
      <div className="w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-8">
            Company overview
          </h2>

          {/* Video Player */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[210px] md:h-[450px] lg:h-[500px]">
            <Image
              src="/Landing/overview.jpg"
              alt="Company overview video thumbnail"
              width={1920}
              height={1080}
              className="object-contain absolute z-0 xl:-bottom-115"
            />

            {/* Play Button Overlay */}
            <div className="relative h-full inset-0 z-10 flex items-center justify-center bg-black/20">
              <Button
                size="lg"
                className="rounded-full w-28 h-28 bg-transparent border-8 border-white hover:bg-gray-400 hover:border-gray-400 text-black shadow-xl cursor-pointer"
              >
                <Play className="size-12 ml-1" size={24} fill="white" stroke="white" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sponsors Section */}
        <div className="bg-black rounded-2xl py-12 px-8">
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Our sponsors
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center">
            {/* Sponsor Logos */}
            <div className="flex justify-center">
              <div className="text-blue-400 font-bold text-lg">SteadyGo</div>
            </div>

            <div className="flex justify-center">
              <div className="text-white font-bold text-lg">Spotify</div>
            </div>

            <div className="flex justify-center">
              <div className="text-white font-bold text-lg">NIKE</div>
            </div>

            <div className="flex justify-center">
              <div className="text-red-500 font-bold text-lg">Red Bull</div>
            </div>

            <div className="flex justify-center">
              <div className="text-green-500 font-bold text-lg">Carlsberg</div>
            </div>
            <div className="hidden lg:block">
              {/* <div className="text-green-500 font-bold text-lg">Carlsberg</div> */}
            </div>

            <div className="flex justify-center">
              <div className="text-white font-bold text-lg">BtcTurk</div>
            </div>

            <div className="flex justify-center">
              <div className="text-blue-600 font-bold text-lg">FILA</div>
            </div>

            <div className="flex justify-center">
              <div className="text-white font-bold text-lg">.monks</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyOverviewSection;
