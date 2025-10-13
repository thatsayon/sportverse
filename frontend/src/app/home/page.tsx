"use client"
import React, { useState, useEffect } from 'react';
import { Music, Calendar, Mail, Phone, MapPin, Sparkles, Zap, Users, Check, ChevronDown, Menu, X } from 'lucide-react';

const ShaktiFlowSite = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    city: '',
    details: ''
  });
  const [formStatus, setFormStatus] = useState('');

  useEffect(() => {
    const hash = window.location.hash.slice(1) || 'home';
    setActiveSection(hash);

    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1) || 'home';
      setActiveSection(newHash);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (section) => {
    window.location.hash = section;
    setMobileMenuOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', phone: '', date: '', city: '', details: '' });
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'packages', label: 'Packages' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-purple-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Shakti Flow
              </span>
            </div>

            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeSection === item.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800">
            <nav className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-all ${
                    activeSection === item.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="pt-16">
        {activeSection === 'home' && (
          <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-950 to-pink-900/20" />
            <div className="absolute inset-0 opacity-40" style={{
              backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')"
            }} />
            
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
                Shakti Flow Entertainment
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Premium DJ & Entertainment Services
              </p>
              <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
                Elevate your event with professional sound, stunning visuals, and unforgettable energy
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('packages')}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/50"
                >
                  View Packages
                </button>
                <button
                  onClick={() => navigate('contact')}
                  className="px-8 py-4 bg-gray-800 rounded-lg font-semibold hover:bg-gray-700 transition-all border border-gray-700"
                >
                  Get In Touch
                </button>
              </div>
            </div>

            <button
              onClick={() => navigate('about')}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
            >
              <ChevronDown className="w-8 h-8 text-gray-400" />
            </button>
          </section>
        )}

        {activeSection === 'about' && (
          <section className="min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                About Us
              </h2>
              
              <div className="bg-gray-900/50 rounded-2xl p-8 md:p-12 border border-gray-800 mb-8">
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  Shakti Flow Entertainment brings your vision to life with premium DJ services, cutting-edge sound systems, and breathtaking visual production. Whether you're planning an intimate gathering or a grand celebration, we deliver unforgettable experiences tailored to your unique style.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  From the first beat to the last dance, we're committed to creating moments that resonate long after the music stops.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 rounded-xl p-6 border border-purple-800/30">
                  <Music className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-purple-300">Music Specialties</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center"><Check className="w-5 h-5 mr-2 text-purple-400" /> House</li>
                    <li className="flex items-center"><Check className="w-5 h-5 mr-2 text-purple-400" /> EDM</li>
                    <li className="flex items-center"><Check className="w-5 h-5 mr-2 text-purple-400" /> Hip-Hop</li>
                    <li className="flex items-center"><Check className="w-5 h-5 mr-2 text-purple-400" /> Pop</li>
                    <li className="flex items-center"><Check className="w-5 h-5 mr-2 text-purple-400" /> Bollywood</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-pink-900/30 to-gray-900/50 rounded-xl p-6 border border-pink-800/30">
                  <Sparkles className="w-12 h-12 text-pink-400 mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-pink-300">What We Offer</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center"><Check className="w-5 h-5 mr-2 text-pink-400" /> Professional DJ Services</li>
                    <li className="flex items-center"><Check className="w-5 h-5 mr-2 text-pink-400" /> Premium Sound Systems</li>
                    <li className="flex items-center"><Check className="w-5 h-5 mr-2 text-pink-400" /> Dynamic Lighting</li>
                    <li className="flex items-center"><Check className="w-5 h-5 mr-2 text-pink-400" /> Visual Production</li>
                    <li className="flex items-center"><Check className="w-5 h-5 mr-2 text-pink-400" /> Custom Experiences</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'packages' && (
          <section className="min-h-screen py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Packages
              </h2>
              <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                All packages are customizable estimates. Every event is unique, and we'll work with you to create the perfect experience.
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800 hover:border-purple-600/50 transition-all">
                  <div className="text-sm font-semibold text-purple-400 mb-2">TIER 1</div>
                  <h3 className="text-2xl font-bold mb-4">Essential</h3>
                  <div className="text-3xl font-bold mb-6 text-purple-400">From $1,000+</div>
                  <ul className="space-y-3 text-gray-300 mb-8">
                    <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-purple-400 mt-0.5 flex-shrink-0" /> Full audio setup</li>
                    <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-purple-400 mt-0.5 flex-shrink-0" /> 4 hours of service</li>
                    <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-purple-400 mt-0.5 flex-shrink-0" /> Perfect for small events</li>
                    <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-purple-400 mt-0.5 flex-shrink-0" /> Professional DJ</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl p-8 border-2 border-purple-500 relative transform md:scale-105 shadow-xl shadow-purple-500/20">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1 rounded-full text-sm font-semibold">
                    MOST BOOKED
                  </div>
                  <div className="text-sm font-semibold text-purple-300 mb-2">TIER 2</div>
                  <h3 className="text-2xl font-bold mb-4">Premium</h3>
                  <div className="text-3xl font-bold mb-6 text-purple-300">From $2,000+</div>
                  <ul className="space-y-3 text-gray-300 mb-8">
                    <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-purple-300 mt-0.5 flex-shrink-0" /> Premium sound system</li>
                    <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-purple-300 mt-0.5 flex-shrink-0" /> Professional lighting</li>
                    <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-purple-300 mt-0.5 flex-shrink-0" /> Extended time</li>
                    <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-purple-300 mt-0.5 flex-shrink-0" /> Enhanced experience</li>
                  </ul>
                </div>

                <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800 hover:border-pink-600/50 transition-all">
                  <div className="text-sm font-semibold text-pink-400 mb-2">TIER 3</div>
                  <h3 className="text-2xl font-bold mb-4">Elite</h3>
                  <div className="text-3xl font-bold mb-6 text-pink-400">From $5,000+</div>
                  <ul className="space-y-3 text-gray-300 mb-8">
                    <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-pink-400 mt-0.5 flex-shrink-0" /> Full production setup</li>
                    <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-pink-400 mt-0.5 flex-shrink-0" /> Advanced visuals</li>
                    <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-pink-400 mt-0.5 flex-shrink-0" /> Complete experience</li>
                    <li className="flex items-start"><Check className="w-5 h-5 mr-2 text-pink-400 mt-0.5 flex-shrink-0" /> Premium everything</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
                <h3 className="text-2xl font-bold mb-6 text-center">Available Add-Ons</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    'Live instrumentalists (violin, sax, guitar, tabla, sitar)',
                    'Vocalists & singers',
                    'Professional dancers (Bollywood, Bhangra, ballet, bellydance)',
                    'Uplighting',
                    'Extra subwoofers',
                    'Cold sparks (venue-approved)',
                    'CO₂ jets',
                    'Projector & screen',
                    'Ceremony audio',
                    'Additional hours'
                  ].map((addon, i) => (
                    <div key={i} className="flex items-start text-gray-300">
                      <Sparkles className="w-5 h-5 mr-2 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{addon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'gallery' && (
          <section className="min-h-screen py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Gallery
              </h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="relative aspect-square bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all group">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Music className="w-12 h-12 text-purple-400/50 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Event Photo {i}</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              <p className="text-center text-gray-400 mt-12">
                More photos coming soon! Check back for updates from our latest events.
              </p>
            </div>
          </section>
        )}

        {activeSection === 'faq' && (
          <section className="min-h-screen py-20 px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                {[
                  {
                    q: 'How far in advance should I book?',
                    a: 'We recommend booking at least 3-6 months in advance for peak season dates. However, we can often accommodate last-minute requests depending on availability.'
                  },
                  {
                    q: 'What types of events do you service?',
                    a: 'We specialize in weddings, corporate events, private parties, birthdays, anniversaries, and more. Every event is customized to your specific needs and vision.'
                  },
                  {
                    q: 'Are the package prices fixed?',
                    a: 'Package prices are starting estimates. Every event is unique, and final pricing depends on your specific requirements, location, duration, and add-ons.'
                  },
                  {
                    q: 'Do you travel for events?',
                    a: 'Yes! We service events throughout the region. Travel fees may apply depending on location.'
                  },
                  {
                    q: 'Can I request specific songs?',
                    a: 'Absolutely! We encourage you to share your must-play list and any songs you would prefer to avoid. Your satisfaction is our priority.'
                  },
                  {
                    q: 'What happens if there is a technical issue?',
                    a: 'We bring backup equipment to every event and have years of experience handling any situation that may arise. Your event will go smoothly.'
                  }
                ].map((faq, i) => (
                  <div key={i} className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                    <h3 className="text-xl font-bold mb-3 text-purple-300">{faq.q}</h3>
                    <p className="text-gray-300 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'contact' && (
          <section className="min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Get In Touch
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                    <Mail className="w-8 h-8 text-purple-400 mb-3" />
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-gray-400">bookings@shaktiflow.com</p>
                  </div>

                  <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                    <Phone className="w-8 h-8 text-purple-400 mb-3" />
                    <h3 className="font-semibold mb-2">Phone</h3>
                    <p className="text-gray-400">Phone shared after inquiry</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-800/30">
                    <h3 className="font-semibold mb-3 text-purple-300">Why Choose Us?</h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-purple-400" /> Professional equipment</li>
                      <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-purple-400" /> Experienced team</li>
                      <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-purple-400" /> Custom packages</li>
                      <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-purple-400" /> Dedicated support</li>
                    </ul>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Phone (optional)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Event Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Venue / City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Event Details</label>
                      <textarea
                        rows={4}
                        value={formData.details}
                        onChange={(e) => setFormData({...formData, details: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                      />
                    </div>

                    {formStatus === 'success' && (
                      <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-green-300 text-sm">
                        Thanks — we'll be back in touch shortly.
                      </div>
                    )}

                    {formStatus === 'error' && (
                      <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300 text-sm">
                        Something went wrong. Please try again.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formStatus === 'sending' ? 'Sending...' : 'Send Inquiry'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-6 h-6 text-purple-500" />
                <span className="font-bold text-lg">Shakti Flow</span>
              </div>
              <p className="text-gray-400 text-sm">
                Premium DJ & Entertainment Services
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <button onClick={() => navigate('packages')} className="hover:text-purple-400 transition-colors">
                    Pricing
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('contact')} className="hover:text-purple-400 transition-colors">
                    Contact
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('faq')} className="hover:text-purple-400 transition-colors">
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <button onClick={() => navigate('privacy')} className="hover:text-purple-400 transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('terms')} className="hover:text-purple-400 transition-colors">
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>bookings@shaktiflow.com</li>
                <li>Phone shared after inquiry</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Shakti Flow Entertainment. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {(activeSection === 'privacy' || activeSection === 'terms') && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => navigate('home')}>
          <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl max-h-[80vh] overflow-y-auto border border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {activeSection === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h2>
              <button onClick={() => navigate('home')} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {activeSection === 'privacy' && (
              <div className="space-y-4 text-gray-300">
                <p>
                  At Shakti Flow Entertainment, we respect your privacy and are committed to protecting your personal information.
                </p>
                <h3 className="text-xl font-bold text-purple-300 mt-6">Information We Collect</h3>
                <p>
                  When you submit an inquiry through our contact form, we collect your name, email address, phone number (optional), event date, venue/city, and event details. This information is used solely to respond to your inquiry and provide our services.
                </p>
                <h3 className="text-xl font-bold text-purple-300 mt-6">How We Use Your Information</h3>
                <p>
                  We use the information you provide to communicate with you about your event, provide quotes, and deliver our services. We do not sell, rent, or share your personal information with third parties for marketing purposes.
                </p>
                <h3 className="text-xl font-bold text-purple-300 mt-6">Data Security</h3>
                <p>
                  We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure.
                </p>
                <h3 className="text-xl font-bold text-purple-300 mt-6">Contact Us</h3>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at bookings@shaktiflow.com.
                </p>
              </div>
            )}

            {activeSection === 'terms' && (
              <div className="space-y-4 text-gray-300">
                <p>
                  By using our website and services, you agree to these terms of service.
                </p>
                <h3 className="text-xl font-bold text-purple-300 mt-6">Services</h3>
                <p>
                  Shakti Flow Entertainment provides professional DJ and entertainment services for events. All packages are customizable estimates, and final pricing will be determined based on your specific event requirements.
                </p>
                <h3 className="text-xl font-bold text-purple-300 mt-6">Bookings</h3>
                <p>
                  Event bookings are subject to availability and require a deposit to secure your date. Specific booking terms, cancellation policies, and payment schedules will be outlined in your service agreement.
                </p>
                <h3 className="text-xl font-bold text-purple-300 mt-6">Liability</h3>
                <p>
                  We carry appropriate insurance and take all reasonable precautions to ensure safe and professional service delivery. Specific liability terms will be detailed in your service agreement.
                </p>
                <h3 className="text-xl font-bold text-purple-300 mt-6">Modifications</h3>
                <p>
                  We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of any changes.
                </p>
                <h3 className="text-xl font-bold text-purple-300 mt-6">Contact</h3>
                <p>
                  For questions about these terms, please contact us at bookings@shaktiflow.com.
                </p>
              </div>
            )}

            <button
              onClick={() => navigate('home')}
              className="mt-8 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShaktiFlowSite;