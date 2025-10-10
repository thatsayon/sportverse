"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Video, SquarePlay, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useJwt } from "@/hooks/useJwt";

const HomePage: React.FC = () => {
  const {decoded} = useJwt()
  const trainingOptions = [
    {
      icon: MapPin,
      title: "In-Person Training",
      description: "Search trainers by city/ZIP & book physically",
      iconColor: "text-white",
      bgColor: "bg-[#EB5A0D]",
      href: "/trainer/in-person",
      hrefStudent: "/student/in-person",
      image: "/teacherImage/home-1.jpg", // Sports team training image
    },
    {
      icon: Video,
      title: "Virtual Training",
      description: "Book online live training sessions",
      iconColor: "text-white",
      bgColor: "bg-[#2867EC]",
      href: "/trainer/virtual-training",
      hrefStudent: "/student/virtual-training",
      image: "/teacherImage/home-2.jpg", // Virtual training session image
    },
    {
      icon: SquarePlay,
      title: "Self-Guided Videos",
      description: "Video library (self-paced programs)",
      iconColor: "text-white",
      bgColor: "bg-[#17A54B]",
      href: "/trainer/video-library",
      hrefStudent: "/student/video-library",
      image: "/teacherImage/home-3.jpg", // Video library on laptop image
      badge: "Pro Only",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white py-2 lg:py-16"
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h1
                variants={itemVariants}
                className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6"
              >
                {
                  decoded?.role === "student" ? "How do you want to train?" : "Ready to share your expertise?"
                }
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              >
                {
                  decoded?.role === "student" ? <>
                  Choose from our comprehensive training options designed to help you  <br className="hidden lg:block"/>achieve your fitness goals
                  </>:<>
                  Turn your knowledge into impact and help players elevate their skills and <br />confidence.
                  </>
                }
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* Training Options Section */}
        <section className="py-2 lg:py-10 pb-6 lg:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {trainingOptions.map((option, index) => {
                const IconComponent = option.icon;
                return (
                  <Link key={index} href={decoded?.role === "teacher" ? option.href: option.hrefStudent}>
                    <motion.div
                    key={option.title}
                    variants={cardVariants}
                    whileHover="hover"
                    className="group"
                  >
                    <Card className="h-full border-0 shadow-lg py-0 pb-6 hover:shadow-xl transition-all duration-300 overflow-hidden">
                      {/* Image Section */}
                      <div className="relative h-[240px] overflow-hidden">
                        <div className="absolute">
                          {/* Placeholder for actual images */}
                          <Image
                            src={option.image}
                            alt="option image"
                            width={420}
                            height={240}
                            className="object-cover"
                          />
                        </div>

                        {option.badge && (
                          <Badge className="absolute top-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                            {option.badge}
                          </Badge>
                        )}

                        
                      </div>

                      {/* Content Section */}
                      <CardHeader className="px-5">
                        <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                          <div className="flex items-center gap-4">
                            <motion.div
                          whileHover={{ scale: 1.05 }}
                          className={`${option.bgColor} p-3 rounded-sm`}
                        >
                          <IconComponent
                            className={`w-6 h-6 ${option.iconColor}`}
                          />
                        </motion.div>
                          {option.title}
                          </div>
                        </CardTitle>
                        <CardDescription className="text-gray-600 h-10 text-base font-montserrat">
                          {option.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <Button
                          variant={"link"}
                          className="text-[#F15A24] flex items-center justify-start"
                          size="lg"
                        >
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                  </Link>
                );
              })}
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
