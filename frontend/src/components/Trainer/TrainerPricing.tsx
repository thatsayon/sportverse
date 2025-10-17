"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, X } from "lucide-react";
import { useJwt } from "@/hooks/useJwt";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGetTrainerProPlanMutation } from "@/store/Slices/apiSlices/trainerApiSlice";

const TrainerPricing: React.FC = () => {
  const { decoded } = useJwt();
  const router = useRouter()
  const [getProPlan] = useGetTrainerProPlanMutation();
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
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

  const proFeatures = [
    { text: "All Basic features included", included: true },
    { text: "Browse Athlete/Trainer profiles", included: true },
    { text: "See trainer rates and locations", included: true },
    { text: "Access video library with self-guided programs", included: true },
    { text: "Join monthly group webinars", included: true },
    { text: "Priority booking support", included: true },
  ];

  const handleSubscription = async () => {
    try {
      const response = await getProPlan({
        amount: "29",
        cancel_url: "http://localhost:3000/payment-failed",
        success_url: "http://localhost:3000/payment-success",
      }).unwrap();
      if (response.checkout_url) {
        console.log(`redirecting to: ${response.checkout_url}`)
         router.push(response.checkout_url)
      } else {
        toast.error("something went wrong");
      }
    } catch (error) {
      const err = error as Error;
      console.log(`${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 sm:px-6 lg:px-8">
      <div className="">
        {/* Header Section */}
        <motion.div
          className="text-start mb-12 px-0 md:px-10 lg:px-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Choose Your {decoded?.role === "student" ? "Traning" : "Trainer"}{" "}
            Plan
          </h1>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Unlock your potential with our flexible subscription plans.
            {decoded?.role === "student" && (
              <span>
                {" "}
                Start with Basic or <br className="hidden md:block" />
                upgrade to Pro for enhanced features and exclusive resources.
              </span>
            )}
          </p>
          <p className="text-xs md:text-sm text-[#F15A24] flex items-center gap-2 bg-[#FFF2F2] w-fit px-4 rounded-full py-2.5 md:font-medium mt-4">
            <Star stroke="#D3A900" fill="#D3A900" />
            {decoded?.role === "student"
              ? "Most athletes choose Pro for complete Traning access"
              : "Trainer must choose pro plan to receive session booking requsts."}
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className={`grid ${
            decoded?.role === "student"
              ? "md:grid-cols-2 max-w-5xl"
              : "md:grid-cols-1 max-w-lg"
          } gap-8  mx-auto`}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Basic Plan */}
          {decoded?.role === "student" && (
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative"
              variants={fadeInUp}
              whileHover={{
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="secondary"
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 text-base font-semibold rounded-lg"
              >
                Get Started Free
              </Button>
            </motion.div>
          )}

          {/* Pro Plan */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl border-2 border-orange-500 p-8 relative"
            variants={fadeInUp}
            whileHover={{
              y: -8,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Most Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm font-semibold">
                Most Popular
              </Badge>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Pro Plan
              </h2>
              <div className="flex items-baseline justify-center mb-4">
                <span className="text-5xl font-bold text-gray-900">$29</span>
                <span className="text-xl text-gray-500 ml-2">/month</span>
              </div>
              <p className="text-gray-600 text-sm">
                Complete access to all training resources
                <br className="hidden sm:block" />
                and exclusive features
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {proFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-sm text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleSubscription}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-base font-semibold rounded-lg shadow-lg"
              >
                Upgrade to Pro
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrainerPricing;
