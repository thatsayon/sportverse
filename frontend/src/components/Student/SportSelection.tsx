"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetAdminSportsQuery } from "@/store/Slices/apiSlices/adminApiSlice";
import Loading from "../Element/Loading";
import ErrorLoadingPage from "../Element/ErrorLoadingPage";
import Logo from "../Element/Logo";

interface Sport {
  id: string;
  name: string;
  image: string;
}

const SportSelection: React.FC = () => {
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  const { data, isLoading, isError } = useGetAdminSportsQuery();

  const sports = data?.results || [];

  // Dynamic grid class based on sports count
  const getGridClass = (sportsCount: number) => {
    if (sportsCount === 1) {
      return "grid-cols-1 max-w-md";
    } else if (sportsCount === 2) {
      return "grid-cols-1 sm:grid-cols-2 max-w-2xl";
    } else if (sportsCount === 3) {
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl";
    } else if (sportsCount === 4) {
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 max-w-6xl";
    } else if (sportsCount <= 6) {
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl";
    } else if (sportsCount <= 8) {
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl";
    } else {
      // For more than 8 sports
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 max-w-screen-2xl";
    }
  };

  const handleSportSelect = (sportId: string) => {
    setSelectedSports((prev) => {
      if (prev.includes(sportId)) {
        // Remove sport if already selected
        return prev.filter((id) => id !== sportId);
      } else {
        // Add sport if not selected
        return [...prev, sportId];
      }
    });

    // Clear error when user makes a selection
    if (showError) {
      setShowError(false);
    }
  };

  const handleContinue = () => {
    if (selectedSports.length === 0) {
      setShowError(true);
    }
    router.push("/student");
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2,
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        {/* Header Section */}
        <motion.div
          className="text-center mb-8 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Which sport do you want to train in?
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Choose your sport to get personalized training content
          </p>
        </motion.div>

        {/* Selected Sports Display */}
        {selectedSports.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-6"
          >
            <p className="text-sm sm:text-base text-gray-600">
              Selected:{" "}
              <span className="font-semibold text-orange-600">
                {selectedSports
                  .map((id) => sports.find((s) => s.id === id)?.name)
                  .join(", ")}
              </span>
            </p>
          </motion.div>
        ) : (
          <div className="text-center mb-6 h-6">
            <p className="text-sm sm:text-base text-gray-600"></p>
          </div>
        )}

        {/* Dynamic Sports Grid */}
        <motion.div
          className={`grid gap-4 sm:gap-6 lg:gap-8 mx-auto mb-8 ${getGridClass(
            sports.length
          )}`}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {sports.map((sport) => {
            const isSelected = selectedSports.includes(sport.id);

            return (
              <motion.div
                key={sport.id}
                variants={fadeInUp}
                className={`relative cursor-pointer transition-all duration-300 ${
                  isSelected ? "transform scale-105" : "hover:scale-102"
                }`}
                onClick={() => handleSportSelect(sport.id)}
                whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden border-4 transition-all duration-300 ${
                    isSelected
                      ? "border-orange-500 shadow-xl shadow-orange-500/20"
                      : "border-transparent hover:border-gray-200"
                  }`}
                >
                  {/* Image Container */}
                  <div className="relative h-40 sm:h-48 lg:h-56 overflow-hidden">
                    <Image
                      src={sport.image}
                      alt={sport.name}
                      fill
                      className="object-cover"
                      sizes={`(max-width: 640px) 100vw, 
                              (max-width: 1024px) 50vw, 
                              (max-width: 1280px) 33vw,
                              (max-width: 1536px) 25vw, 
                              20vw`}
                    />

                    {/* Selected Overlay */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-orange-500/20 flex items-center justify-center"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-full flex items-center justify-center"
                        >
                          <svg
                            className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </motion.div>
                      </motion.div>
                    )}
                  </div>

                  {/* Sport Name */}
                  <div className="p-4 sm:p-6">
                    <h3
                      className={`text-lg sm:text-xl font-semibold text-center transition-colors duration-300 ${
                        isSelected ? "text-orange-600" : "text-gray-900"
                      }`}
                    >
                      {sport.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* No Sports Available */}
        {sports.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-lg text-gray-500">
              No sports are currently available for selection.
            </p>
          </motion.div>
        )}

        {/* Error Message */}
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <p className="text-red-600 text-sm sm:text-base font-medium">
              Please select at least one sport to continue
            </p>
          </motion.div>
        )}

        {/* Continue Button */}
        {sports.length > 0 && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={handleContinue}
              className={`px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-all duration-300 ${
                selectedSports.length > 0
                  ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={selectedSports.length === 0}
            >
              Continue
            </Button>
          </motion.div>
        )}

        {/* Instructions */}
        {sports.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-6"
          >
            <p className="text-xs sm:text-sm text-gray-500">
              {sports.length === 1
                ? "Select the sport for training"
                : sports.length === 2
                ? "You can select one or both sports for training"
                : `You can select any combination of the ${sports.length} available sports for training`}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SportSelection;
