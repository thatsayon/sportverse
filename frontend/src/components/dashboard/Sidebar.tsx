'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Image,
  DollarSign,
  MessageSquare,
  BarChart3,
  FolderOpen,
  Settings,
  ChevronDown,
  ChevronRight,
  User,
  UserRound,
  BanknoteArrowDown
} from 'lucide-react'
import { useJwt } from '@/hooks/useJwt'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Booking',
    href: '/dashboard/booking',
    icon: Calendar,
  },
  {
    name: 'Trainers',
    href: '/dashboard/trainers',
    icon: User,
  },
  {
    name: 'Trainees',
    href: '/dashboard/trainees',
    icon: UserRound,
  },
  {
    name: 'Visitors',
    href: '/dashboard/visitors',
    icon: Users,
  },
  {
    name: 'Media management',
    href: '/dashboard/media',
    icon: Image,
  },
  {
    name: 'Payout history',
    href: '/dashboard/payout',
    icon: DollarSign,
  },
  {
    name: 'Withdraw',
    href: '/dashboard/withdraw',
    icon: BanknoteArrowDown,
  },
  {
    name: 'Chat log',
    href: '/dashboard/chat',
    icon: MessageSquare,
  },
  {
    name: 'Analytics and reports',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    name: 'Sports',
    href: '/dashboard/category',
    icon: FolderOpen,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export const navItemsTrainer = [
  {
    title: "Dashboard",
    icon: "LayoutDashboard",
    path: "/dashboard",
  },
  {
    title: "Session management",
    icon: "CalendarDays",
    path: "/sessions",
  },
  {
    title: "Booked session",
    icon: "CalendarCheck", // closer match since it’s a booked calendar
    path: "/sessions/booked",
  },
  {
    title: "Upload video",
    icon: "Video",
    path: "/videos/upload",
  },
  {
    title: "Revenue",
    icon: "DollarSign",
    path: "/revenue",
  },
  {
    title: "My wallet",
    icon: "CreditCard",
    children: [
      {
        title: "Add wallet",
        icon: "Plus",
        path: "/wallet/add",
      },
      {
        title: "Withdraw",
        icon: "WalletMinimal", // or "Banknote" if you prefer
        path: "/wallet/withdraw",
      },
    ],
  },
  {
    title: "Settings",
    icon: "Settings",
    path: "/settings",
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname()
  const {decoded,isExpired} = useJwt()

  console.log("Token info decoded:", decoded)
  console.log("Token info Expired:", isExpired)
  const [expandedItems, setExpandedItems] = useState<string[]>(['Analytics and reports'])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const isParentActive = (item: NavItem) => {
    if (isActive(item.href)) return true
    if (item.children) {
      return item.children.some(child => isActive(child.href))
    }
    return false
  }

  const NavLink: React.FC<{ item: NavItem; level?: number }> = ({ item, level = 0 }) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.name)
    const active = isActive(item.href)
    const parentActive = isParentActive(item)

    return (
      <div>
        <div
          className={cn(
            'flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors cursor-pointer',
            level > 0 ? 'pl-12' : '',
            active || parentActive
              ? 'bg-[#F15A24] text-white'
              : 'text-[#808080] hover:bg-gray-100 hover:text-[#F15A24]'
          )}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.name)
            } else {
              onClose()
            }
          }}
        >
          <Link
            href={item.href}
            className="flex items-center flex-1"
            onClick={(e) => {
              if (hasChildren) {
                e.preventDefault()
              }
            }}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </Link>
          {hasChildren && (
            <div className="ml-2">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          )}
        </div>

        {hasChildren && (
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {item.children?.map((child) => (
                  <NavLink key={child.name} item={child} level={level + 1} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile/Tablet Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-gray-400/45 bg-opacity-50 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Fixed on desktop, slide-in on mobile */}
      <div className={cn(
        'fixed top-16 lg:top-24 left-0 z-50 h-full w-64 bg-white border-gray-200 transform transition-transform duration-300 ease-in-out',
        // Desktop: always visible
        'lg:translate-x-0',
        // Mobile/Tablet: slide in/out based on isOpen
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        

        {/* Navigation */}
        <nav className="flex-1 px-0 py-4 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </nav>
      </div>
    </>
  )
}

export default Sidebar