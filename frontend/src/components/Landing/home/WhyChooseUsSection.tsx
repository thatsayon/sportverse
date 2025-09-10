import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const WhyChooseUsSection = () => {
  return (
    <section className="bg-gray-50 py-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black">
            Why choose us?
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Main large image */}
              <div className="col-span-2 relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/api/placeholder/600/400"
                  alt="Soccer player training"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Smaller image */}
              <div className="relative h-32 md:h-48 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/api/placeholder/300/200"
                  alt="Athletes running"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Empty space for layout */}
              <div className="hidden md:block"></div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <p className="text-[#808080] text-lg md:text-xl leading-relaxed">
              At our Sports Learning Academy, we provide expert coaching from
              certified trainers, personalized programs designed for every age and
              skill level, world-class facilities with modern equipment, a strong
              focus on discipline, teamwork, and sportsmanship, and a proven
              track record of helping athletes grow their skills and transform into
              champions......
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
  )
}

export default WhyChooseUsSection