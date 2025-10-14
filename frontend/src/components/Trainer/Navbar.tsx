"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  BarChart3,
  LogOut,
  Bell,
  Mail,
  MessageCircle,
  ChevronDown,
  Loader,
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
import Logo from "../Element/Logo";
import { removeCookie, getCookie, setCookie } from "@/hooks/cookie";
import ChatConversation from "../Element/ChatConversation";
import { useGetTrainerChatListQuery } from "@/store/Slices/apiSlices/trainerApiSlice";
import { getSocket } from "@/lib/socket";
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { useGetTrainerTokenMutation } from "@/store/Slices/apiSlices/apiSlice";
import { decodeToken } from "@/hooks/decodeToken";
import WarningAlert from "../Element/WarningAlart";

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
  const [getToken, { isLoading }] = useGetTrainerTokenMutation();
  const router = useRouter();
  const pathname = usePathname();
  const { data: messageList } = useGetTrainerChatListQuery();
  const [open, isOpen] = useState<boolean>(false);

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
        const response = await fetch(
          `${NOTIFICATION_SOCKET_URL}notifications/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: NotificationAPIResponse = await response.json();
        console.log("📥 Fetched notifications:", data);

        // Transform API response to match our Notification interface
        const transformedNotifications: Notification[] = data.results.map(
          (notif) => ({
            id: notif.id,
            title: notif.title,
            message: notif.message,
            timestamp: notif.created_at,
            read: notif.is_read,
          })
        );

        setNotifications(transformedNotifications);
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
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

    // ✅ Establish socket connection
    const notificationSocket = io(NOTIFICATION_SOCKET_URL, {
      auth: { user_id: userId },
      transports: ["websocket"],
      autoConnect: true,
    });

    // 🔌 Connection events
    notificationSocket.on("connect", () => {
      console.log("🔌 Notification Socket Connected:", notificationSocket.id);
    });

    notificationSocket.on("disconnect", () => {
      console.log("❌ Notification Socket Disconnected");
    });

    // 🔔 New notification
    notificationSocket.on("new_notification", (data: any) => {
      console.log("🔔 New notification:", data);

      const newNotification: Notification = {
        id: data.id || Date.now().toString(),
        title: data.title || "New Notification",
        message: data.message || data.content || "",
        timestamp:
          data.timestamp || data.created_at || new Date().toISOString(),
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

    // 🧹 Cleanup on unmount
    return () => {
      notificationSocket.disconnect();
      console.log("🧹 Notification socket disconnected");
    };
  }, []);

  const navItems = [
    { name: "Home", href: "/trainer" },
    { name: "Virtual Training", href: "/trainer/virtual-training" },
    { name: "Video Library", href: "/trainer/video-library" },
    { name: "In-Person", href: "/trainer/in-person" },
    { name: "Pricing", href: "/trainer/pricing" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to check if a link is active
  const isActive = (href: string) => {
    if (href === "/trainer") {
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

      await fetch(
        `${NOTIFICATION_SOCKET_URL}notifications/${notificationId}/read/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("✅ Notification marked as read on server:", notificationId);
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
    }
  };

  const getTimeAgo = (timestamp: string) => {
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
  };

  const totalUnreadCount = localMessageList.reduce(
    (acc, c) => acc + (c.unread_count || 0),
    0
  );

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const handleCheckingMobile = async () => {
    console.log("clicked mobile")
    const response = await getToken().unwrap();

    // console.log("User status:",response)

    if (response.access_token) {
      removeCookie("access_token");
      setCookie("access_token", response.access_token, 7);
      const user = decodeToken(response.access_token);

      // console.log("User status:",user?.verification_status)
      // console.log("Token status:",response)
      if (user?.verification_status === "verified") {
        router.push("/dashboard");
        setIsMobileMenuOpen(false);
      } else {
        isOpen(true);
      }
    }
  };
  const handleChecking = async () => {
    console.log("clicked")
    const response = await getToken().unwrap()
    console.log("Response status:",response)


    if (response.access_token) {
      removeCookie("access_token");
      setCookie("access_token", response.access_token, 7);
      const user = decodeToken(response.access_token);
      console.log("User status:",user)

      if (user?.verification_status === "verified") {
        router.push("/dashboard");
      } else {
        isOpen(true);
      }
    }
  };

  return (
    <nav
      className={`bg-white py-2 border-b border-gray-200 sticky top-0 z-50 ${className}`}
    >
      <div className="px-4 sm:px-6 lg:px-16">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="">
            <Logo href="/trainer" />
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
            {/* Messages Dropdown */}
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
                {localMessageList.length === 0 ? (
                  <DropdownMenuItem disabled>
                    <p className="text-sm text-gray-500">No messages yet</p>
                  </DropdownMenuItem>
                ) : (
                  localMessageList.map((item, index) => (
                    <DropdownMenuItem
                      key={item.conversation_id || index}
                      onClick={() => handleMessageClick(item)}
                    >
                      <div className="flex items-start w-full space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://res.cloudinary.com/dn4ygnsfg/image/upload/v1760208782/6e599501252c23bcf02658617b29c894_cbgerm.jpg" />
                          <AvatarFallback>ST</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">
                              {item.other_user}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {item.last_message}
                            </p>
                          </div>
                          <div>
                            {item.unread_count > 0 && (
                              <span className="mb-2 text-xs text-red-500 font-semibold">
                                {item.unread_count}
                              </span>
                            )}
                            <p className="text-xs text-gray-400">2m</p>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
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
              <DropdownMenuContent
                align="end"
                className="w-72 sm:w-80 max-h-96 overflow-y-auto"
              >
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isLoadingNotifications ? (
                  <DropdownMenuItem disabled>
                    <p className="text-sm text-gray-500">
                      Loading notifications...
                    </p>
                  </DropdownMenuItem>
                ) : notifications.length === 0 ? (
                  <DropdownMenuItem disabled>
                    <p className="text-sm text-gray-500">
                      No notifications yet
                    </p>
                  </DropdownMenuItem>
                ) : (
                  notifications.map((notification, index) => (
                    <React.Fragment key={index}>
                      <DropdownMenuItem
                        onClick={() => handleNotificationClick(notification.id)}
                        className={notification.read ? "opacity-60" : ""}
                      >
                        <div className="flex flex-col space-y-1 w-full">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="h-2 w-2 bg-blue-500 rounded-full mt-1 ml-2 flex-shrink-0"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {notification.message}
                          </p>
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

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="flex items-center gap-1 cursor-pointer">
                  <Avatar>
                    <AvatarImage src={"https://res.cloudinary.com/dn4ygnsfg/image/upload/v1760208782/6e599501252c23bcf02658617b29c894_cbgerm.jpg"} />
                    <AvatarFallback>User</AvatarFallback>
                  </Avatar>
                  <ChevronDown />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleChecking}>
                  {isLoading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <>
                      {" "}
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </>
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleChecking}>
                  {isLoading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <>
                      {" "}
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Dashboard
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="size-4 mr-2" />
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="relative w-full justify-start"
                      >
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
                      {localMessageList.length === 0 ? (
                        <DropdownMenuItem disabled>
                          <p className="text-sm text-gray-500">
                            No messages yet
                          </p>
                        </DropdownMenuItem>
                      ) : (
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
                                <AvatarImage src="https://res.cloudinary.com/dn4ygnsfg/image/upload/v1760208782/6e599501252c23bcf02658617b29c894_cbgerm.jpg" />
                                <AvatarFallback>ST</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">
                                  {item.other_user}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {item.last_message}
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
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Mobile Notifications */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="relative w-full justify-start"
                      >
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
                    <DropdownMenuContent
                      align="end"
                      className="w-72 sm:w-80 max-h-96 overflow-y-auto"
                    >
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {isLoadingNotifications ? (
                        <DropdownMenuItem disabled>
                          <p className="text-sm text-gray-500">
                            Loading notifications...
                          </p>
                        </DropdownMenuItem>
                      ) : notifications.length === 0 ? (
                        <DropdownMenuItem disabled>
                          <p className="text-sm text-gray-500">
                            No notifications yet
                          </p>
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
                                  <p className="text-sm font-medium">
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <span className="h-2 w-2 bg-blue-500 rounded-full mt-1 ml-2 flex-shrink-0"></span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">
                                  {notification.message}
                                </p>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={handleCheckingMobile}
                  >
                    {isLoading ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <>
                        {" "}
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={handleCheckingMobile}
                  >
                    {isLoading ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <>
                        {" "}
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Dashboard
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
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
      <WarningAlert open={open} isOpen={isOpen} />
    </nav>
  );
};

export default Navbar;
