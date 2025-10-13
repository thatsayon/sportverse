"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles, XCircle, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface LoginSuccessProps {
  isSuccess: boolean;
}

const LoginSuccess: React.FC<LoginSuccessProps> = ({ isSuccess }) => {
  const [showContent, setShowContent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Show content after initial animation
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleRetryLogin = () => {
    router.push("/login");
  };

  // Confetti particles (only for success)
  const confettiColors = [
    isSuccess ? "bg-orange-500" : "bg-red-500",
    isSuccess ? "bg-yellow-400" : "bg-red-400",
    isSuccess ? "bg-green-500" : "bg-red-600",
    isSuccess ? "bg-blue-500" : "bg-gray-500",
    isSuccess ? "bg-purple-500" : "bg-red-700",
    isSuccess ? "bg-pink-500" : "bg-gray-600",
  ];

  const confettiParticles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color: confettiColors[i % confettiColors.length],
    delay: Math.random() * 0.3,
    x: (Math.random() - 0.5) * 400,
    y: Math.random() * -300 - 100,
    rotation: Math.random() * 360,
    scale: Math.random() * 0.5 + 0.5,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Circles */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Confetti Animation - Only show for success */}
      {isSuccess &&
        confettiParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute w-3 h-3 ${particle.color} rounded-sm`}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{
              x: particle.x,
              y: particle.y,
              opacity: [1, 1, 0],
              scale: [0, particle.scale, particle.scale],
              rotate: particle.rotation,
            }}
            transition={{
              duration: 1.5,
              delay: particle.delay,
              ease: "easeOut",
            }}
            style={{
              left: "50%",
              top: "50%",
            }}
          />
        ))}

      {/* Main Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          duration: 0.6,
        }}
        className="relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md w-full relative overflow-hidden">
          {/* Sparkle or Alert Effect */}
          <motion.div
            className="absolute top-6 right-6"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {isSuccess ? (
              <Sparkles className="w-6 h-6 text-yellow-400" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-500" />
            )}
          </motion.div>

          {/* Success/Error Icon with Ripple Effect */}
          <div className="flex justify-center mb-6 relative">
            {/* Ripple rings */}
            <motion.div
              className={`absolute w-32 h-32 border-4 ${
                isSuccess ? "border-orange-500" : "border-red-500"
              } rounded-full`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.5], opacity: [0.6, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.div
              className={`absolute w-32 h-32 border-4 ${
                isSuccess ? "border-orange-400" : "border-red-400"
              } rounded-full`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.5], opacity: [0.6, 0] }}
              transition={{
                duration: 1.5,
                delay: 0.3,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />

            {/* Main Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className={`relative z-10 ${
                isSuccess ? "bg-orange-500" : "bg-red-500"
              } rounded-full p-4`}
            >
              {isSuccess ? (
                <CheckCircle
                  className="w-16 h-16 text-white"
                  strokeWidth={2.5}
                />
              ) : (
                <XCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
              )}
            </motion.div>
          </div>

          {/* Text Content */}
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center space-y-4"
            >
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-3xl font-bold text-gray-900"
              >
                {isSuccess ? "Login Successful!" : "Login Failed"}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-gray-600 text-lg"
              >
                {isSuccess
                  ? "Welcome back! You're all set."
                  : "Something went wrong. Please try again."}
              </motion.p>

              {/* Success/Error Message with Bounce */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.7,
                  type: "spring",
                  stiffness: 200,
                }}
                className={`${
                  isSuccess
                    ? "bg-orange-50 border-orange-200 text-orange-700"
                    : "bg-red-50 border-red-200 text-red-700"
                } border-2 rounded-xl p-4 mt-6`}
              >
                <p className="font-medium">
                  {isSuccess
                    ? "🎉 Redirecting you to your dashboard..."
                    : "❌ Unable to authenticate your credentials"}
                </p>
              </motion.div>

              {/* Loading Dots for Success or Retry Button for Failure */}
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex justify-center items-center space-x-2 pt-4"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 bg-orange-500 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="pt-4"
                >
                  <button
                    onClick={handleRetryLogin}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Decorative Elements */}
          <motion.div
            className={`absolute -bottom-2 -left-2 w-24 h-24 bg-gradient-to-br ${
              isSuccess
                ? "from-orange-400 to-orange-500"
                : "from-red-400 to-red-500"
            } rounded-full opacity-20 blur-2xl`}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className={`absolute -top-2 -right-2 w-24 h-24 bg-gradient-to-br ${
              isSuccess
                ? "from-orange-500 to-orange-600"
                : "from-red-500 to-red-600"
            } rounded-full opacity-20 blur-2xl`}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              delay: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LoginSuccess;
