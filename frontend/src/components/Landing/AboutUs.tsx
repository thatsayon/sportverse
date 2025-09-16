"use client"
import Image from 'next/image';
import { Target, Users, Trophy, Star, Heart, Zap } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { number: "10,000+", label: "Athletes Trained", icon: Users },
    { number: "500+", label: "Expert Trainers", icon: Star },
    { number: "15+", label: "Sports Available", icon: Trophy },
    { number: "50+", label: "Countries Reached", icon: Target }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Sports",
      description: "We believe sports have the power to transform lives, build character, and create lasting friendships."
    },
    {
      icon: Target,
      title: "Excellence in Training",
      description: "Our platform connects athletes with world-class trainers who are committed to helping you achieve your goals."
    },
    {
      icon: Users,
      title: "Community First",
      description: "We foster a supportive community where athletes and trainers can learn, grow, and succeed together."
    },
    {
      icon: Zap,
      title: "Innovation in Sports Tech",
      description: "We leverage cutting-edge technology to make sports training more accessible, effective, and engaging."
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Former Olympic athlete with 15+ years in sports management"
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder", 
      image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Tech entrepreneur passionate about sports technology innovation"
    },
    {
      name: "Dr. Lisa Rodriguez",
      role: "Head of Training Programs",
      image: "https://images.unsplash.com/photo-1594736797933-d0301ba6fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Sports science PhD with expertise in athletic performance"
    },
    {
      name: "James Thompson",
      role: "Head of Community",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Former professional basketball coach and community builder"
    }
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative py-16 lg:py-24"
      style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.7)), url('/Landing/about.jpg')`,
        }}
      >
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-[#F15A24]">Sportverse</span>
            </h1>
            <p className="text-xl text-[#808080] max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing sports training by connecting passionate athletes with world-class trainers through innovative technology and a supportive community.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-100">
              <div className="bg-[#F15A24] p-4 rounded-full w-fit mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Our Mission
              </h2>
              <p className="text-lg text-[#808080] leading-relaxed text-center">
                To democratize access to high-quality sports training by creating a platform where athletes of all levels can connect with expert trainers, learn from the best, and achieve their athletic dreams. We believe that every athlete deserves the opportunity to reach their full potential, regardless of their location or background.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="bg-gradient-to-r from-[#F15A24] to-orange-600 p-4 rounded-full w-fit mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-[#808080] text-sm lg:text-base font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Our Story */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <p className="text-[#808080] leading-relaxed mb-4">
                  Sportverse was born from a simple observation: talented athletes around the world lacked access to quality training and expert guidance. Our founders, both former athletes themselves, experienced firsthand the challenges of finding the right coach and training program.
                </p>
                <p className="text-[#808080] leading-relaxed mb-4">
                  In 2020, we set out to bridge this gap by creating a platform that would connect athletes with expert trainers, regardless of geographical boundaries. What started as a small idea has grown into a global community of athletes and trainers who share a passion for excellence.
                </p>
                <p className="text-[#808080] leading-relaxed">
                  Today, Sportverse serves thousands of athletes across multiple sports, providing both virtual and in-person training opportunities that help athletes reach their full potential.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="relative h-80 lg:h-96">
                  <Image 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Athletes training together in modern facility"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="max-w-6xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                const gradientColors = [
                  'from-red-500 to-pink-600',
                  'from-blue-500 to-cyan-600', 
                  'from-green-500 to-emerald-600',
                  'from-purple-500 to-violet-600'
                ];
                return (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className={`bg-gradient-to-r ${gradientColors[index]} p-4 rounded-full w-fit mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-[#808080] leading-relaxed">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Section */}
          <div className="max-w-6xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Meet Our Team
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-[#F15A24] ring-offset-2">
                    <Image 
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-[#F15A24] font-semibold mb-3">{member.role}</p>
                  <p className="text-[#808080] text-sm leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Vision Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-[#F15A24] to-orange-600 rounded-2xl shadow-2xl p-8 lg:p-12 text-center">
              <div className="bg-white/10 p-4 rounded-full w-fit mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Our Vision for the Future
              </h2>
              <p className="text-lg text-white/90 leading-relaxed mb-8">
                We envision a world where every athlete has access to world-class training and mentorship. Through continuous innovation and community building, we're working to make this vision a reality.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                  <div className="text-white font-bold text-lg mb-2">2024-2025</div>
                  <div className="text-white font-semibold mb-2">Expand Sports</div>
                  <div className="text-white/80 text-sm">Add tennis, soccer, and swimming programs</div>
                </div>
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                  <div className="text-white font-bold text-lg mb-2">2025-2026</div>
                  <div className="text-white font-semibold mb-2">Global Reach</div>
                  <div className="text-white/80 text-sm">Launch in 100+ countries worldwide</div>
                </div>
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                  <div className="text-white font-bold text-lg mb-2">2026+</div>
                  <div className="text-white font-semibold mb-2">AI Integration</div>
                  <div className="text-white/80 text-sm">Personalized training with AI technology</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;