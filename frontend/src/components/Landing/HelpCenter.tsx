"use client";
import { useState } from "react";
import {
  Search,
  Book,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  User,
  CreditCard,
  Settings,
  Trophy,
  Shield,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const categories = [
    { id: "all", name: "All Topics", icon: Book, count: 24 },
    { id: "account", name: "Account & Profile", icon: User, count: 8 },
    { id: "training", name: "Training & Programs", icon: Trophy, count: 6 },
    { id: "billing", name: "Billing & Payments", icon: CreditCard, count: 5 },
    { id: "technical", name: "Technical Support", icon: Settings, count: 3 },
    { id: "safety", name: "Safety & Security", icon: Shield, count: 2 },
  ];

  const faqs = [
    {
      id: 1,
      category: "account",
      question: "How do I create an account on Sportverse?",
      answer:
        "Creating an account is simple! Click the \"Sign Up\" button in the top right corner, choose whether you're an athlete or trainer, fill out your basic information, and verify your email address. You'll be ready to start your fitness journey in minutes.",
    },
    {
      id: 2,
      category: "account",
      question: "Can I change my profile information after signing up?",
      answer:
        "Yes, you can update your profile anytime! Go to Settings > Profile Information to edit your name, bio, fitness goals, and other details. Some information like your email may require verification when changed.",
    },
    {
      id: 3,
      category: "training",
      question: "How do I find the right trainer for me?",
      answer:
        "Use our smart matching system! Tell us about your fitness goals, preferred training style, and schedule. Our algorithm will suggest trainers that match your needs. You can also browse trainer profiles, read reviews, and book consultations to find your perfect match.",
    },
    {
      id: 4,
      category: "training",
      question: "Can I train with multiple trainers?",
      answer:
        "Absolutely! Many athletes work with different trainers for different aspects of their training. You can have a strength trainer, a cardio coach, and a sports-specific trainer all on the same platform.",
    },
    {
      id: 5,
      category: "billing",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, and digital wallets like Apple Pay and Google Pay. All payments are processed securely with bank-level encryption.",
    },
    {
      id: 6,
      category: "billing",
      question: "How does the refund policy work?",
      answer:
        "We offer a 30-day money-back guarantee for new subscriptions. Training session refunds depend on the trainer's individual cancellation policy, which you can see on their profile. Most trainers offer free cancellation up to 24 hours before the session.",
    },
    {
      id: 7,
      category: "technical",
      question:
        "The video call isn't working during my training session. What should I do?",
      answer:
        "First, check your internet connection and refresh the page. Make sure your browser allows camera and microphone access. If issues persist, try switching to a different browser or contact our technical support team immediately for real-time assistance.",
    },
    {
      id: 8,
      category: "safety",
      question: "How do you verify trainer qualifications?",
      answer:
        "All trainers undergo a thorough verification process including certification checks, background screening, and skills assessment. We verify their credentials with issuing organizations and require ongoing education to maintain their status on our platform.",
    },
  ];

  const quickActions = [
    {
      title: "Book a Training Session",
      description: "Find and schedule sessions with expert trainers",
      icon: Trophy,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Update Payment Method",
      description: "Manage your billing and payment information",
      icon: CreditCard,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Contact Support",
      description: "Get help from our customer service team",
      icon: MessageCircle,
      color: "from-purple-500 to-violet-600",
    },
    {
      title: "Account Settings",
      description: "Modify your profile and preferences",
      icon: Settings,
      color: "from-orange-500 to-red-600",
    },
  ];

  const supportOptions = [
    {
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      icon: MessageCircle,
      availability: "Available 24/7",
      action: "Start Chat",
    },
    {
      title: "Phone Support",
      description: "Speak directly with a support specialist",
      icon: Phone,
      availability: "Mon-Fri: 9 AM - 8 PM EST",
      action: "Call Now",
    },
    {
      title: "Email Support",
      description: "Send us a detailed message about your issue",
      icon: Mail,
      availability: "Response within 24 hours",
      action: "Send Email",
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: number | null) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-[#F15A24] p-4 rounded-full mr-4">
              <Book className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Help <span className="text-[#F15A24]">Center</span>
            </h1>
          </div>
          <p className="text-xl text-[#808080] max-w-2xl mx-auto">
            Find answers to your questions and get the support you need to make
            the most of Sportverse.
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                        activeCategory === category.id
                          ? "bg-[#F15A24] text-white"
                          : "text-[#808080] hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 mr-3" />
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          activeCategory === category.id
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-[#808080]"
                        }`}
                      >
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">
                  Frequently Asked Questions
                </h2>
                <p className="text-[#808080] mt-2">
                  {filteredFAQs.length}{" "}
                  {filteredFAQs.length === 1 ? "article" : "articles"} found
                </p>
              </div>

              <div className="p-6">
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-[#808080] mx-auto mb-4" />
                    <p className="text-[#808080]">
                      No articles found matching your search.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredFAQs.map((faq) => (
                      <div
                        key={faq.id}
                        className="border border-gray-200 rounded-lg"
                      >
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 pr-4">
                            {faq.question}
                          </span>
                          {openFAQ === faq.id ? (
                            <ChevronUp className="w-5 h-5 text-[#808080] flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-[#808080] flex-shrink-0" />
                          )}
                        </button>
                        {openFAQ === faq.id && (
                          <div className="p-4 pt-0 border-t border-gray-200">
                            <p className="text-[#808080] leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="bg-gradient-to-r from-[#F15A24] to-orange-600 rounded-2xl shadow-2xl p-8 lg:p-12">
            {/* Heading Section */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Still need help?
              </h2>
              <p className="text-white/90 text-lg max-w-2xl mx-auto">
                Our support team is here to help you with any questions or
                concerns. Reach out during our service hours and we’ll be glad
                to assist.
              </p>
              <p className="text-white/90 text-lg mt-4">
                <strong>Mon – Fri:</strong> 9:00 AM – 8:00 PM <br />
                <strong>Sat – Sun:</strong> 10:00 AM – 6:00 PM
              </p>
            </div>

            {/* Call to Action */}
            <div className="flex justify-center">
              <Link href="/contact">
                <Button className="bg-white text-[#F15A24] font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpCenter;
