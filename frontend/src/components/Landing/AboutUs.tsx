/* eslint-disable react/no-unescaped-entities */
"use client"
import React from 'react';
import Image from 'next/image';
import { Target, Users, Trophy, Star, Heart, Zap, Award, TrendingUp, Globe, Shield } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { number: "10,000+", label: "Athletes Trained", icon: Users },
    { number: "100+", label: "Expert Coaches", icon: Star },
    { number: "50+", label: "Training Programs", icon: Trophy },
    { number: "25+", label: "Countries Reached", icon: Globe }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Soccer",
      description: "We believe soccer training has the power to transform lives, build character, and develop lifelong skills both on and off the field."
    },
    {
      icon: Target,
      title: "Excellence in Ball Mastery",
      description: "Our platform provides world-class ball control and technical training programs designed to help players master the fundamentals and advanced techniques."
    },
    {
      icon: Users,
      title: "Community First",
      description: "We foster a supportive community where players, coaches, and families can connect, learn, and grow together in their soccer journey."
    },
    {
      icon: Zap,
      title: "Innovation in Training",
      description: "We leverage modern training methodologies and digital resources to make ball mastery training more accessible, effective, and engaging for all skill levels."
    }
  ];

  const features = [
    {
      icon: Award,
      title: "Comprehensive Training Programs",
      description: "From beginner footwork to advanced ball control techniques, our programs cater to all skill levels and ages."
    },
    {
      icon: TrendingUp,
      title: "Progressive Skill Development",
      description: "Structured progression paths that help players develop their technical abilities systematically and confidently."
    },
    {
      icon: Shield,
      title: "Quality Content",
      description: "All training materials, videos, and resources are professionally developed and protected by intellectual property laws."
    }
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="relative py-12 sm:py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              About <span className="text-[#F15A24]">Ball Mastery</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-[#808080] max-w-3xl mx-auto leading-relaxed px-4">
              Empowering soccer players to master ball control and technical skills through innovative training programs and expert guidance from Bright Star Soccer LLC.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12 border border-gray-100">
              <div className="bg-[#F15A24] p-3 sm:p-4 rounded-full w-fit mx-auto mb-4 sm:mb-6">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                Our Mission
              </h2>
              <p className="text-base sm:text-lg text-[#808080] leading-relaxed text-center">
                To provide accessible, high-quality ball mastery training resources that help soccer players of all levels develop exceptional technical skills. We're committed to making professional-level soccer training available to everyone through our comprehensive online platform at www.ballmastery.com.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 max-w-6xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="bg-gradient-to-r from-[#F15A24] to-orange-600 p-3 sm:p-4 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.number}</div>
                  <div className="text-[#808080] text-xs sm:text-sm lg:text-base font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Our Story */}
          <div className="max-w-6xl mx-auto mb-12 sm:mb-16">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Our Story
                </h2>
                <p className="text-sm sm:text-base text-[#808080] leading-relaxed mb-3 sm:mb-4">
                  Ball Mastery LLC, owned by Bright Star Soccer LLC, was founded with a clear vision: to democratize access to elite soccer training techniques. We recognized that many aspiring players lacked access to professional ball control training and technical development resources.
                </p>
                <p className="text-sm sm:text-base text-[#808080] leading-relaxed mb-3 sm:mb-4">
                  Through www.ballmastery.com, we've created a comprehensive digital platform that brings professional training methodologies directly to players, coaches, and soccer enthusiasts worldwide. Our content is carefully curated and protected to ensure the highest quality educational experience.
                </p>
                <p className="text-sm sm:text-base text-[#808080] leading-relaxed">
                  Today, Ball Mastery serves thousands of players across the globe, providing training programs, video tutorials, and technical resources that help athletes develop exceptional ball control skills and reach their full potential on the field.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="relative h-64 sm:h-80 lg:h-96">
                  <Image 
                    src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Soccer player practicing ball control and dribbling techniques"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="max-w-6xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
              Our Core Values
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                const gradientColors = [
                  'from-red-500 to-pink-600',
                  'from-[#F15A24] to-orange-600', 
                  'from-green-500 to-emerald-600',
                  'from-purple-500 to-violet-600'
                ];
                return (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className={`bg-gradient-to-r ${gradientColors[index]} p-3 sm:p-4 rounded-full w-fit mb-3 sm:mb-4`}>
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{value.title}</h3>
                    <p className="text-sm sm:text-base text-[#808080] leading-relaxed">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* What We Offer */}
          <div className="max-w-6xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
              What We Offer
            </h2>
            <div className="grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
                    <div className="bg-gradient-to-r from-[#F15A24] to-orange-600 p-3 sm:p-4 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-[#808080] leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* About Bright Star Soccer */}
          <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12 text-center">
              <div className="bg-white/10 p-3 sm:p-4 rounded-full w-fit mx-auto mb-4 sm:mb-6">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
                Powered by Bright Star Soccer LLC
              </h2>
              <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-4 sm:mb-6">
                Ball Mastery LLC is proudly owned and operated by Bright Star Soccer LLC, a leader in soccer training and player development. With years of experience in coaching and training methodology, Bright Star Soccer brings professional expertise to every aspect of our platform.
              </p>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Our parent company's commitment to excellence ensures that all Ball Mastery content meets the highest standards of quality and effectiveness, helping players worldwide improve their technical abilities and achieve their soccer goals.
              </p>
            </div>
          </div>

          {/* Commitment Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-[#F15A24] to-orange-600 rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-12 text-center">
              <div className="bg-white/10 p-3 sm:p-4 rounded-full w-fit mx-auto mb-4 sm:mb-6">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
                Our Commitment to You
              </h2>
              <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-6 sm:mb-8">
                We are dedicated to protecting the intellectual property and quality of our training content while making it accessible to soccer players worldwide. Your privacy, data security, and learning experience are our top priorities.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                <div className="bg-white/10 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
                  <div className="text-white font-bold text-base sm:text-lg mb-2">Quality Content</div>
                  <div className="text-white/80 text-xs sm:text-sm">Professional training materials protected by copyright</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
                  <div className="text-white font-bold text-base sm:text-lg mb-2">Privacy First</div>
                  <div className="text-white/80 text-xs sm:text-sm">Your personal information is secure and protected</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
                  <div className="text-white font-bold text-base sm:text-lg mb-2">Support</div>
                  <div className="text-white/80 text-xs sm:text-sm">Dedicated team ready to assist you</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="max-w-2xl mx-auto mt-12 sm:mt-16 text-center">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Questions About Ball Mastery?
              </h3>
              <p className="text-sm sm:text-base text-[#808080] mb-4 sm:mb-6">
                We're here to help! Contact us if you have any questions about our training programs, terms of service, or privacy policy.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <a href="mailto:train@brightstarsoccer.com" className="text-[#F15A24] font-semibold hover:text-orange-600 transition-colors text-sm sm:text-base">
                  train@brightstarsoccer.com
                </a>
                <span className="hidden sm:inline text-[#808080]">|</span>
                <a href="tel:704-641-9830" className="text-[#F15A24] font-semibold hover:text-orange-600 transition-colors text-sm sm:text-base">
                  704-641-9830
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;