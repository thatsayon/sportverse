"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Interactive } from "@/SVG/TrainerSVG";
import { useJwt } from "@/hooks/useJwt";
import { useGetTrainerDetailsQuery } from "@/store/Slices/apiSlices/studentApiSlice";

// Sample review data with full text
const reviewsData = [
  {
    id: 1,
    name: "Judith Rodriguez",
    role: "Student",
    date: "August 16, 2025",
    rating: 5,
    shortText:
      "The way Coach breaks down complex techniques into small, clear steps has made basketball so much easier to grasp.",
    fullText:
      "The way Coach breaks down complex techniques into small, clear steps has made basketball so much easier to grasp. I feel more confident on the court, and my performance has improved significantly since I started training with them. What I appreciate most is the personalized attention and how they adapt their teaching style to match my learning pace. The drills are challenging but never overwhelming, and I can see measurable progress in my game. Coach also focuses on mental preparation, which has been just as valuable as the physical training. I would highly recommend this training program to anyone looking to improve their basketball skills.",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Student",
    date: "July 28, 2025",
    rating: 5,
    shortText:
      "Amazing coach with incredible patience and expertise. My fundamentals have improved dramatically.",
    fullText:
      "Amazing coach with incredible patience and expertise. My fundamentals have improved dramatically since starting sessions three months ago. The structured approach to skill development is outstanding, and I've learned proper shooting form, defensive positioning, and court awareness. Coach creates a supportive environment where making mistakes is part of learning. The feedback is always constructive and specific, helping me understand exactly what to work on. I've gone from struggling with basic dribbling to confidently handling the ball under pressure. The training sessions are well-planned and progressive, building on previous lessons seamlessly.",
  },
  {
    id: 3,
    name: "Sarah Chen",
    role: "Student",
    date: "July 15, 2025",
    rating: 4,
    shortText:
      "Great training program with excellent results. Coach really knows how to motivate and push you to excel.",
    fullText:
      "Great training program with excellent results. Coach really knows how to motivate and push you to excel while maintaining a positive atmosphere. The combination of technical skill work and game-situation practice has been perfect for my development. I particularly appreciate how Coach explains the 'why' behind each drill and technique, which helps me understand the game better. The progress tracking and regular feedback sessions keep me motivated and focused on improvement. While the training is intensive, it's never boring thanks to the variety of exercises and the coach's engaging teaching style. I've recommended this program to several friends.",
  },
];

interface TrainerProfileProps {
  id: string;
}

