"use client"
import React, { useState, useEffect } from 'react';
import { Scale, User, CreditCard, Shield, AlertTriangle, CheckCircle, Globe, Menu, X, FileText, Image, Ban, Users, Gavel, Phone, Mail } from 'lucide-react';

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState('acceptance');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const sections = [
    { id: 'acceptance', label: 'Acceptance of Terms', icon: CheckCircle },
    { id: 'content', label: 'Use of Content', icon: FileText },
    { id: 'images', label: 'Image Rights', icon: Image },
    { id: 'resale', label: 'Resale Restrictions', icon: Ban },
    { id: 'user-content', label: 'User-Generated Content', icon: Users },
    { id: 'prohibited', label: 'Prohibited Uses', icon: AlertTriangle },
    { id: 'liability', label: 'Limitation of Liability', icon: Shield },
    { id: 'indemnification', label: 'Indemnification', icon: Scale },
    { id: 'termination', label: 'Termination', icon: X },
    { id: 'governing', label: 'Governing Law', icon: Gavel },
    { id: 'changes', label: 'Changes to Terms', icon: FileText },
    { id: 'contact', label: 'Contact Information', icon: Phone },
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

  const scrollToSection = (id) => {
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
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
              <Scale className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center sm:text-left">
              Terms of <span className="text-[#F15A24]">Service</span>
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-[#808080] px-4">
            Please read these terms carefully before using Ball Mastery.
          </p>
          <p className="text-xs sm:text-sm text-[#808080] mt-3 sm:mt-4">Last updated: January 10, 2025</p>
        </div>

        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:gap-8">
            {/* Sidebar */}
            <aside className={`
              fixed lg:sticky inset-y-0 left-0 z-40 w-72 sm:w-80 lg:w-64 xl:w-[360px]
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
              {/* Introduction */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Introduction</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#808080] leading-relaxed">
                  <p>
                    These Terms and Conditions ("Agreement") govern your access to and use of the www.ballmastery.com operated by Ball Mastery LLC, owned by Bright Star Soccer LLC, its affiliates, and subsidiaries (collectively referred to as "we," "our," or "us").
                  </p>
                  <p>
                    By accessing, browsing, or using this Site, you agree to comply with and be bound by this Agreement. If you do not agree to these Terms and Conditions, please do not use this Site.
                  </p>
                </div>
              </div>

              {/* 1. Acceptance of Terms */}
              <div id="acceptance" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#808080] leading-relaxed">
                  <p>
                    By using the Ball Mastery LLC website, you agree to the terms outlined in this Agreement, which may be updated periodically without notice. The most recent version of the Terms and Conditions will always be available on the Site.
                  </p>
                  <div className="bg-orange-50 border-l-4 border-[#F15A24] p-3 sm:p-4 rounded">
                    <p className="text-gray-700 font-medium text-sm sm:text-base">
                      You are encouraged to review these Terms regularly to stay informed of any updates.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Use of Content */}
              <div id="content" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">2. Use of Content</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#808080] leading-relaxed">
                  <p>
                    All content provided on the Site, including but not limited to articles, images, videos, logos, designs, text, graphics, and other materials (collectively referred to as "Content"), is the intellectual property of Ball Mastery LLC, Bright Star Soccer LLC, or our licensors and is protected by copyright, trademark, and other intellectual property laws.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                      <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                        Permitted Use
                      </h3>
                      <p className="text-green-700 text-xs sm:text-sm">
                        You may access and view the Content on the Site for personal, non-commercial use only.
                      </p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                      <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2 flex items-center">
                        <Ban className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                        Prohibited Use
                      </h3>
                      <p className="text-red-700 text-xs sm:text-sm">
                        You may not reproduce, distribute, transmit, display, sell, license, or otherwise exploit any Content for commercial purposes without prior written consent.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Image Rights */}
              <div id="images" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    {/* <Image className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> */}
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">3. Image Rights and Licensing</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#808080] leading-relaxed">
                  <p>
                    Any images, photos, or visual content provided on the Site are either owned by Ball Mastery LLC or licensed for use. By accessing and viewing images on this Site, you acknowledge that:
                  </p>
                  <ul className="space-y-2 sm:space-y-3 ml-2 sm:ml-4">
                    <li className="flex items-start">
                      <span className="text-[#F15A24] mr-2 mt-1 flex-shrink-0">•</span>
                      <span>The images may not be copied, reproduced, redistributed, modified, or used for any other purpose without prior written consent from Ball Mastery LLC or the respective image rights holder.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#F15A24] mr-2 mt-1 flex-shrink-0">•</span>
                      <span>Any use of images that infringes upon the rights of Ball Mastery LLC or any third-party rights holder will be subject to legal action, including but not limited to claims for damages or injunctive relief.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#F15A24] mr-2 mt-1 flex-shrink-0">•</span>
                      <span>You may not create derivative works of the images provided, including using them in the creation of other content, whether digital or physical, without obtaining permission from Ball Mastery LLC.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 4. Resale Restrictions */}
              <div id="resale" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <Ban className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">4. Resale or Reuse Restrictions</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#808080] leading-relaxed">
                  <p>
                    The intellectual property available on the Site, including but not limited to text, graphics, video, audio, and images, may not be resold, reused, or otherwise exploited for commercial purposes without obtaining explicit written permission from Ball Mastery LLC.
                  </p>
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded">
                    <p className="text-red-700 font-medium text-sm sm:text-base">
                      Unauthorized resale or reuse of content will be treated as a violation of these Terms and may result in legal action.
                    </p>
                  </div>
                  <p>
                    You are prohibited from using any part of the Site's Content in any manner that competes with Ball Mastery LLC's commercial interests, including but not limited to creating derivative works, republishing, or distributing the Content for resale.
                  </p>
                </div>
              </div>

              {/* 5. User-Generated Content */}
              <div id="user-content" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">5. User-Generated Content</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#808080] leading-relaxed">
                  <p>
                    You may have the opportunity to submit or upload content to the Site, such as comments, reviews, or other submissions (collectively, "User Content"). By submitting User Content, you grant Ball Mastery LLC a non-exclusive, worldwide, royalty-free, perpetual, and irrevocable license to use, modify, reproduce, distribute, and display such User Content on the Site or through other media.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2 sm:mb-3">You represent and warrant that:</h3>
                    <ul className="space-y-1.5 sm:space-y-2 text-blue-800 text-xs sm:text-sm">
                      <li>• You own or have the necessary rights to the User Content you submit</li>
                      <li>• Your User Content does not infringe any third-party rights, including intellectual property rights</li>
                      <li>• Your User Content complies with all applicable laws and regulations</li>
                    </ul>
                  </div>
                  <p className="text-xs sm:text-sm">
                    Ball Mastery LLC reserves the right to remove or edit any User Content at its discretion and without notice.
                  </p>
                </div>
              </div>

              {/* 6. Prohibited Uses */}
              <div id="prohibited" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">6. Prohibited Uses</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#808080] leading-relaxed">
                  <p className="font-medium text-gray-700">
                    You agree not to use the Site for any unlawful or prohibited activity, including but not limited to:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                      <ul className="space-y-1.5 sm:space-y-2 text-red-700 text-xs sm:text-sm">
                        <li>• Violating any applicable laws or regulations</li>
                        <li>• Engaging in activities that could damage or impair the Site</li>
                        <li>• Interfering with other users' access to the Site</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                      <ul className="space-y-1.5 sm:space-y-2 text-red-700 text-xs sm:text-sm">
                        <li>• Using automated tools to scrape or collect Content</li>
                        <li>• Uploading viruses, malware, or harmful code</li>
                        <li>• Attempting unauthorized access to the Site or systems</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. Limitation of Liability */}
              <div id="liability" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">7. Limitation of Liability</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#808080] leading-relaxed">
                  <p>
                    Ball Mastery LLC and Bright Star Soccer LLC will not be liable for any damages, losses, or expenses arising from your use or inability to use the Site, including but not limited to direct, indirect, incidental, special, or consequential damages, even if we have been advised of the possibility of such damages.
                  </p>
                  <div className="bg-gray-100 border-l-4 border-gray-500 p-3 sm:p-4 rounded">
                    <p className="text-gray-700 font-medium text-sm sm:text-base">
                      Our total liability to you shall not exceed the amount you have paid, if any, to access the Site.
                    </p>
                  </div>
                </div>
              </div>

              {/* 8. Indemnification */}
              <div id="indemnification" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">8. Indemnification</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#808080] leading-relaxed">
                  <p>
                    You agree to indemnify, defend, and hold harmless Ball Mastery LLC, Bright Star Soccer LLC, and their respective affiliates, directors, officers, employees, agents, and licensors from and against any claims, liabilities, damages, losses, costs, or expenses arising out of or in connection with:
                  </p>
                  <ul className="space-y-1.5 sm:space-y-2 ml-2 sm:ml-4">
                    <li className="flex items-start">
                      <span className="text-[#F15A24] mr-2 mt-1 flex-shrink-0">•</span>
                      <span>Your use of the Site</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#F15A24] mr-2 mt-1 flex-shrink-0">•</span>
                      <span>Violation of these Terms and Conditions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#F15A24] mr-2 mt-1 flex-shrink-0">•</span>
                      <span>Infringement of any third-party rights</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 9. Termination */}
              <div id="termination" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">9. Termination</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#808080] leading-relaxed">
                  <p>
                    Ball Mastery LLC may, in its sole discretion, suspend or terminate your access to the Site at any time without notice if we believe you have violated any of these Terms and Conditions or for any other reason.
                  </p>
                </div>
              </div>

              {/* 10. Governing Law */}
              <div id="governing" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <Gavel className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">10. Governing Law</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#808080] leading-relaxed">
                  <p>
                    These Terms and Conditions shall be governed by and construed in accordance with the laws of the state in which Ball Mastery LLC is incorporated, without regard to its conflict of law principles.
                  </p>
                  <p>
                    Any dispute or claim arising out of or relating to these Terms and Conditions shall be subject to the exclusive jurisdiction of the courts in that state.
                  </p>
                </div>
              </div>

              {/* 11. Changes to Terms */}
              <div id="changes" className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-[#F15A24] p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">11. Changes to Terms and Conditions</h2>
                </div>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#808080] leading-relaxed">
                  <p>
                    Ball Mastery LLC reserves the right to modify or update these Terms and Conditions at any time. Any changes will be posted on this page, and the updated version will include a revised "Effective Date."
                  </p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 sm:p-4 rounded">
                    <p className="text-yellow-800 font-medium text-sm sm:text-base">
                      By continuing to use the Site after any changes, you agree to abide by the updated Terms and Conditions.
                    </p>
                  </div>
                </div>
              </div>

              {/* 12. Contact Information */}
              <div id="contact" className="bg-[#F15A24] rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 text-white scroll-mt-20 sm:scroll-mt-24">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-white/20 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">12. Contact Information</h2>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                    If you have any questions or concerns regarding these Terms and Conditions, please contact us at:
                  </p>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 space-y-2 sm:space-y-3">
                    <div>
                      <p className="font-semibold text-base sm:text-lg">Ball Mastery LLC</p>
                      <p className="text-white/80 text-xs sm:text-sm">c/o Bright Star Soccer LLC</p>
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
                  By using this Site, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
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

export default TermsOfService;