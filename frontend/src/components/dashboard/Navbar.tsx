// components/Navbar.tsx
"use client";

import React, { useState } from "react";
import { Menu, Bell, Mail, User, MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Logo from "../Element/Logo";
import { useJwt } from "@/hooks/useJwt";
import Link from "next/link";
import { removeCookie } from "@/hooks/cookie";
import { usePathname, useRouter } from "next/navigation";
import ChatConversation from "../Element/ChatConversation";
import { set } from "zod";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { decoded } = useJwt();
const [chatOpen, setChatOpen] = useState<boolean>(false);
  const router = useRouter()
  const pathname = usePathname()
  const handleLogout = ()=>{
    removeCookie("access_token")
    removeCookie("")
    router.push("/login")
  }

 // Split pathname into segments and get the last non-empty segment
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || "Dashboard";

  // Convert dashed words into capitalized words
  const formattedSegment = lastSegment
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return (
    <header className="bg-[#f8f8f8] fixed w-full z-50  px-4 py-2 lg:px-6">
      <div className="flex items-center justify-between h-full">
        {/* Left side */}
        <div className="flex items-center justify-center">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden mr-2"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <div className=" flex items-center justify-center">
            <Logo
              href={decoded?.role === "admin" ? "/dashboard" : "/trainer"}
            />
          </div>
        </div>

        {/* Center Title - hide on small screens */}
        <h1 className="hidden sm:block text-lg sm:text-2xl font-bold text-gray-900">
          {formattedSegment}
        </h1>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Messages */}
          {decoded?.role === "teacher" && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <MessageCircleIcon className="size-5" />
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-[10px] sm:text-xs"
                    >
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 sm:w-80">
                  <DropdownMenuLabel>Messages</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                  onClick={()=> setChatOpen(true)}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/01.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">John Doe</p>
                        <p className="text-xs text-gray-500 truncate">
                          Hey, can we schedule a training session?
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">2m</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="size-5" />
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-[10px] sm:text-xs"
                    >
                      5
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 sm:w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">New booking request</p>
                      <p className="text-xs text-gray-500">
                        James Hall requested a training session
                      </p>
                      <span className="text-xs text-gray-400">
                        5 minutes ago
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Payment received</p>
                      <p className="text-xs text-gray-500">
                        $250 payment from Iva Ryan
                      </p>
                      <span className="text-xs text-gray-400">1 hour ago</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full"
              >
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src="/avatars/user.png" alt="User" />
                  <AvatarFallback className="bg-[#F15A24] text-white">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {decoded?.role === "admin" ? (
                <>
                  <Link href={'/dashboard/settings'}>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  </Link>
                </>
              ) : (
                <>
                  <Link href={"/trainer"}>
                    <DropdownMenuItem>Home</DropdownMenuItem>
                  </Link>
                  <Link href={"/dashboard/trainer-settings"}>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ChatConversation
        open={chatOpen}
        setOpen={setChatOpen}
        otherUserName="John Doe"
        currentUserName="You"
      />
    </header>
  );
};

export default Navbar;
