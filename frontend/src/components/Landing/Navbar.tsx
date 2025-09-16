"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "../Element/Logo";

interface NavProps {
  className?: string;
}

const Navbar: React.FC<NavProps> = ({ className = "" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Fixed function to check if a link is active
  const isActive = (href: string) => {
    // For home page, only match exact path
    if (href === "/") {
      return pathname === "/";
    }
    // For other pages, check if pathname starts with the href
    return pathname.startsWith(href);
  };

   if (pathname === "/" || pathname === "/about" || pathname === "/faq" || pathname === "/contact" || pathname === "/help" || pathname === "/privacy" || pathname === "/terms") {

    
  
  return (
    <nav
      className={`
        backdrop-blur-lg bg-white/80 
        border-b border-white/20 
        shadow-lg shadow-black/5
        sticky top-0 z-50 py-2
        ${className}
      `}
    >
      <div className="px-4 sm:px-6 lg:px-16">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="">
            <Logo href="/student" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`
                    font-medium transition-all duration-300 
                    px-3 py-2 rounded-lg relative
                    ${
                      isActive(item.href)
                        ? "text-orange-500 bg-orange-500/10 backdrop-blur-sm border border-orange-500/20 shadow-md"
                        : "text-gray-700 hover:text-orange-500 hover:bg-white/30 hover:backdrop-blur-sm hover:border hover:border-white/30 hover:shadow-md"
                    }
                  `}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop User Menu & Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href={"/login"}>
              <Button className="
                font-bold
                backdrop-blur-sm bg-gray-900/90 
                border border-white/20
                shadow-lg shadow-black/10
                hover:bg-gray-800/90 hover:shadow-xl
                transition-all duration-300
              ">
                Login
              </Button>
            </Link>
            <Link href={"/signup"}>
              <Button 
                variant={"outline"} 
                className="
                  text-[#F15A24] font-bold
                  backdrop-blur-sm bg-white/20
                  border border-[#F15A24]/30
                  shadow-lg shadow-black/5
                  hover:bg-[#F15A24]/10 hover:shadow-xl
                  hover:border-[#F15A24]/50
                  transition-all duration-300
                "
              >
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              className="
                backdrop-blur-sm bg-white/20
                border border-white/20
                hover:bg-white/30
                transition-all duration-300
              "
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="
                lg:hidden 
                border-t border-white/20
                backdrop-blur-lg bg-white/60
                rounded-b-xl
                shadow-xl shadow-black/10
              "
            >
              <div className="py-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`
                        block px-4 py-3 text-sm font-medium rounded-lg 
                        transition-all duration-300 mx-2
                        backdrop-blur-sm
                        ${
                          isActive(item.href)
                            ? "text-orange-500 bg-orange-500/20 border border-orange-500/30 shadow-md"
                            : "text-gray-700 hover:text-orange-500 hover:bg-white/40 hover:border hover:border-white/40 hover:shadow-md"
                        }
                      `}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <div className="pt-4 border-t border-white/20 flex items-center gap-2 px-2">
                  <Link href={"/login"}>
                    <Button className="
                      font-bold
                      backdrop-blur-sm bg-gray-900/90 
                      border border-white/20
                      shadow-lg shadow-black/10
                      hover:bg-gray-800/90 hover:shadow-xl
                      transition-all duration-300
                    ">
                      Login
                    </Button>
                  </Link>
                  <Link href={"/signup"}>
                    <Button
                      variant={"outline"}
                      className="
                        text-[#F15A24] font-bold
                        backdrop-blur-sm bg-white/20
                        border border-[#F15A24]/30
                        shadow-lg shadow-black/5
                        hover:bg-[#F15A24]/10 hover:shadow-xl
                        hover:border-[#F15A24]/50
                        transition-all duration-300
                      "
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
};

export default Navbar;