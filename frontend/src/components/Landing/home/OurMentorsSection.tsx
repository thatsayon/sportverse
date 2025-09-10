"use client"

import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const OurMentorsSection = () => {
  const mentors = [
    {
      id: 1,
      name: "Rodger Struck",
      matchGuide: 25,
      image: "/api/placeholder/300/300",
      description: "Guiding athletes with experience, wisdom, and personalized support on their journey to success"
    },
    {
      id: 2,
      name: "Ricky Smith",
      matchGuide: 30,
      image: "/api/placeholder/300/300",
      description: "Providing expert guidance, encouragement, and insight to shape future champions"
    },
    {
      id: 3,
      name: "Judith Rodriguez",
      matchGuide: 35,
      image: "/api/placeholder/300/300",
      description: "I give my time, energy, and care to make sure you feel supported in every moment"
    },
    {
      id: 4,
      name: "Daniel Hamilton",
      matchGuide: 22,
      image: "/api/placeholder/300/300",
      description: "Every session I lead comes with patience, passion, and a genuine care for your progress"
    },
    {
      id: 5,
      name: "Bradley",
      matchGuide: 28,
      image: "/api/placeholder/300/300",
      description: "I believe in you when you doubt yourself and push you forward"
    }
  ]

  return (
    <section className="bg-white py-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black">
            Our Mentors
          </h2>
        </div>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {mentors.map((mentor) => (
              <CarouselItem key={mentor.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden">
                      <Image
                        src={mentor.image}
                        alt={mentor.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-black">
                        {mentor.name}
                      </h3>
                      <p className="text-[#F15A24] font-semibold">
                        Match guide: {mentor.matchGuide}
                      </p>
                    </div>
                    
                    <p className="text-[#808080] text-sm leading-relaxed">
                      {mentor.description}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 lg:-left-16" />
          <CarouselNext className="hidden md:flex -right-12 lg:-right-16" />
        </Carousel>

        {/* Mobile Navigation Dots */}
        <div className="flex justify-center mt-8 md:hidden">
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[#808080]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurMentorsSection