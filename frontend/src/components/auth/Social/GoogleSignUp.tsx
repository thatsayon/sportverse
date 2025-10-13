"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap, Loader, Users } from "lucide-react";
import { useGoogleExchangeMutation } from "@/store/Slices/apiSlices/apiSlice";
import { setCookie } from "@/hooks/cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { decodeToken } from "@/hooks/decodeToken";

interface Role {
  id: "student" | "teacher";
  name: string;
  description: string;
  icon: React.ReactNode;
}

const GoogleSignUp: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<
    "student" | "teacher" | null
  >(null);
  const [showError, setShowError] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [googleExchange, { isLoading }] = useGoogleExchangeMutation();
  const router = useRouter();

  // Extract code from URL on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const codeParam = urlParams.get("code");

      if (codeParam) {
        setCode(codeParam);
        console.log("Code extracted from URL:", codeParam);
      } else {
        console.log("No code found in URL");
      }
    }
  }, []);

  const roles: Role[] = [
    {
      id: "student",
      name: "Student",
      description: "I want to learn and improve my skills with expert trainers",
      icon: <GraduationCap className="w-16 h-16" />,
    },
    {
      id: "teacher",
      name: "Teacher",
      description: "I want to teach and share my expertise with students",
      icon: <Users className="w-16 h-16" />,
    },
  ];

  const handleRoleSelect = (roleId: "student" | "teacher") => {
    setSelectedRole(roleId);

    // Clear error when user makes a selection
    if (showError) {
      setShowError(false);
    }
  };

  const handleContinue = async () => {
    if (!selectedRole) {
      setShowError(true);
      return;
    }

    // Create the object with code and role
    const submitData = {
      code: code || "",
      role: selectedRole,
    };

    console.log("submission data", submitData);

    // Log to console as requested
    const response = await googleExchange({
      code: submitData.code,
      role: submitData.role,
    }).unwrap();

    console.log("Submit Data:", submitData);

    if (response.access_token) {
      setCookie("access_token", response.access_token, 7);
      const user = decodeToken(response.access_token);

      if (user?.role === "student") {
        toast.success("Sign Process done!");
        router.push("/student");
      } else if (user?.role === "teacher") {
        toast.success("Sign Process done!");
        router.push("/trainer");
      }
    } else {
      toast.error(response.error?.error_description);
    }

    // You can add your API call here in the future
    // For now, just showing in console
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Role
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Select how you&apos;d like to use our platform
          </p>
        </motion.div>

        {/* Selected Role Display */}
        {selectedRole ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-6"
          >
            <p className="text-sm sm:text-base text-gray-600">
              Selected:{" "}
              <span className="font-semibold text-orange-600">
                {roles.find((r) => r.id === selectedRole)?.name}
              </span>
            </p>
          </motion.div>
        ) : (
          <div className="text-center mb-6 h-6">
            <p className="text-sm sm:text-base text-gray-600"></p>
          </div>
        )}

        {/* Roles Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;

            return (
              <motion.div
                key={role.id}
                variants={fadeInUp}
                className={`relative cursor-pointer transition-all duration-300 ${
                  isSelected ? "transform scale-105" : "hover:scale-102"
                }`}
                onClick={() => handleRoleSelect(role.id)}
                whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden border-4 transition-all duration-300 p-8 ${
                    isSelected
                      ? "border-orange-500 shadow-xl shadow-orange-500/20"
                      : "border-transparent hover:border-gray-200"
                  }`}
                >
                  {/* Icon Container */}
                  <div className="flex justify-center mb-6">
                    <div
                      className={`transition-colors duration-300 ${
                        isSelected ? "text-orange-500" : "text-gray-400"
                      }`}
                    >
                      {role.icon}
                    </div>
                  </div>

                  {/* Role Name */}
                  <h3
                    className={`text-2xl font-bold text-center mb-3 transition-colors duration-300 ${
                      isSelected ? "text-orange-600" : "text-gray-900"
                    }`}
                  >
                    {role.name}
                  </h3>

                  {/* Role Description */}
                  <p className="text-center text-gray-600 text-sm sm:text-base">
                    {role.description}
                  </p>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="absolute top-4 right-4 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"
                    >
                      <svg
                        className="w-5 h-5 text-white"
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
                  )}
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
              Please select a role to continue
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
            className={`px-12 sm:px-16 py-4 sm:py-5 text-base sm:text-lg font-semibold rounded-lg transition-all duration-300 ${
              selectedRole
                ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!selectedRole || isLoading}
          >
            {isLoading ? <Loader /> : "Continue"}
          </Button>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-xs sm:text-sm text-gray-500">
            Select your role to proceed with the registration
          </p>
        </motion.div>

        {/* Debug Info (Remove in production) */}
        {code && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-4 p-4 bg-blue-50 rounded-lg"
          >
            <p className="text-xs text-blue-600">
              Code detected: {code.substring(0, 20)}...
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GoogleSignUp;
