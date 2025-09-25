// components/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
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
import { removeCookie, getCookie } from "@/hooks/cookie";
import { usePathname, useRouter } from "next/navigation";
import ChatConversation from "../Element/ChatConversation";
import { useGetTrainerChatListQuery } from "@/store/Slices/apiSlices/trainerApiSlice";
import { getSocket } from "@/lib/socket";

const SOCKET_URL = "https://stingray-intimate-sincerely.ngrok-free.app";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { decoded } = useJwt();
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [activeConversation, setActiveConversation] = useState<{
    id: string;
    otherUser: string;
  } | null>(null);
  const [localMessageList, setLocalMessageList] = useState<any[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const { data: messageList } = useGetTrainerChatListQuery();

  // Initialize local message list from API data
  useEffect(() => {
    if (messageList?.results) setLocalMessageList(messageList.results);
  }, [messageList]);

  // Handle body scroll when chat is open
  useEffect(() => {
    document.body.style.overflow = chatOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [chatOpen]);

  // Socket integration for real-time messaging
  useEffect(() => {
    const socket = getSocket(SOCKET_URL, getCookie("access_token") || "");
    console.log("Socket in Dashboard Navbar:", socket);
    
    const handleNewMessage = (msg: any) => {
      setLocalMessageList((prev) => {
        const index = prev.findIndex(
          (c) => c.conversation_id === msg.conversation_id
        );

        if (index !== -1) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            last_message: msg.content,
            unread_count: (updated[index].unread_count || 0) + 1,
          };
          return updated;
        } else {
          return [
            {
              conversation_id: msg.conversation_id,
              other_user: msg.sender_name,
              last_message: msg.content,
              unread_count: 1,
            },
            ...prev,
          ];
        }
      });
    };

    socket.on("receive_message", handleNewMessage);

    return () => {
      socket.off("receive_message", handleNewMessage);
    };
  }, []);

  const handleLogout = () => {
    removeCookie("access_token");
    removeCookie("");
    router.push("/login");
  };

  const handleMessageClick = (item: any) => {
    setActiveConversation({
      id: item.conversation_id,
      otherUser: item.other_user,
    });
    setChatOpen(true);

    // Reset unread count for the clicked conversation
    setLocalMessageList((prev) =>
      prev.map((c) =>
        c.conversation_id === item.conversation_id
          ? { ...c, unread_count: 0 }
          : c
      )
    );
  };

  const totalUnreadCount = localMessageList.reduce(
    (acc, c) => acc + (c.unread_count || 0),
    0
  );

  // Function to get the page title based on pathname
  const getPageTitle = () => {
    // Check if the current path matches the chat conversation pattern
    const chatConversationPattern = /^\/dashboard\/chat\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
    const mediaPattern = /^\/dashboard\/media\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
    
    if (chatConversationPattern.test(pathname)) {
      return "Chat Conversation";
    }

    if(mediaPattern.test(pathname)){
      return "Media Player"
    }

    // Default behavior for other routes
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1] || "Dashboard";

    // Convert dashed words into capitalized words
    return lastSegment
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const pageTitle = getPageTitle();

  return (
    <header className="bg-[#f8f8f8] fixed w-full z-50 px-4 py-2 lg:px-6">
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
          <div className="flex items-center justify-center">
            <Logo
              href={decoded?.role === "admin" ? "/dashboard" : "/trainer"}
            />
          </div>
        </div>

        {/* Center Title - hide on small screens */}
        <h1 className="hidden sm:block text-lg sm:text-2xl font-bold text-gray-900">
          {pageTitle}
        </h1>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Messages - Only for teachers */}
          {decoded?.role === "teacher" && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <MessageCircleIcon className="size-5" />
                    {totalUnreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-[10px] sm:text-xs"
                      >
                        {totalUnreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 sm:w-80">
                  <DropdownMenuLabel>Messages</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {localMessageList.length > 0 ? (
                    localMessageList.map((item, index) => (
                      <DropdownMenuItem
                        key={item.conversation_id || index}
                        onClick={() => handleMessageClick(item)}
                      >
                        <div className="flex items-start space-x-3 w-full">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/avatars/01.png" />
                            <AvatarFallback>
                              {item.other_user?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{item.other_user}</p>
                              <p className="text-xs text-gray-500 truncate">
                                {item.last_message || "No messages yet"}
                              </p>
                            </div>
                            <div className="text-right">
                              {item.unread_count > 0 && (
                                <span className="text-xs text-red-500 font-semibold mb-1 block">
                                  {item.unread_count}
                                </span>
                              )}
                              <span className="text-xs text-gray-400">2m</span>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      <div className="text-center py-4 text-gray-500">
                        No messages yet
                      </div>
                    </DropdownMenuItem>
                  )}
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

      {/* Chat Conversation Modal */}
      {activeConversation && (
        <ChatConversation
          open={chatOpen}
          setOpen={setChatOpen}
          conversationId={activeConversation.id}
          otherUserName={activeConversation.otherUser}
          currentUserName="You"
        />
      )}
    </header>
  );
};

export default Navbar;