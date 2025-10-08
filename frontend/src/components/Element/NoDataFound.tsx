"use client";

import React from "react";
import { motion } from "framer-motion";
import { SearchX, Inbox } from "lucide-react";

interface NoDataFoundProps {
  title?: string;
  subtitle?: string;
  className?: string;
  showAddButton?: boolean;
  onAddNew?: () => void;
  addButtonText?: string;
}

const NoDataFound: React.FC<NoDataFoundProps> = ({
  title = "No Data Found",
  subtitle = "There's nothing here yet. Start by adding your first item or adjust your filters.",
  className = "",
  showAddButton = true,
}) => {
  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${className}`}
    >
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23808080' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='37' cy='7' r='1'/%3E%3Ccircle cx='7' cy='37' r='1'/%3E%3Ccircle cx='37' cy='37' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          relative w-full max-w-lg
          backdrop-blur-xl
          border border-white/20
          rounded-3xl shadow-2xl shadow-black/10
          p-8 text-center
          overflow-hidden
        "
      >
        {/* Glassmorphism Background Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#F15A24]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#808080]/10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2"></div>

        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 mb-6"
        >
          <div
            className="
            w-20 h-20 mx-auto
            backdrop-blur-sm bg-orange-200
            border border-orange-600/20
            rounded-full flex items-center justify-center
            shadow-lg shadow-[#808080]/20
          "
          >
            <motion.div
              animate={{
                y: [0, -8, 0],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Inbox className="w-8 h-8 text-orange-600" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 relative z-10"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-[#808080] text-base md:text-lg leading-relaxed mb-8 relative z-10"
        >
          {subtitle}
        </motion.p>

        {/* Empty State Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="
            flex items-center justify-center gap-3 mb-8
            backdrop-blur-sm bg-[#808080]/5
            border border-[#808080]/20
            rounded-2xl px-6 py-4 mx-auto w-fit
            relative z-10
          "
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <SearchX className="w-6 h-6 text-[#808080]" />
          </motion.div>
          <span className="text-sm font-medium text-[#808080]">
            Nothing to display
          </span>
        </motion.div>

        {/* Action Button */}
        {showAddButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="relative z-10"
          >
          </motion.div>
        )}

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#808080]/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default NoDataFound;
