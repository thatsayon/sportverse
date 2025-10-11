"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  LogOut,
  Bell,
  Mail,
  MessageCircle,
  ChevronDown,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import Logo from "../Element/Logo";
import { removeCookie, getCookie } from "@/hooks/cookie";
import ChatConversation from "../Element/ChatConversation";
import { useGetTrainerChatListQuery } from "@/store/Slices/apiSlices/trainerApiSlice";
import { getSocket } from "@/lib/socket";
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;
const NOTIFICATION_SOCKET_URL = process.env.NEXT_PUBLIC_NOTIFICATION_URL;

interface NavProps {
  className?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    id: string;
    user_id: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
  }[];
}

const Navbar: React.FC<NavProps> = ({ className = "" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState<{
    id: string;
    otherUser: string;
  } | null>(null);
  const [localMessageList, setLocalMessageList] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

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

  // Fetch existing notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      const accessToken = getCookie("access_token");

      if (!accessToken) {
        console.warn("⚠️ No access token found in cookies.");
        setIsLoadingNotifications(false);
        return;
      }

      try {
        const response = await fetch(`${NOTIFICATION_SOCKET_URL}notifications/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: NotificationAPIResponse = await response.json();
        console.log("📥 Fetched notifications:", data);

        // Transform API response to match our Notification interface
        const transformedNotifications: Notification[] = data.results.map((notif) => ({
          id: notif.id,
          title: notif.title,
          message: notif.message,
          timestamp: notif.created_at,
          read: notif.is_read,
        }));

        setNotifications(transformedNotifications);
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        // Silently fail - don't show error to user
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);

  // Socket integration for real-time notifications
  useEffect(() => {
    const accessToken = getCookie("access_token");

    if (!accessToken) {
      console.warn("⚠️ No access token found in cookies.");
      return;
    }

    let userId: string | undefined;

    try {
      const decoded: any = jwtDecode(accessToken);
      userId = decoded?.user_id || decoded?.id;
      console.log("Decoded user ID:", userId);
    } catch (err) {
      console.error("❌ Error decoding JWT:", err);
      return;
    }

    if (!userId) {
      console.error("❌ No user_id found in token payload.");
      return;
    }

    let notificationSocket: any = null;

    try {
      // ✅ Establish socket connection
      notificationSocket = io(NOTIFICATION_SOCKET_URL, {
        auth: { user_id: userId },
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      // 🔌 Connection events
      notificationSocket.on("connect", () => {
        console.log("🔌 Notification Socket Connected:", notificationSocket.id);
        setIsSocketConnected(true);
      });

      notificationSocket.on("disconnect", () => {
        console.log("❌ Notification Socket Disconnected");
        setIsSocketConnected(false);
      });

      notificationSocket.on("connect_error", (error: any) => {
        console.warn("⚠️ Notification Socket Connection Error:", error.message);
        setIsSocketConnected(false);
        // Silently fail - don't show error to user
      });

      // 🔔 New notification
      notificationSocket.on("new_notification", (data: any) => {
        console.log("🔔 New notification:", data);

        const newNotification: Notification = {
          id: data.id || Date.now().toString(),
          title: data.title || "New Notification",
          message: data.message || data.content || "",
          timestamp: data.timestamp || data.created_at || new Date().toISOString(),
          read: false,
        };

        setNotifications((prev) => [newNotification, ...prev]);
      });

      // ✅ Mark notification as read
      notificationSocket.on("notification_read", (data: any) => {
        console.log("✅ Notification marked as read:", data);
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === data.notification_id ? { ...notif, read: true } : notif
          )
        );
      });
    } catch (error) {
      console.error("❌ Error setting up notification socket:", error);
      // Silently fail - don't show error to user
    }

    // 🧹 Cleanup on unmount
    return () => {
      if (notificationSocket) {
        try {
          notificationSocket.disconnect();
          console.log("🧹 Notification socket disconnected");
        } catch (error) {
          console.error("❌ Error disconnecting notification socket:", error);
        }
      }
    };
  }, []);

  const navItems = [
    { name: "Home", href: "/student" },
    { name: "Virtual Training", href: "/student/virtual-training" },
    { name: "Video Library", href: "/student/video-library" },
    { name: "In-Person", href: "/student/in-person" },
    { name: "Pricing", href: "/student/pricing" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleRedirect = () => {
    router.push("/student/bookings");
  };

  // Function to check if a link is active
  const isActive = (href: string) => {
    if (href === "/student") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    removeCookie("access_token");
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

  const handleNotificationClick = async (notificationId: string) => {
    // Mark notification as read locally
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );

    // Send request to server to mark as read
    try {
      const accessToken = getCookie("access_token");
      if (!accessToken) return;

      await fetch(`${NOTIFICATION_SOCKET_URL}notifications/${notificationId}/read/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      console.log("✅ Notification marked as read on server:", notificationId);
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
      // Silently fail - don't show error to user
    }
  };

  const getTimeAgo = (timestamp: string) => {
    try {
      const now = new Date();
      const notifTime = new Date(timestamp);
      const diffMs = now.getTime() - notifTime.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch (error) {
      return "recently";
    }
  };

  const totalUnreadCount = localMessageList.reduce(
    (acc, c) => acc + (c.unread_count || 0),
    0
  );

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <nav
      className={`bg-white py-2 border-b border-gray-200 sticky top-0 z-50 ${className}`}
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
                  className={`font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                      : "text-gray-700 hover:text-orange-500"
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop User Menu & Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Messages */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <MessageCircle className="size-6" />
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
                            {item.other_user?.charAt(0)?.toUpperCase() || "T"}
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
                    <div className="text-center py-4 text-gray-500 w-full">
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
                  <Bell className="size-6" />
                  {unreadNotificationCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-[10px] sm:text-xs"
                    >
                      {unreadNotificationCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 sm:w-80 max-h-96 overflow-y-auto">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isLoadingNotifications ? (
                  <DropdownMenuItem disabled>
                    <p className="text-sm text-gray-500">Loading notifications...</p>
                  </DropdownMenuItem>
                ) : notifications.length === 0 ? (
                  <DropdownMenuItem disabled>
                    <p className="text-sm text-gray-500">No notifications yet</p>
                  </DropdownMenuItem>
                ) : (
                  notifications.map((notification) => (
                    <React.Fragment key={notification.id}>
                      <DropdownMenuItem
                        onClick={() => handleNotificationClick(notification.id)}
                        className={notification.read ? "opacity-60" : ""}
                      >
                        <div className="flex flex-col space-y-1 w-full">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium">{notification.title}</p>
                            {!notification.read && (
                              <span className="h-2 w-2 bg-blue-500 rounded-full mt-1 ml-2 flex-shrink-0"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{notification.message}</p>
                          <span className="text-xs text-gray-400">
                            {getTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </React.Fragment>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="flex items-center gap-1 cursor-pointer">
                  <Avatar>
                    <AvatarImage src={"/avatars/01.png"} />
                    <AvatarFallback>User</AvatarFallback>
                  </Avatar>
                  <ChevronDown />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  <h1 className="font-montserrat font-medium">
                    Student Profile
                  </h1>
                  <p className="text-[#5E5E5E] text-xs">student@213124</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <Link href={"/student/profile"}>
                  <DropdownMenuItem>
                    <User className="size-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <Link href={"/student/bookings"}>
                  <DropdownMenuItem onClick={handleRedirect}>
                    <Calendar className="size-4 mr-2" />
                    Bookings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-[#CD5E5E]"
                >
                  <LogOut stroke="#CD5E5E" className="size-4 mr-2" />
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
              animate={{ opacity: 1, height: "auto" }}
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
                        isActive(item.href)
                          ? "text-orange-500 bg-orange-50"
                          : "text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Actions */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  {/* Mobile Messages */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="relative w-full justify-start">
                        <Mail className="h-5 w-5 mr-2" />
                        Messages
                        {totalUnreadCount > 0 && (
                          <Badge
                            variant="destructive"
                            className="ml-auto h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]"
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
                            onClick={() => {
                              handleMessageClick(item);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <div className="flex items-start space-x-3 w-full">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/avatars/01.png" />
                                <AvatarFallback>
                                  {item.other_user?.charAt(0)?.toUpperCase() || "T"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">
                                  {item.other_user}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {item.last_message || "No messages yet"}
                                </p>
                              </div>
                              <div className="text-right">
                                {item.unread_count > 0 && (
                                  <span className="text-xs text-red-500 font-semibold">
                                    {item.unread_count}
                                  </span>
                                )}
                                <p className="text-xs text-gray-400">2m</p>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem disabled>
                          <div className="text-center py-4 text-gray-500 w-full">
                            No messages yet
                          </div>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Mobile Notifications */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="relative w-full justify-start">
                        <Bell className="h-5 w-5 mr-2" />
                        Notifications
                        {unreadNotificationCount > 0 && (
                          <Badge
                            variant="destructive"
                            className="ml-auto h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]"
                          >
                            {unreadNotificationCount}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-72 sm:w-80 max-h-96 overflow-y-auto">
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {isLoadingNotifications ? (
                        <DropdownMenuItem disabled>
                          <p className="text-sm text-gray-500">Loading notifications...</p>
                        </DropdownMenuItem>
                      ) : notifications.length === 0 ? (
                        <DropdownMenuItem disabled>
                          <p className="text-sm text-gray-500">No notifications yet</p>
                        </DropdownMenuItem>
                      ) : (
                        notifications.map((notification) => (
                          <React.Fragment key={notification.id}>
                            <DropdownMenuItem
                              onClick={() => {
                                handleNotificationClick(notification.id);
                                setIsMobileMenuOpen(false);
                              }}
                              className={notification.read ? "opacity-60" : ""}
                            >
                              <div className="flex flex-col space-y-1 w-full">
                                <div className="flex items-start justify-between">
                                  <p className="text-sm font-medium">{notification.title}</p>
                                  {!notification.read && (
                                    <span className="h-2 w-2 bg-blue-500 rounded-full mt-1 ml-2 flex-shrink-0"></span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">{notification.message}</p>
                                <span className="text-xs text-gray-400">
                                  {getTimeAgo(notification.timestamp)}
                                </span>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </React.Fragment>
                        ))
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Mobile Profile Actions */}
                  <Link href={"/student/profile"}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </Link>

                  <Link href={"/student/bookings"}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Bookings
                    </Button>
                  </Link>

                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-[#CD5E5E]"
                  >
                    <LogOut stroke="#CD5E5E" className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
    </nav>
  );
};

export default Navbar;