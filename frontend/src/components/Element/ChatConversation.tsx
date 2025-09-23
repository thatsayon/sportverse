"use client";
 
import React, { useEffect, useState, useRef } from "react";
import { X, Send, User } from "lucide-react";
import { motion } from "framer-motion";
import { getSocket } from "@/lib/socket";
import { getCookie } from "@/hooks/cookie";
import { jwtDecode } from "jwt-decode";
 
interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  recipient_id: string;
  recipient_name: string;
  content: string;
  created_at: string;
  delivered: boolean;
  read: boolean;
}
 
interface ChatProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  conversationId: string;
  otherUserName: string;
  currentUserName: string;
}
 
const SOCKET_URL = "https://stingray-intimate-sincerely.ngrok-free.app";
 
const ChatConversation: React.FC<ChatProps> = ({
  open,
  setOpen,
  conversationId,
  otherUserName,
  currentUserName,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [otherUserId, setOtherUserId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
 
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
 
  // 1️⃣ Get currentUserId from JWT
  useEffect(() => {
    const token = getCookie("access_token");
    if (!token) return;
    try {
      const decoded = jwtDecode<{ user_id: string }>(token);
      if (decoded?.user_id) setCurrentUserId(decoded.user_id);
    } catch (err) {
      console.error("Failed to decode JWT", err);
    }
  }, []);
 
  // 2️⃣ Use the centralized socket
  const socket = getSocket(SOCKET_URL, getCookie("access_token") || "");
 
  useEffect(() => {
    if (!open || !currentUserId) return;
 
    // Join conversation room
    socket.emit("join_conversations", { conversations: [conversationId] });
 
    // Listen for messages for this conversation
    const handleMessage = (msg: Message) => {
      if (msg.conversation_id === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
 
    socket.on("receive_message", handleMessage);
 
    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${SOCKET_URL}/communication/msg/conversations/${conversationId}/messages/`,
          { headers: { Authorization: `Bearer ${getCookie("access_token")}` } }
        );
        const data = await res.json();
        setMessages(data.results);
 
        if (data.results.length > 0) {
          const firstMsg = data.results[0];
          const otherId =
            firstMsg.sender_id === currentUserId
              ? firstMsg.recipient_id
              : firstMsg.sender_id;
          setOtherUserId(otherId);
        }
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };
    fetchMessages();
 
    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [open, currentUserId, conversationId, socket]);
 
  useEffect(scrollToBottom, [messages, open]);
 
  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUserId || !otherUserId) return;
 
    const msg = {
      conversation_id: conversationId,
      sender_id: currentUserId,
      recipient_id: otherUserId,
      text: newMessage.trim(),
    };
 
    socket.emit("send_message", msg);
    setNewMessage("");
  };
 
  if (!open) return null;
 
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full h-[600px] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#8a3618] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">{otherUserName}</h2>
              <p className="text-xs text-white/80">Online</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>
 
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => {
            const isMine = msg.sender_id === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[70%] break-words ${
                    isMine
                      ? "bg-[#F15A24] text-white rounded-br-md"
                      : "bg-gray-200 text-gray-900 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
 
        {/* Input */}
        <div className="p-3 border-t flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 border rounded-full px-3 py-2"
          />
          <button
            onClick={handleSendMessage}
            className="bg-[#F15A24] text-white rounded-full px-4"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
 
export default ChatConversation;