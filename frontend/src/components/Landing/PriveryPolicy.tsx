/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useState, useEffect } from 'react';
import { Shield, Eye, Lock, Users, Database, CheckCircle, Globe, Menu, X, Mail, Phone, Cookie, FileText, AlertTriangle, Settings } from 'lucide-react';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const sections = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'information', label: 'Information We Collect', icon: Database },
    { id: 'usage', label: 'How We Use Your Information', icon: Eye },
    { id: 'sharing', label: 'Sharing Your Information', icon: Users },
    { id: 'security', label: 'Security of Your Information', icon: Lock },
    { id: 'rights', label: 'Your Rights and Choices', icon: CheckCircle },
    { id: 'third-party', label: 'Third-Party Links', icon: FileText },
    { id: 'children', label: 'Children\'s Privacy', icon: Shield },
    { id: 'changes', label: 'Changes to This Policy', icon: Settings },
    { id: 'contact', label: 'Contact Us', icon: Phone },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white/80">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="lg:hidden fixed top-24 right-4 z-40 bg-[#F15A24] text-white p-3 rounded-full shadow-lg hover:bg-[#d94d1a] transition-colors"
        aria-label="Toggle navigation menu"
      >
        {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
            <div className="bg-[#F15A24] p-3 sm:p-4 rounded-full mb-3 sm:mb-0 sm:mr-4">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center sm:text-left">
              Privacy <span className="text-[#F15A24]">Policy</span>
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-[#808080] px-4">
            Your privacy matters to us. Here's how we protect and use your information.
          </p>
          <p className="text-xs sm:text-sm text-[#808080] mt-3 sm:mt-4">Last updated: September 10, 2025</p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:gap-8">
            {/* Sidebar */}
            <aside className={`
              fixed lg:sticky inset-y-0 left-0 z-40 w-72 sm:w-80 lg:w-64 xl:w-72
              top-20 lg:top-24 lg:h-fit lg:max-h-[calc(100vh-120px)]
              transform transition-transform duration-300 ease-in-out
              ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              lg:translate-x-0
              bg-white shadow-2xl lg:shadow-lg
              overflow-y-auto
              flex-shrink-0
            `}>
              <div className="p-4 sm:p-6 lg:p-6">
                <div className="bg-white lg:bg-transparent rounded-xl lg:border lg:border-gray-100 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Table of Contents</h3>
                  <nav className="space-y-1">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`
                            w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200
                            flex items-center space-x-2 sm:space-x-3
                            ${activeSection === section.id
                              ? 'bg-[#F15A24] text-white shadow-md'
                              : 'text-gray-700 hover:bg-gray-100'
                            }
                          `}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium">{section.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 space-y-6 sm:space-y-8 max-w-4xl lg:max-w-none">
              {/* Overview */}
              <div id="overview" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Overview</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#808080] leading-relaxed">
                  <p>
                    At www.ballmastery.com ("we," "us," or "our"), we value your privacy and are committed to protecting the personal information that you share with us. This Privacy Policy outlines the types of information we collect, how we use it, and the measures we take to protect your privacy.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded">
                    <p className="text-blue-700 font-medium text-sm sm:text-base">
                      By using our website, you agree to the terms outlined in this policy.
                    </p>
                  </div>
                </div>
              </div>

              {/* 1. Information We Collect */}
              <div id="information" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <Database className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">1. Information We Collect</h2>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-sm sm:text-base text-[#808080]">We may collect the following types of information:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">a. Personal Information</h3>
                      <p className="text-xs sm:text-sm text-[#808080] mb-3">When you visit or interact with our website, we may collect personal information such as:</p>
                      <ul className="space-y-1.5 sm:space-y-2 text-[#808080] text-xs sm:text-sm">
                        <li className="flex items-start">
                          <span className="text-[#F15A24] mr-2 mt-1 flex-shrink-0">•</span>
                          <span>Name</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#F15A24] mr-2 mt-1 flex-shrink-0">•</span>
                          <span>Email address</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#F15A24] mr-2 mt-1 flex-shrink-0">•</span>
                          <span>Location (e.g., city, country)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#F15A24] mr-2 mt-1 flex-shrink-0">•</span>
                          <span>Preferences or interests related to sports content</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">b. Non-Personal Information</h3>
                      <p className="text-xs sm:text-sm text-[#808080] mb-3">We may also collect non-personal information, including but not limited to:</p>
                      <ul className="space-y-1.5 sm:space-y-2 text-[#808080] text-xs sm:text-sm">
                        <li className="flex items-start">
                          <span className="text-[#F15A24] mr-2 mt-1 flex-shrink-0">•</span>
                          <span>IP address</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#F15A24] mr-2 mt-1 flex-shrink-0">•</span>
                          <span>Browser type</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#F15A24] mr-2 mt-1 flex-shrink-0">•</span>
                          <span>Device information</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#F15A24] mr-2 mt-1 flex-shrink-0">•</span>
                          <span>Pages visited on our site</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#F15A24] mr-2 mt-1 flex-shrink-0">•</span>
                          <span>Time and date of your visit</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#F15A24] mr-2 mt-1 flex-shrink-0">•</span>
                          <span>Referring website URLs</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
                    <div className="flex items-start mb-3">
                      <Cookie className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                      <h3 className="text-base sm:text-lg font-semibold text-blue-900">c. Cookies and Tracking Technologies</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-blue-800 mb-3">We use cookies and similar tracking technologies to enhance your experience on our website. Cookies help us:</p>
                    <ul className="space-y-1.5 sm:space-y-2 text-blue-800 text-xs sm:text-sm ml-4">
                      <li>• Remember your preferences and settings</li>
                      <li>• Analyze website traffic and usage patterns</li>
                      <li>• Improve content and functionality</li>
                    </ul>
                    <p className="text-xs sm:text-sm text-blue-700 mt-3 font-medium">
                      You can control the use of cookies through your browser settings. However, please note that disabling cookies may affect your ability to use certain features of our website.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. How We Use Your Information */}
              <div id="usage" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#808080] leading-relaxed">
                  <p>We use the information we collect in the following ways:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                      <ul className="space-y-1.5 sm:space-y-2 text-green-700 text-xs sm:text-sm">
                        <li>• To provide and improve sports content and services</li>
                        <li>• To personalize your experience on our website</li>
                        <li>• To communicate with you regarding updates, news, and promotions</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                      <ul className="space-y-1.5 sm:space-y-2 text-green-700 text-xs sm:text-sm">
                        <li>• To respond to inquiries and support requests</li>
                        <li>• To analyze website usage and trends</li>
                        <li>• To ensure compliance with legal requirements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Sharing Your Information */}
              <div id="sharing" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">3. Sharing Your Information</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#808080] leading-relaxed">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                    <p className="text-green-800 font-semibold text-sm sm:text-base">
                      We do not sell, rent, or lease your personal information to third parties.
                    </p>
                  </div>
                  <p>However, we may share your information in the following circumstances:</p>
                  <ul className="space-y-2 sm:space-y-3 ml-2 sm:ml-4">
                    <li className="flex items-start">
                      <span className="text-[#F15A24] mr-2 mt-1 flex-shrink-0">•</span>
                      <div>
                        <span className="font-semibold text-gray-700">With service providers:</span> We may share your information with third-party vendors who assist us with website operation, analytics, or marketing.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#F15A24] mr-2 mt-1 flex-shrink-0">•</span>
                      <div>
                        <span className="font-semibold text-gray-700">For legal purposes:</span> We may disclose your information if required by law or in response to a legal request, such as a subpoena, court order, or government inquiry.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 4. Security of Your Information */}
              <div id="security" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">4. Security of Your Information</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#808080] leading-relaxed">
                  <p>
                    We implement a variety of security measures to protect your personal information. However, please note that no method of data transmission over the internet is 100% secure.
                  </p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 sm:p-4 rounded">
                    <p className="text-yellow-800 font-medium text-sm sm:text-base">
                      While we strive to protect your information, we cannot guarantee its absolute security.
                    </p>
                  </div>
                </div>
              </div>

              {/* 5. Your Rights and Choices */}
              <div id="rights" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">5. Your Rights and Choices</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#808080] leading-relaxed">
                  <p className="font-medium text-gray-700">You have the right to:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-center bg-blue-50 rounded-lg p-3 sm:p-4">
                      <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">Access, update, or delete your personal information</span>
                    </div>
                    <div className="flex items-center bg-blue-50 rounded-lg p-3 sm:p-4">
                      <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">Opt-out of marketing communications</span>
                    </div>
                    <div className="flex items-center bg-blue-50 rounded-lg p-3 sm:p-4">
                      <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">Control cookies and tracking preferences</span>
                    </div>
                    <div className="flex items-center bg-blue-50 rounded-lg p-3 sm:p-4">
                      <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">Request a copy of your data</span>
                    </div>
                  </div>
                  <p className="text-sm">
                    If you wish to exercise any of these rights or have questions about your personal information, please contact us using the information provided below.
                  </p>
                </div>
              </div>

              {/* 6. Third-Party Links */}
              <div id="third-party" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">6. Third-Party Links</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#808080] leading-relaxed">
                  <p>
                    Our website may contain links to third-party websites. These third-party sites have their own privacy policies, and we are not responsible for their content or practices.
                  </p>
                  <div className="bg-orange-50 border-l-4 border-[#F15A24] p-3 sm:p-4 rounded">
                    <p className="text-gray-700 font-medium text-sm sm:text-base">
                      We encourage you to review their privacy policies before providing any personal information.
                    </p>
                  </div>
                </div>
              </div>

              {/* 7. Children's Privacy */}
              <div id="children" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">7. Children's Privacy</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#808080] leading-relaxed">
                  <p>
                    Our website is not intended for children under the age of 13, and we do not knowingly collect personal information from children.
                  </p>
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded">
                    <p className="text-red-700 font-medium text-sm sm:text-base">
                      If you believe we have inadvertently collected personal information from a child under 13, please contact us immediately, and we will take steps to delete that information.
                    </p>
                  </div>
                </div>
              </div>

              {/* 8. Changes to This Privacy Policy */}
              <div id="changes" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">8. Changes to This Privacy Policy</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#808080] leading-relaxed">
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. When we make changes, we will post the updated policy on this page and update the "Effective Date" at the top.
                  </p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 sm:p-4 rounded">
                    <p className="text-yellow-800 font-medium text-sm sm:text-base">
                      Please review this policy periodically to stay informed about how we are protecting your information.
                    </p>
                  </div>
                </div>
              </div>

              {/* 9. Contact Us */}
              <div id="contact" className="bg-[#F15A24] rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 text-white scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-white/20 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">9. Contact Us</h2>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                    If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
                  </p>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 space-y-2 sm:space-y-3">
                    <div>
                      <p className="font-semibold text-base sm:text-lg">Ball Mastery</p>
                      <p className="text-white/80 text-xs sm:text-sm">www.ballmastery.com</p>
                    </div>
                    <div className="space-y-1">
                      <p className="flex items-center text-sm sm:text-base">
                        <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="break-all">train@brightstarsoccer.com</span>
                      </p>
                      <p className="flex items-center text-sm sm:text-base">
                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                        704-641-9830
                      </p>
                    </div>
                  </div>
                  <p className="text-white/80 text-xs sm:text-sm mt-3 sm:mt-4">
                    We typically respond within 3-5 business days
                  </p>
                </div>
              </div>

              {/* Acknowledgment */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border-2 border-[#F15A24]">
                <p className="text-center text-gray-700 font-medium text-sm sm:text-base">
                  By using this Site, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </section>
  );
};

export default PrivacyPolicy;