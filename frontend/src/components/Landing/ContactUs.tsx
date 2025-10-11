/* eslint-disable react/no-unescaped-entities */
"use client"
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    userType: 'athlete'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {

      emailjs.init("VSlNt2JVRmQL04OMV");

      const result = await emailjs.send("service_7gas7lk", "template_iw4uvfl",
        {
          from_name: formData.name,
          from_email: formData.email,
          user_type: formData.userType,
          subject: formData.subject,
          message: formData.message,
          to_email: 'train@brightstarsoccer.com',
        },
        "VSlNt2JVRmQL04OMV"
      );

      if (result.status === 200) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          userType: 'athlete'
        });
        
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      setSubmitStatus('error');
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.7)), url('/Landing/contact.jpg')`,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-black mb-4 lg:mb-6">
            Get in <span className="text-[#F15A24]">Touch</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Ready to elevate your soccer training? Have questions about Ball Mastery? We're here to help you on your journey.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-8">
            <div className="bg-white/40 backdrop-blur-sm border border-white/20 rounded-lg p-6 lg:p-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-black mb-6">
                Contact Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-[#F15A24] p-3 rounded-full flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-black font-semibold">Email</p>
                    <a href="mailto:train@brightstarsoccer.com" className="text-gray-700 hover:text-[#F15A24] transition-colors break-all">
                      train@brightstarsoccer.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-[#F15A24] p-3 rounded-full flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-black font-semibold">Phone</p>
                    <a href="tel:+17046419830" className="text-gray-700 hover:text-[#F15A24] transition-colors">
                      +1 (704) 641-9830
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-[#F15A24] p-3 rounded-full flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-black font-semibold">Website</p>
                    <a href="https://www.ballmastery.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#F15A24] transition-colors">
                      www.ballmastery.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-[#F15A24] p-3 rounded-full flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-black font-semibold">Response Time</p>
                    <p className="text-gray-700">We typically respond within<br />3-5 business days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/40 backdrop-blur-sm border border-white/20 rounded-lg p-6 lg:p-8">
              <h3 className="text-xl font-bold text-black mb-4">Why Choose Ball Mastery?</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#F15A24]">100+</div>
                  <div className="text-gray-700 text-sm">Expert Coaches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#F15A24]">10k+</div>
                  <div className="text-gray-700 text-sm">Athletes Trained</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#F15A24]">50+</div>
                  <div className="text-gray-700 text-sm">Programs Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#F15A24]">25+</div>
                  <div className="text-gray-700 text-sm">Countries Reached</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-sm border border-white/20 rounded-lg p-6 lg:p-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-black mb-6">
              Send us a Message
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-black font-semibold mb-2">
                  I am a:
                </label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/40 border border-white/30 rounded-lg text-black placeholder-gray-600 focus:outline-none focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/20 transition-all"
                >
                  <option value="athlete" className="bg-gray-200 text-black">Athlete/Student</option>
                  <option value="trainer" className="bg-gray-200 text-black">Trainer/Coach</option>
                  <option value="parent" className="bg-gray-200 text-black">Parent/Guardian</option>
                  <option value="organization" className="bg-gray-200 text-black">Sports Organization</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-black font-semibold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/40 border border-white/30 rounded-lg text-black placeholder-gray-600 focus:outline-none focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/20 transition-all"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-black font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/40 border border-white/30 rounded-lg text-black placeholder-gray-600 focus:outline-none focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/20 transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-black font-semibold mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/40 border border-white/30 rounded-lg text-black placeholder-gray-600 focus:outline-none focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/20 transition-all"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-black font-semibold mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-white/40 border border-white/30 rounded-lg text-black placeholder-gray-600 focus:outline-none focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/20 transition-all resize-vertical"
                  placeholder="Tell us more about how we can help you..."
                ></textarea>
              </div>

              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-800 text-sm">
                    Thank you for contacting us! We'll get back to you within 3-5 business days.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-800 text-sm">
                    Oops! Something went wrong. Please try again or email us directly at train@brightstarsoccer.com
                  </p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#F15A24] hover:bg-[#F15A24]/90 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#F15A24]/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;