const TrainerProfile: React.FC<TrainerProfileProps> = ({ id }) => {
  const { decoded } = useJwt();
  const [expanded, setExpanded] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<{
    [key: number]: boolean;
  }>({});

  // details of trainer

  const { data, isLoading, isError } = useGetTrainerDetailsQuery(id);

  const text =
    "With years of coaching experience and a passion for athlete development, I focus on understanding each student's strengths and challenges to create a training plan that fits their goals. My approach goes beyond drills — I emphasize discipline, teamwork, and confidence while offering patience, encouragement, and step-by-step guidance";
  const displayText = expanded
    ? text
    : text.slice(0, 200) + (text.length > 200 ? "..." : "");

  const toggleReviewExpansion = (reviewId: number) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        className="bg-[#F17E54] px-4 py-12 md:py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="lg:max-h-[496px] md:px-10 lg:px-[100px]">
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-10"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid lg:grid-cols-2 gap-8 items-start lg:max-h-[436px]">
              <div className="space-y-6">
                <motion.h1
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900"
                  {...fadeInUp}
                >
                  {data?.full_name}
                </motion.h1>

                <motion.h2
                  className="text-xl md:text-2xl font-semibold text-gray-800"
                  {...fadeInUp}
                  transition={{ delay: 0.1 }}
                >
                  {data?.coach_type}
                </motion.h2>

                <motion.p
                  className="text-gray-600 leading-relaxed text-sm md:text-base"
                  {...fadeInUp}
                  transition={{ delay: 0.2 }}
                >
                  I see myself as more than a trainer – I am a partner in your
                  growth. It&apos;s aided by my warm being and tough
                  encouragement to believe in yourself and guide you with
                  experience and care for you without any limit of potential.
                </motion.p>

                <motion.div
                  className="flex flex-wrap items-center gap-6 md:gap-16"
                  {...fadeInUp}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-1">
                      <Star
                        size={30}
                        stroke="none"
                        fill="#EDCC13"
                        className=""
                      />
                      4.9
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">
                      average course rating
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">
                      123
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">
                      reviews
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">
                      40
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">
                      students
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex flex-col pt-5 sm:flex-row gap-4"
                  {...fadeInUp}
                  transition={{ delay: 0.4 }}
                >
                  {decoded?.role === "student" && (
                    <motion.button
                      className="bg-[#F15A24] hover:bg-[#D27656] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 "
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Get started
                    </motion.button>
                  )}
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-2xl font-bold">${data?.price}</span>
                    <span className="text-sm">/{data?.training_type}</span>
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center justify-center lg:justify-end">
                  <Image
                    src={
                      data?.profile_pic_url
                        ? data?.profile_pic_url
                        : "https://res.cloudinary.com/dn4ygnsfg/image/upload/v1760208782/6e599501252c23bcf02658617b29c894_cbgerm.jpg"
                    }
                    alt="Football Trainer"
                    className="object-cover object-top w-[490px] h-[402px] rounded-lg"
                    width={400}
                    height={320}
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <div className="px-6 md:px-8 lg:px-16 py-12 md:py-16 space-y-16">
        {/* Consultancy Plans */}
        <motion.section
          className="space-y-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900"
            variants={fadeInUp}
          >
            Consultancy plans
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
  className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 text-white p-10 h-[504px]"
  variants={fadeInUp}
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.3 }}
  style={{
    backgroundImage:
      "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(/teacherImage/vartualTraning.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* <div className="absolute inset-0 bg-black/20"></div> */}
  <div className="relative z-10 flex flex-col justify-between h-full">
    <div className="w-full h-full flex items-center justify-center">
      <Interactive size={138} />
    </div>
    <div>
      <h3 className="text-3xl font-bold mb-2">Virtual Training</h3>
      <p className="text-white/80">
        Develop skills at home with guided{" "}
        <br className="hidden md:block" />
        online drills.
      </p>
    </div>
  </div>
</motion.div>

            <motion.div
              className="relative rounded-2xl overflow-hidden text-white p-10 h-[504px]"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url(/teacherImage/inPersonTraining.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "50% 20%",
              }}
            >
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="w-full h-full flex items-center justify-center">
                  <Users size={138} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-2">
                    In-person Training
                  </h3>
                  <p className="text-white/90">
                    Come and train with me in our facilities
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Why Choose Me */}
        <motion.section
          className="space-y-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-semibold text-gray-900"
            variants={fadeInUp}
          >
            Why Choose me?
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <motion.div
              className="flex items-center justify-start lg:px-10"
              variants={fadeInUp}
            >
              <div className="aspect-square w-full flex items-center justify-center  lg:w-[500px] lg:h-[750px] rounded-2xl overflow-hidden relative">
                <Image
                  src="https://res.cloudinary.com/dn4ygnsfg/image/upload/v1760403220/whyImage_bpzn65.jpg"
                  alt="Training session"
                  width={491}
                  height={341}
                  className="object-cover rounded-2xl lg:rounded-none"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />
              </div>
            </motion.div>

            <motion.div className="space-y-6 col-span-2" variants={fadeInUp}>
              <p className="text-[#808080] leading-relaxed text-lg lg:text-2xl font-semibold max-w-[950px]">
                {displayText}
              </p>

              {text.length > 200 && (
                <motion.button
                  onClick={() => setExpanded(!expanded)}
                  className="border-2 border-orange-500 text-[#808080] hover:bg-orange-500 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {expanded ? "Show less ↑" : "Learn more →"}
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section
          className="space-y-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-16"
            variants={fadeInUp}
          >
            What my students say
          </motion.h2>

          <div className="space-y-8 lg:px-16">
            {reviewsData.map((review) => (
              <motion.div
                key={review.id}
                className="bg-white rounded-2xl p-6 border border-gray-100"
                variants={fadeInUp}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col md:flex-row gap-10 lg:gap-[123px]">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 mb-3 rounded-full overflow-hidden bg-gray-200 relative">
                      <Image
                        src={`https://res.cloudinary.com/dn4ygnsfg/image/upload/v1760403285/profileImage_phdt7j.png`}
                        alt="Student"
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <h4 className="font-semibold text-gray-900">
                      {review.name}
                    </h4>
                    <p className="text-gray-600 text-sm">{review.role}</p>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div></div>
                      <div className="flex w-full justify-between items-start md:items-end gap-2">
                        <div className="flex text-yellow-400">
                          {Array.from({ length: 5 }, (_, index) => (
                            <Star
                              key={index}
                              className={`w-4 h-4 ${
                                index < review.rating
                                  ? "fill-current"
                                  : "stroke-current fill-transparent"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-500 text-sm">
                          {review.date}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <motion.div
                        initial={false}
                        animate={{
                          height: expandedReviews[review.id] ? "auto" : "auto",
                          opacity: 1,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-gray-700 leading-relaxed">
                          {expandedReviews[review.id]
                            ? review.fullText
                            : review.shortText}
                        </p>
                      </motion.div>

                      <motion.button
                        onClick={() => toggleReviewExpansion(review.id)}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-sm">
                          {expandedReviews[review.id]
                            ? "Show less"
                            : "Show more"}
                        </span>
                        {expandedReviews[review.id] ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default TrainerProfile;
