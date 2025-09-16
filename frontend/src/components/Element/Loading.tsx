"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Zap } from "lucide-react";

interface LoadingProps {
  message?: string;
  variant?: "default" | "minimal" | "pulse" | "orbit" | "wave";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
  variant = "default",
  size = "md",
  className = "",
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: "w-16 h-16",
      dot: "w-2 h-2",
      icon: "w-6 h-6",
      text: "text-sm",
      spacing: "gap-3",
    },
    md: {
      container: "w-24 h-24",
      dot: "w-3 h-3",
      icon: "w-8 h-8",
      text: "text-base",
      spacing: "gap-4",
    },
    lg: {
      container: "w-32 h-32",
      dot: "w-4 h-4",
      icon: "w-10 h-10",
      text: "text-lg",
      spacing: "gap-6",
    },
  };

  const config = sizeConfig[size];

  // Default Spinner Animation
  const DefaultSpinner = () => (
    <motion.div
      className={`relative ${config.container}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Outer Ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-[#F15A24]/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Inner Spinning Ring */}
      <motion.div
        className="absolute inset-2 rounded-full border-4 border-transparent border-t-[#F15A24] border-r-[#F15A24]"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Center Pulse */}
      <motion.div
        className="absolute inset-6 rounded-full bg-[#F15A24]"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7] 
        }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Sparkle Effects */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#F15A24] rounded-full"
          style={{
            left: "50%",
            top: "50%",
            transformOrigin: `0 ${config.container === "w-16 h-16" ? "32px" : config.container === "w-24 h-24" ? "48px" : "64px"}`,
          }}
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "linear"
          }}
        />
      ))}
    </motion.div>
  );

  // Minimal Dots Animation
  const MinimalDots = () => (
    <div className="flex items-center gap-2">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={`${config.dot} bg-[#F15A24] rounded-full`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  // Pulse Animation
  const PulseLoader = () => (
    <motion.div className="relative">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute ${config.container} rounded-full border-4 border-[#F15A24]`}
          style={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
          animate={{
            scale: [0, 1.5],
            opacity: [1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeOut"
          }}
        />
      ))}
      <motion.div
        className={`relative ${config.container} bg-[#F15A24] rounded-full flex items-center justify-center`}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sparkles className={`${config.icon} text-white`} />
      </motion.div>
    </motion.div>
  );

  // Orbit Animation
  const OrbitLoader = () => (
    <motion.div 
      className={`relative ${config.container}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Center */}
      <motion.div
        className="absolute inset-6 bg-[#F15A24] rounded-full flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <Zap className="w-4 h-4 text-white" />
      </motion.div>
      
      {/* Orbiting Elements */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "linear"
          }}
        >
          <div 
            className={`absolute ${config.dot} bg-[#808080] rounded-full`}
            style={{
              left: "50%",
              top: "10%",
              transform: "translateX(-50%)"
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );

  // Wave Animation
  const WaveLoader = () => (
    <div className="flex items-end gap-1">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-2 bg-[#F15A24] rounded-full"
          animate={{
            height: ["8px", "32px", "8px"],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  // Render the selected variant
  const renderLoader = () => {
    switch (variant) {
      case "minimal":
        return <MinimalDots />;
      case "pulse":
        return <PulseLoader />;
      case "orbit":
        return <OrbitLoader />;
      case "wave":
        return <WaveLoader />;
      default:
        return <DefaultSpinner />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${config.spacing} ${className}`}>
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F15A24]/5 via-transparent to-[#808080]/5 blur-3xl pointer-events-none" />
      
      {/* Loader Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={variant}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          {renderLoader()}
        </motion.div>
      </AnimatePresence>

      {/* Loading Text */}
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${config.text} font-medium text-[#808080] relative z-10`}
        >
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {message}
          </motion.span>
        </motion.p>
      )}

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#F15A24]/30 rounded-full pointer-events-none"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default Loading;