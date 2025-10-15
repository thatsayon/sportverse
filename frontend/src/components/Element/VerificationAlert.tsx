"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useJwt } from "@/hooks/useJwt";
import { authEvents } from "@/lib/authEvents";
import { getCookie } from "@/hooks/cookie";

const VerificationAlert = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State to force re-render and store current verification status
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  
  // Initial JWT decode
  const { decoded } = useJwt();

  // Listen for auth changes and update token
  useEffect(() => {
    const unsubscribe = authEvents.subscribe(() => {
      // Force component to re-read the cookie
      const newToken = getCookie("access_token");
      setCurrentToken(newToken);
    });

    return () => unsubscribe();
  }, []);

  // Decode the current token when it changes
  const [decodedState, setDecodedState] = useState(decoded);
  
  useEffect(() => {
    if (currentToken) {
      // Re-decode the JWT when token changes
      // You'll need to decode it here - either expose decode function from useJwt
      // or decode it inline
      try {
        const base64Url = currentToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        setDecodedState(JSON.parse(jsonPayload));
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, [currentToken]);

  // Use decodedState instead of decoded
  const activeDecoded = decodedState || decoded;

  // Get appropriate message based on status
  const getStatusMessage = () => {
    if (!activeDecoded || activeDecoded.verification_status === "verified") return null;

    switch (activeDecoded.verification_status) {
      case "not_submitted":
        return {
          title: "Verification Required",
          message: "Please submit your verification documents to access the dashboard.",
          buttonText: "Submit Documents",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          iconBg: "bg-red-100",
        };
      case "reject":
        return {
          title: "Verification Rejected",
          message: "Your verification was rejected. Please review and resubmit your documents.",
          buttonText: "Resubmit Documents",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          iconBg: "bg-red-100",
        };
      case "in_progress":
        return {
          title: "Verification Pending",
          message: "Your verification is under review. This may take 24-48 hours.",
          buttonText: "View Status",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          iconBg: "bg-yellow-100",
        };
      case "unverfied":
        return {
          title: "Account Unverified",
          message: "Please complete your verification to access all features.",
          buttonText: "Complete Verification",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          iconBg: "bg-orange-100",
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusMessage();

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleRedirect = () => {
    router.push("/trainer/doc-submission");
  };

  // Don't show if user is not a teacher or is verified or no status info
  if (
    !activeDecoded ||
    activeDecoded.role !== "teacher" ||
    !statusInfo
  ) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-24 right-0 z-50 flex items-start"
      ref={containerRef}
      animate={{ x: isOpen ? 0 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Toggle Button - Same height as slider */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className={`w-12 h-28 shadow-lg ${statusInfo.color} ${statusInfo.bgColor} ${statusInfo.borderColor} hover:${statusInfo.bgColor} transition-all ${
          isOpen ? 'rounded-l-lg rounded-r-none border-r-0' : 'rounded-l-lg rounded-r-none'
        } flex items-center justify-center`}
      >
        <AlertCircle className="size-6"/>
      </Button>

      {/* Slide Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden h-28"
          >
            <div
              className={`w-80 shadow-2xl border-2 border-l-0 ${statusInfo.borderColor} ${statusInfo.bgColor} p-4 h-full relative`}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/50 transition-colors"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>

              {/* Content */}
              <div className="space-y-2">
                {/* Icon and Title */}
                <div className="flex items-start gap-3">
                  <div>
                    <h3 className={`font-semibold text-xs ${statusInfo.color}`}>
                      {statusInfo.title}
                    </h3>
                    <p className="text-xs text-gray-700 mt-1">
                      {statusInfo.message}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={handleRedirect}
                  className={`w-full ${statusInfo.color} ${statusInfo.bgColor} hover:opacity-90 border ${statusInfo.borderColor}`}
                  variant="outline"
                  size="sm"
                >
                  {statusInfo.buttonText}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VerificationAlert;