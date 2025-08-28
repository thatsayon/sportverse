'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, BarChart3, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface NavProps {
  className?: string
}

const Navigation: React.FC<NavProps> = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { name: 'Home', href: '/', active: true },
    { name: 'Virtual Training', href: '/virtual-training' },
    { name: 'Video Library', href: '/video-library' },
    { name: 'In-Person', href: '/in-person' },
    { name: 'Pricing', href: '/pricing' },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className={`bg-white border-b border-gray-200 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-orange-500 text-white px-3 py-1 rounded-lg font-bold text-xl"
            >
              SV
            </motion.div>
            <span className="text-xl font-semibold text-orange-500">SportVerse</span>
          </Link>

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
                  className={`text-sm font-medium transition-colors duration-200 ${
                    item.active
                      ? 'text-orange-500 border-b-2 border-orange-500 pb-1'
                      : 'text-gray-700 hover:text-orange-500'
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop User Menu & Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="bg-orange-50">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
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
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200"
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
                      className={`block px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        item.active
                          ? 'text-orange-500 bg-orange-50'
                          : 'text-gray-700 hover:text-orange-500 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navigation