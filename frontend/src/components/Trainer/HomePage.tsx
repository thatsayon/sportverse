'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Users, Video, Dumbbell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navigation from './Navbar'
import Footer from '../Shared/Footer'

const HomePage: React.FC = () => {
  const trainingOptions = [
    {
      icon: Users,
      title: 'In-Person Training',
      description: 'Search trainers by city/ZIP & book physically',
      buttonText: 'Get Started',
      buttonVariant: 'default' as const,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50',
      image: '/api/placeholder/300/200' // Sports team training image
    },
    {
      icon: Video,
      title: 'Virtual Training',
      description: 'Book online live training sessions',
      buttonText: 'Get Started',
      buttonVariant: 'secondary' as const,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      image: '/api/placeholder/300/200' // Virtual training session image
    },
    {
      icon: Dumbbell,
      title: 'Self-Guided Videos',
      description: 'Video library (self-paced programs)',
      buttonText: 'Get Started',
      buttonVariant: 'outline' as const,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      image: '/api/placeholder/300/200', // Video library on laptop image
      badge: 'Pro Only'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white py-16 lg:py-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h1 
                variants={itemVariants}
                className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6"
              >
                How do you want to train?
              </motion.h1>
              <motion.p 
                variants={itemVariants}
                className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              >
                Choose from our comprehensive training options designed to help you 
                achieve your fitness goals
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* Training Options Section */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {trainingOptions.map((option, index) => {
                const IconComponent = option.icon
                return (
                  <motion.div
                    key={option.title}
                    variants={cardVariants}
                    whileHover="hover"
                    className="group"
                  >
                    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      {/* Image Section */}
                      <div className="relative h-48 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
                          {/* Placeholder for actual images */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <IconComponent className={`w-20 h-20 ${option.iconColor} opacity-20`} />
                          </div>
                        </div>
                        
                        {option.badge && (
                          <Badge className="absolute top-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                            {option.badge}
                          </Badge>
                        )}
                        
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className={`absolute bottom-4 left-4 ${option.bgColor} p-3 rounded-xl shadow-md`}
                        >
                          <IconComponent className={`w-6 h-6 ${option.iconColor}`} />
                        </motion.div>
                      </div>

                      {/* Content Section */}
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                          {option.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 text-base leading-relaxed">
                          {option.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <Button 
                          variant={option.buttonVariant}
                          className="w-full group-hover:shadow-md transition-all duration-300"
                          size="lg"
                        >
                          {option.buttonText}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-orange-500 to-red-500 py-16 lg:py-20"
        >
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-3xl lg:text-4xl font-bold text-white mb-6"
            >
              Ready to elevate your training?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-xl text-orange-100 mb-8 leading-relaxed"
            >
              Join thousands of athletes who are already improving their performance with SportVerse
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button 
                size="lg" 
                className="bg-white text-orange-500 hover:bg-gray-100 font-semibold px-8 py-3"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-orange-500 font-semibold px-8 py-3"
              >
                View Pricing
              </Button>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  )
}

export default HomePage