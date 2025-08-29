"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Sport {
  id: string;
  name: string;
  image: string;
}

const SportSelection: React.FC = () => {
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [showError, setShowError] = useState(false);

  const sports: Sport[] = [
    {
      id: "football",
      name: "Football",
      image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=400&h=300&fit=crop"
    },
    {
      id: "basketball",
      name: "Basketball", 
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop"
    }
  ];

  const handleSportSelect = (sportId: string) => {
    setSelectedSports(prev => {
      if (prev.includes(sportId)) {
        // Remove sport if already selected
        return prev.filter(id => id !== sportId);
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
      return;
    }
    
    // Process the selected sports
    console.log("Selected sports:", selectedSports);
    alert(`Selected sports: ${selectedSports.join(", ")}`);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
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
              Selected: <span className="font-semibold text-blue-600">
                {selectedSports.map(id => sports.find(s => s.id === id)?.name).join(", ")}
              </span>
            </p>
          </motion.div>
        ):(
            <div
            className="text-center mb-6 h-6"
          >
            <p className="text-sm sm:text-base text-gray-600">
            </p>
          </div>
        )
        }

        {/* Sports Selection */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-3xl mx-auto mb-8"
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
                  isSelected ? 'transform scale-105' : 'hover:scale-102'
                }`}
                onClick={() => handleSportSelect(sport.id)}
                whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`bg-white rounded-2xl shadow-lg overflow-hidden border-4 transition-all duration-300 ${
                  isSelected 
                    ? 'border-blue-500 shadow-xl shadow-blue-500/20' 
                    : 'border-transparent hover:border-gray-200'
                }`}>
                  {/* Image Container */}
                  <div className="relative h-40 sm:h-48 lg:h-56 overflow-hidden">
                    <Image
                      src={sport.image}
                      alt={sport.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    />
                    
                    {/* Selected Overlay */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-blue-500/20 flex items-center justify-center"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-full flex items-center justify-center"
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
                    <h3 className={`text-lg sm:text-xl font-semibold text-center transition-colors duration-300 ${
                      isSelected ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {sport.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

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
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={selectedSports.length === 0}
          >
            Continue
          </Button>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-xs sm:text-sm text-gray-500">
            You can select one or both sports for training
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SportSelection;