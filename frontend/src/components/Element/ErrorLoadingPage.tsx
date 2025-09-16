"use client";

import React from "react";
import { motion } from "framer-motion";
import { RefreshCw, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorLoadingPageProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const ErrorLoadingPage: React.FC<ErrorLoadingPageProps> = ({
  title = "Failed to Load Data",
  subtitle = "We're having trouble loading your content. Please check your connection and try again.",
  className = "",
}) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${className}`}>
       <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23808080' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='37' cy='7' r='1'/%3E%3Ccircle cx='7' cy='37' r='1'/%3E%3Ccircle cx='37' cy='37' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      {/* Main Error Container */}
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
          <div className="
            w-20 h-20 mx-auto
            backdrop-blur-sm bg-[#F15A24]/10
            border border-[#F15A24]/20
            rounded-full flex items-center justify-center
            shadow-lg shadow-[#F15A24]/20
          ">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1, 1.1, 1] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <AlertTriangle className="w-8 h-8 text-[#F15A24]" />
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

        {/* Connection Status Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="
            flex items-center justify-center gap-2 mb-8
            backdrop-blur-sm bg-[#808080]/5
            border border-[#808080]/20
            rounded-full px-4 py-2 mx-auto w-fit
            relative z-10
          "
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {navigator?.onLine !== false ? (
              <Wifi className="w-4 h-4 text-[#808080]" />
            ) : (
              <WifiOff className="w-4 h-4 text-[#F15A24]" />
            )}
          </motion.div>
          <span className="text-sm text-[#808080]">
            {navigator?.onLine !== false ? "Connected" : "No Connection"}
          </span>
        </motion.div>

        {/* Refresh Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="relative z-10"
        >
          <Button
            onClick={handleRefresh}
            className="
              group relative
              bg-[#F15A24] hover:bg-[#F15A24]/90
              text-white font-semibold
              px-8 py-3 rounded-full
              shadow-xl shadow-[#F15A24]/30
              border border-[#F15A24]/30
              backdrop-blur-sm
              transition-all duration-300
              hover:scale-105 hover:shadow-2xl hover:shadow-[#F15A24]/40
              active:scale-95
            "
          >
            <motion.div
              animate={{ rotate: 0 }}
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </motion.div>
            
            {/* Button Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-[#F15A24]/20 blur-xl group-hover:bg-[#F15A24]/30 transition-all duration-300"></div>
          </Button>
        </motion.div>

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#F15A24]/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default ErrorLoadingPage;