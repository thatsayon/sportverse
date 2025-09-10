"use client"
import { Interactive } from "@/SVG/TrainerSVG";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import React from "react";

function PlanSection() {

    const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };
  return (
    <motion.section>
        <h1 className="text-lg md:text-2xl lg:text-5xl xl:text-6xl text-center mb-24 font-semibold">Consultancy plans</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 text-white p-10 h-[504px]"
          variants={fadeInUp}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(/trainer/vartualTraning.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="w-full h-full flex items-center justify-center">
              <Interactive size={138} />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">Virtual Training</h3>
              <p className="text-white/80">
                Develop skills at home with guided{" "}
                <br className="hidden md:block" />
                online drills.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="relative rounded-2xl overflow-hidden text-white p-10 h-[504px]"
          variants={fadeInUp}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url(/trainer/inPersonTraining.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "50% 20%",
          }}
        >
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="w-full h-full flex items-center justify-center">
              <Users size={138} />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">In-person Training</h3>
              <p className="text-white/90">
                Come and train with me in our facilities
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default PlanSection;
