"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Interactive } from "@/SVG/TrainerSVG";
import { useJwt } from "@/hooks/useJwt";
import { useGetTrainerDetailsQuery } from "@/store/Slices/apiSlices/studentApiSlice";
import Loading from "../Element/Loading";
import ErrorLoadingPage from "../Element/ErrorLoadingPage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TrainingOption {
  exists: boolean;
  id: string | null;
  price: number | null;
}

interface Rating {
  id: string;
  rating: string;
  review: string;
  student_name: string;
  student_username: string;
  created_at: string;
}

interface TeacherProfile {
  id: string;
  training_type: "virtual" | "mindset" | "in_person";
  price: string;
  full_name: string;
  username: string;
  profile_pic_url: string | null;
  institute_name: string | null;
  coach_type: string[];
  virtual: TrainingOption;
  mindset: TrainingOption;
  in_person: TrainingOption;
  ratings: Rating[];
  average_rating: number;
  total_reviews: number;
  student_count: number;
}

interface TrainerProfileProps {
  id: string;
}

const TrainerProfile: React.FC<TrainerProfileProps> = ({ id }) => {
  const router = useRouter();
  const { decoded } = useJwt();
  const [expanded, setExpanded] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<{
    [key: number]: boolean;
  }>({});
  const [showSessionDialog, setShowSessionDialog] = useState(false);

  const { data, isLoading, isError } = useGetTrainerDetailsQuery(id);

  const text =
    "With years of coaching experience and a passion for athlete development, I focus on understanding each student's strengths and challenges to create a training plan that fits their goals. My approach goes beyond drills — I emphasize discipline, teamwork, and confidence while offering patience, encouragement, and step-by-step guidance";
  const displayText = expanded
    ? text
    : text.slice(0, 200) + (text.length > 200 ? "..." : "");

  // Get available sessions
  const availableSessions = useMemo(() => {
    if (!data) return [];
    
    const sessions = [];
    if (data.virtual.exists) {
      sessions.push({
        type: "virtual",
        name: "Virtual",
        price: data.virtual.price,
        id: data.virtual.id,
      });
    }
    if (data.mindset.exists) {
      sessions.push({
        type: "mindset",
        name: "Mindset",
        price: data.mindset.price,
        id: data.mindset.id,
      });
    }
    if (data.in_person.exists) {
      sessions.push({
        type: "in_person",
        name: "In-Person",
        price: data.in_person.price,
        id: data.in_person.id,
      });
    }
    return sessions;
  }, [data]);

  // Get lowest price session for students
  const lowestPriceSession = useMemo(() => {
    if (availableSessions.length === 0) return null;
    return availableSessions.reduce((lowest, session) => {
      return (session.price || 0) < (lowest.price || Infinity) ? session : lowest;
    });
  }, [availableSessions]);

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const handleBookSession = (sessionId: string | null) => {
    if (sessionId) {
      router.push(`/student/session-booking/${sessionId}`);
    }
  };

  const formatSessionName = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorLoadingPage />
      </div>
    );

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
                  {data?.coach_type.join(", ") || "Coach"}
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
                      {data?.average_rating.toFixed(1)}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">
                      average course rating
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">
                      {data?.total_reviews}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">
                      reviews
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">
                      {data?.student_count}
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
                  {decoded?.role === "student" ? (
                    <>
                      <motion.button
                        onClick={() => setShowSessionDialog(true)}
                        className="bg-[#F15A24] hover:bg-[#D27656] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Get started
                      </motion.button>
                      {lowestPriceSession && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="text-sm">Starting from</span>
                          <span className="text-2xl font-bold">
                            ${lowestPriceSession.price}
                          </span>
                          <span className="text-sm">
                            / {formatSessionName(lowestPriceSession.type)}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-4">
                      {availableSessions.map((session) => (
                        <div
                          key={session.type}
                          className="flex items-center gap-2 text-gray-700 bg-gray-100 px-4 py-2 rounded-lg"
                        >
                          <span className="text-xl font-bold">
                            ${session.price}
                          </span>
                          <span className="text-sm">
                            / {formatSessionName(session.type)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
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
                      data?.profile_pic_url ||
                      "https://res.cloudinary.com/dn4ygnsfg/image/upload/v1760208782/6e599501252c23bcf02658617b29c894_cbgerm.jpg"
                    }
                    alt="Trainer"
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
        {availableSessions.length > 0 && (
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

            <div className={`grid justify-start gap-6 ${
              availableSessions.length === 1 
                ? "md:grid-cols-1 max-w-2xl mx-auto" 
                : availableSessions.length === 2 
                ? "md:grid-cols-2" 
                : "md:grid-cols-2 lg:grid-cols-3"
            }`}>
              {data?.virtual.exists && (
                <motion.div
                  className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 text-white p-10 h-[504px]"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(https://res.cloudinary.com/dn4ygnsfg/image/upload/v1760490704/vartualTraning_wbhfvk.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between">
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="text-lg font-bold">${data.virtual.price}</span>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <Interactive size={138} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold mb-2">Virtual Training</h3>
                      <p className="text-white/80">
                        Develop skills at home with guided online drills.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {data?.mindset.exists && (
                <motion.div
                  className="relative rounded-2xl overflow-hidden text-white p-10 h-[504px]"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url(https://res.cloudinary.com/dn4ygnsfg/image/upload/v1760490624/mindset_c0wox2.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between">
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="text-lg font-bold">${data.mindset.price}</span>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <svg
                        width="138"
                        height="138"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
                        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold mb-2">Mindset Training</h3>
                      <p className="text-white/90">
                        Build mental strength and competitive mindset.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {data?.in_person.exists === true && (
                <motion.div
                  className="relative rounded-2xl overflow-hidden text-white p-10 h-[504px]"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url(https://res.cloudinary.com/dn4ygnsfg/image/upload/v1760490684/inPersonTraining_z9gifr.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "50% 20%",
                  }}
                >
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between">
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="text-lg font-bold">${data.in_person.price}</span>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <Users size={138} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold mb-2">
                        In-Person Training
                      </h3>
                      <p className="text-white/90">
                        Come and train with me in our facilities.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}

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
              <div className="aspect-square w-full flex items-center justify-center lg:w-[500px] lg:h-[750px] rounded-2xl overflow-hidden relative">
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
        {data?.ratings && data.ratings.length > 0 && (
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
              {data.ratings.map((review) => (
                <motion.div
                  key={review.id}
                  className="bg-white rounded-2xl p-6 border border-gray-100"
                  variants={fadeInUp}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col md:flex-row gap-10 lg:gap-[123px]">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 mb-3 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-600">
                          {review.student_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900">
                        {review.student_name}
                      </h4>
                      <p className="text-gray-600 text-sm">Student</p>
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
                                  index < parseFloat(review.rating)
                                    ? "fill-current"
                                    : "stroke-current fill-transparent"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-gray-500 text-sm">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <motion.div
                          initial={false}
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-gray-700 leading-relaxed">
                            {expandedReviews[review.id]
                              ? review.review
                              : review.review.length > 200
                              ? review.review.slice(0, 200) + "..."
                              : review.review}
                          </p>
                        </motion.div>

                        {review.review.length > 200 && (
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
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Session Booking Dialog */}
      <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Choose Your Session
            </DialogTitle>
            <DialogDescription>
              Select a training session that fits your needs
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {availableSessions.map((session) => (
              <div
                key={session.type}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-500 transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-lg">
                    {formatSessionName(session.type)}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    ${session.price}
                  </p>
                </div>
                <motion.button
                  onClick={() => handleBookSession(session.id)}
                  className="bg-[#F15A24] hover:bg-[#D27656] text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book Now
                </motion.button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainerProfile;