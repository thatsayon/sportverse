"use client"
import { Shield, Eye, Lock, Users, Database, CheckCircle } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-[#F15A24] p-4 rounded-full mr-4">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Privacy <span className="text-[#F15A24]">Policy</span>
            </h1>
          </div>
          <p className="text-xl text-[#808080] max-w-2xl mx-auto">
            Your privacy matters to us. Here's how we protect and use your information.
          </p>
          <p className="text-sm text-[#808080] mt-4">Last updated: September 10, 2025</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Overview */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-[#F15A24] p-3 rounded-lg mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
            </div>
            <div className="space-y-4 text-[#808080] leading-relaxed">
              <p>
                At Sportverse, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information when you use our sports training platform.
              </p>
              <p>
                By using Sportverse, you agree to the practices described in this policy.
              </p>
            </div>
          </div>

          {/* What We Collect */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-[#F15A24] p-3 rounded-lg mr-4">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">What We Collect</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <ul className="space-y-2 text-[#808080]">
                  <li>• Your name and email address</li>
                  <li>• Profile details and athletic interests</li>
                  <li>• Training progress and performance data</li>
                  <li>• Payment information</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Information</h3>
                <ul className="space-y-2 text-[#808080]">
                  <li>• How you use our platform</li>
                  <li>• Device and browser information</li>
                  <li>• Location data (with permission)</li>
                  <li>• Cookies and similar technologies</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Your Data */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-[#F15A24] p-3 rounded-lg mr-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">How We Use Your Data</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-[#F15A24]/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-[#F15A24]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Provide Services</h3>
                <p className="text-[#808080] text-sm">Connect you with trainers and deliver personalized training programs</p>
              </div>
              <div className="text-center">
                <div className="bg-[#F15A24]/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-[#F15A24]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Improve Platform</h3>
                <p className="text-[#808080] text-sm">Analyze usage to enhance features and user experience</p>
              </div>
              <div className="text-center">
                <div className="bg-[#F15A24]/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-[#F15A24]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Stay Secure</h3>
                <p className="text-[#808080] text-sm">Protect against fraud and ensure platform safety</p>
              </div>
            </div>
          </div>

          {/* Data Sharing */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-[#F15A24] p-3 rounded-lg mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Data Sharing</h2>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <p className="text-green-800 font-semibold">
                We do not sell your personal information to third parties.
              </p>
            </div>
            <div className="space-y-4 text-[#808080]">
              <p>We only share your information when:</p>
              <ul className="space-y-2 ml-6">
                <li>• You give us permission (like connecting with a trainer)</li>
                <li>• We need help from trusted service providers</li>
                <li>• Required by law or to protect safety</li>
              </ul>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-[#F15A24] p-3 rounded-lg mr-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="font-semibold text-gray-900">Access your data</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="font-semibold text-gray-900">Correct inaccurate information</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="font-semibold text-gray-900">Delete your account</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="font-semibold text-gray-900">Export your data</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Us */}
          <div className="bg-[#F15A24] rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Questions About Your Privacy?</h2>
            <p className="text-white/90 mb-6">
              We're here to help! Contact our privacy team if you have any questions or concerns.
            </p>
            <div className="bg-white/10 rounded-lg p-4 inline-block">
              <p className="text-white font-semibold">privacy@sportverse.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;