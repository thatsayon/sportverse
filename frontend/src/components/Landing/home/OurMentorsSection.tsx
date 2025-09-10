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
import { useEffect, useState } from 'react'

const OurMentorsSection = () => {
  const mentors = [
    {
      id: 1,
      name: "Rodger Struck",
      matchGuide: 25,
      image: "/Landing/teacher-1.jpg",
      description: "Guiding athletes with experience, wisdom, and personalized support on their journey to success"
    },
    {
      id: 2,
      name: "Ricky Smith",
      matchGuide: 30,
      image: "/Landing/teacher-2.jpg",
      description: "Providing expert guidance, encouragement, and insight to shape future champions"
    },
    {
      id: 3,
      name: "Judith Rodriguez",
      matchGuide: 35,
      image: "/Landing/teacher-3.jpg",
      description: "I give my time, energy, and care to make sure you feel supported in every moment"
    },
    {
      id: 4,
      name: "Daniel Hamilton",
      matchGuide: 22,
      image: "/Landing/teacher-4.jpg",
      description: "Every session I lead comes with patience, passion, and a genuine care for your progress"
    },
    {
      id: 5,
      name: "Bradley",
      matchGuide: 28,
      image: "/Landing/teacher-5.jpg",
      description: "I believe in you when you doubt yourself and push you forward"
    }
  ]

  return (
    <section className="bg-white py-16 mt-5 px-4 lg:px-8">
      <div className="">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black">
            Our Mentors
          </h2>
        </div>

        <Carousel
          opts={{
            loop: true,
            align: "start",
            skipSnaps: false,
            dragFree: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4 px-6 pb-8">
            {mentors.map((mentor) => (
              <CarouselItem key={mentor.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Card className="h-full border-none transition-shadow hover:shadow-2xl duration-300">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="relative w-[275px] h-[266px] mx-auto rounded-2xl overflow-hidden">
                      <Image
                        src={mentor.image}
                        alt={mentor.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-black">
                        {mentor.name}
                      </h3>
                      <p className="text-[#F15A24] text-xl font-semibold">
                        Match guide: {mentor.matchGuide}
                      </p>
                    </div>
                    
                    <p className="text-[#808080] leading-relaxed">
                      {mentor.description}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
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