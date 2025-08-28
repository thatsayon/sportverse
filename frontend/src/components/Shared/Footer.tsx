'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Users, Video, Dumbbell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navigation from '../Shared/Navbar'
import Footer from './Footer'

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
                    className="group cursor-pointer"
                    onClick={() => {
                      // Handle card click navigation here
                      console.log(`Clicked on ${option.title}`)
                    }}
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
                      </div>

                      {/* Content Section */}
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3 mb-3">
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className={`${option.bgColor} p-2 rounded-lg shadow-sm`}
                          >
                            <IconComponent className={`w-5 h-5 ${option.iconColor}`} />
                          </motion.div>
                          <CardTitle className="text-xl font-semibold text-gray-900">
                            {option.title}
                          </CardTitle>
                        </div>
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


      </main>

      <Footer />
    </div>
  )
}

export default HomePage