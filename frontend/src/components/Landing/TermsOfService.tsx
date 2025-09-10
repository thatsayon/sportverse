"use client"
import { Scale, User, CreditCard, Shield, AlertTriangle, CheckCircle, Globe } from 'lucide-react';

const TermsOfService = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-[#F15A24] p-4 rounded-full mr-4">
              <Scale className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Terms of <span className="text-[#F15A24]">Service</span>
            </h1>
          </div>
          <p className="text-xl text-[#808080] max-w-2xl mx-auto">
            Simple, fair terms that protect both you and Sportverse.
          </p>
          <p className="text-sm text-[#808080] mt-4">Last updated: September 10, 2025</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-[#F15A24] p-3 rounded-lg mr-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to Sportverse</h2>
            </div>
            <div className="space-y-4 text-[#808080] leading-relaxed">
              <p>
                These terms explain the rules for using Sportverse, our sports training platform that connects athletes with professional trainers.
              </p>
              <p>
                By using our platform, you agree to follow these terms. We've kept them simple and fair.
              </p>
            </div>
          </div>

          {/* Your Account */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-[#F15A24] p-3 rounded-lg mr-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Your Account</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Requirements</h3>
                <ul className="space-y-2 text-[#808080]">
                  <li>• You must be at least 13 years old</li>
                  <li>• Provide accurate information</li>
                  <li>• One account per person</li>
                  <li>• Keep your login details secure</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Responsibilities</h3>
                <ul className="space-y-2 text-[#808080]">
                  <li>• Use the platform respectfully</li>
                  <li>• Follow trainer instructions safely</li>
                  <li>• Report any problems to us</li>
                  <li>• Don't share your account</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Platform Rules */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-[#F15A24] p-3 rounded-lg mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Platform Rules</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  What We Encourage
                </h3>
                <ul className="space-y-1 text-green-700">
                  <li>• Respectful communication with trainers and other users</li>
                  <li>• Honest feedback and reviews</li>
                  <li>• Sharing your fitness journey positively</li>
                  <li>• Supporting fellow athletes</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  What's Not Allowed
                </h3>
                <ul className="space-y-1 text-red-700">
                  <li>• Bullying, harassment, or inappropriate behavior</li>
                  <li>• Sharing false information</li>
                  <li>• Trying to hack or damage the platform</li>
                  <li>• Using the platform for illegal activities</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payments */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-[#F15A24] p-3 rounded-lg mr-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Payments & Refunds</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure Payments</h3>
                <p className="text-[#808080] text-sm">All payments are processed securely through encrypted systems</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">30-Day Guarantee</h3>
                <p className="text-[#808080] text-sm">Get a full refund within 30 days if you're not satisfied</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Scale className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Fair Pricing</h3>
                <p className="text-[#808080] text-sm">Transparent pricing with no hidden fees</p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-[#F15A24] p-3 rounded-lg mr-4">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Important Health Notice</h2>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-yellow-800 mb-4">
                <strong>Please exercise safely!</strong> Physical training involves some risk of injury.
              </p>
              <ul className="space-y-2 text-yellow-700">
                <li>• Consult a doctor before starting any new fitness program</li>
                <li>• Follow your trainer's instructions carefully</li>
                <li>• Stop immediately if you feel pain or discomfort</li>
                <li>• Listen to your body and train within your limits</li>
              </ul>
            </div>
          </div>

          {/* Our Commitment */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-[#F15A24] p-3 rounded-lg mr-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Commitment to You</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">What We Promise</h3>
                <ul className="space-y-2 text-[#808080]">
                  <li>• Keep your data safe and private</li>
                  <li>• Provide reliable platform service</li>
                  <li>• Respond to your questions quickly</li>
                  <li>• Continuously improve our platform</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Service Availability</h3>
                <ul className="space-y-2 text-[#808080]">
                  <li>• 99.9% uptime target</li>
                  <li>• 24/7 customer support</li>
                  <li>• Regular platform updates</li>
                  <li>• Advanced notice of maintenance</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Us */}
          <div className="bg-[#F15A24] rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Questions About These Terms?</h2>
            <p className="text-white/90 mb-6">
              Our legal team is happy to help clarify anything you don't understand.
            </p>
            <div className="bg-white/10 rounded-lg p-4 inline-block">
              <p className="text-white font-semibold">legal@sportverse.com</p>
            </div>
            <p className="text-white/80 text-sm mt-4">
              We typically respond within 3-5 business days
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsOfService;