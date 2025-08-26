'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Users, Calendar, MessageCircle, ChevronDown } from 'lucide-react'

const TrainerProfile: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-12 md:py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-h-[496px] px-6 md:px-10 lg:px-[100px]">
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-10"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid lg:grid-cols-2 gap-8 items-start max-h-[436px]">
              <div className="space-y-6">
                <motion.h1 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900"
                  {...fadeInUp}
                >
                  Football Trainer
                </motion.h1>
                
                <motion.h2 
                  className="text-xl md:text-2xl font-semibold text-gray-800"
                  {...fadeInUp}
                  transition={{ delay: 0.1 }}
                >
                  Football Trainer
                </motion.h2>
                
                <motion.p 
                  className="text-gray-600 leading-relaxed text-sm md:text-base"
                  {...fadeInUp}
                  transition={{ delay: 0.2 }}
                >
                  I see myself as more than a trainer – I am a partner in your growth. It&apos;s aided by my warm being and tough encouragement to believe in yourself and guide you with experience and care for you without any limit of potential.
                </motion.p>
                
                <motion.div 
                  className="flex flex-wrap items-center gap-6 md:gap-8"
                  {...fadeInUp}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">4.9</div>
                    <div className="text-xs md:text-sm text-gray-600">average rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">123</div>
                    <div className="text-xs md:text-sm text-gray-600">reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">40</div>
                    <div className="text-xs md:text-sm text-gray-600">students</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  {...fadeInUp}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button 
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get started
                  </motion.button>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-2xl font-bold">$10 - $30</span>
                    <span className="text-sm">/session</span>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                className="relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center justify-end">
                  <Image 
                    src="https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=400&fit=crop&crop=face" 
                    alt="Football Trainer" 
                    className="object-cover w-[400px] h-[302px] rounded-lg"
                    width={400}
                    height={320}
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 space-y-16">
        {/* Consultancy Plans */}
        <motion.section 
          className="space-y-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900"
            variants={fadeInUp}
          >
            Consultancy plans
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div 
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 text-white p-8 h-64"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Virtual Training</h3>
                  <p className="text-white/80">Online and live training with detailed guidance</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative rounded-2xl overflow-hidden text-white p-8 h-64"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=600&fit=crop)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">In-person Training</h3>
                  <p className="text-white/90">Come and train with me in our facilities</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Why Choose Me */}
        <motion.section 
          className="space-y-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900"
            variants={fadeInUp}
          >
            Why Choose me?
          </motion.h2>
          
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div 
              className="relative"
              variants={fadeInUp}
            >
              <div className="aspect-square rounded-2xl overflow-hidden relative">
                <Image 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop" 
                  alt="Training session" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="space-y-6"
              variants={fadeInUp}
            >
              <p className="text-gray-600 leading-relaxed text-lg">
                With years of coaching experience and a passion for athlete development, I focus on understanding each student&apos;s strengths and areas for improvement. My comprehensive training approach goes beyond drills — I emphasize discipline, teamwork, and confidence while offering patience, encouragement, and step-by-step guidance.
              </p>
              
              <motion.button 
                className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn more →
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section 
          className="space-y-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900"
            variants={fadeInUp}
          >
            What my students say
          </motion.h2>
          
          <div className="space-y-6">
            {[1, 2, 3].map((index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 relative">
                      <Image 
                        src={`https://images.unsplash.com/photo-${1500000000000 + index}?w=64&h=64&fit=crop&crop=face`}
                        alt="Student" 
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">Judith Rodriguez</h4>
                        <p className="text-gray-600 text-sm">Student</p>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-2">
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-gray-500 text-sm">August 16, 2025</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-gray-700 leading-relaxed">
                        The way Coach breaks down complex techniques into small, clear steps has made basketball so much easier to grasp.
                      </p>
                      <p className="text-gray-600">
                        I feel more confident on the court, and my performance has improved significantly since I started training with them.
                      </p>
                      
                      <motion.button 
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-sm">Show more</span>
                        <ChevronDown className="w-4 h-4" />
                      </motion.button>
                      
                      <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">Comment</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default TrainerProfile