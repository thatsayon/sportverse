"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import Logo from "../Element/Logo";
import { useJwt } from "@/hooks/useJwt";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { FaTiktok } from "react-icons/fa";

const socialIcons = [
  { Icon: Facebook, href: "https://www.facebook.com/share/18sUhsByEL/?mibextid=wwXlfr", label: "Facebook" },
  { Icon: FaTiktok, href: "#", label: "Tiktok" },
  { Icon: Instagram, href: "https://www.instagram.com/@officialballmastery", label: "Instagram" },
  { Icon: Youtube, href: "https://www.youtube.com/@OfficialBallmastery", label: "YouTube" },
];

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const { decoded } = useJwt();
  const pathname = usePathname();
  const quickLinks = [
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (
    pathname === "/login" ||
    pathname === "/social/signup" ||
    pathname === "/doc-submission" ||
    pathname === "/signup" ||
    pathname === "/video" ||
    pathname === "/forget-password/success" ||
    pathname === "/forget-password/verify-code" ||
    pathname === "/forget-password" ||
    pathname === "/forget-password/reset-password" ||
    pathname === "forget-password/success" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <footer className={`bg-slate-900 text-white ${className}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-36">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1 ">
            <div className="mb-4">
              <Logo
                href={decoded?.role === "student" ? "/student" : "/trainer"}
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              SportVerse is your all-in-one online sports training platform,
              dedicated to helping athletes of all levels improve their game in
              basketball, football, and beyond.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-orange-500 text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-orange-500 text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <h3 className="text-white font-semibold text-lg mb-4">Or connect with me here</h3>
            <div className="flex items-center justify-center gap-4">
              {socialIcons.map((social, index) => {
                const { Icon, href, label } = social;

                return (
                  <a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`
                    group
                    ${social.label === "Tiktok" ? "p-4":"p-3"} 
                    flex items-center justify-center
                    rounded-full
                    bg-gray-100 hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-600
                    transition-all duration-300
                    hover:scale-110
                    active:scale-95
                  `}
                  >
                    <Icon
                      className="
                    text-gray-600 group-hover:text-white
                    transition-colors duration-300
                  "
                    />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          variants={itemVariants}
          className="border-t border-gray-800 mt-12 pt-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-sm text-center sm:text-left">
              © 2023 by Ball Mastery  All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-orange-500 text-sm transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-orange-500 text-sm transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
