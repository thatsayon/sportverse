"use client"
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    userType: 'athlete'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for contacting us! We\'ll get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      userType: 'athlete'
    });
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-gray-100 to-white">
      {/* Hero Background with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.7)), url('https://plus.unsplash.com/premium_photo-1667668223835-19c104de847d?q=80&w=706&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-black mb-4 lg:mb-6">
            Get in <span className="text-[#F15A24]">Touch</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Ready to elevate your sports training? Have questions about our platform? We're here to help you on your athletic journey.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white/40 backdrop-blur-sm border border-white/20 rounded-lg p-6 lg:p-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-black mb-6">
                Contact Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-[#F15A24] p-3 rounded-full">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-black font-semibold">Email</p>
                    <p className="text-gray-700">support@sportverse.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-[#F15A24] p-3 rounded-full">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-black font-semibold">Phone</p>
                    <p className="text-gray-700">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-[#F15A24] p-3 rounded-full">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-black font-semibold">Address</p>
                    <p className="text-gray-700">123 Sports Avenue<br />Athletic City, AC 12345</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-[#F15A24] p-3 rounded-full">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-black font-semibold">Business Hours</p>
                    <p className="text-gray-700">Mon - Fri: 9:00 AM - 8:00 PM<br />Sat - Sun: 10:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/40 backdrop-blur-sm border border-white/20 rounded-lg p-6 lg:p-8">
              <h3 className="text-xl font-bold text-black mb-4">Why Choose Sportverse?</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#F15A24]">500+</div>
                  <div className="text-gray-700 text-sm">Expert Trainers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#F15A24]">10k+</div>
                  <div className="text-gray-700 text-sm">Athletes Trained</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#F15A24]">24/7</div>
                  <div className="text-gray-700 text-sm">Support Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#F15A24]">99%</div>
                  <div className="text-gray-700 text-sm">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
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

              <button
                onClick={handleSubmit}
                className="w-full bg-[#F15A24] hover:bg-[#F15A24]/90 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#F15A24]/30 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
