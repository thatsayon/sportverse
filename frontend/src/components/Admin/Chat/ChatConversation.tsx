"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { chatSessionsData } from "@/data/ChatData";

interface ChatConversationProps {
  chatId: string;
}

const ChatConversation: React.FC<ChatConversationProps> = ({ chatId }) => {
  const router = useRouter();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get chat data based on chatId
  const chatData = chatSessionsData.find(session => session.chat_id === chatId);

  useEffect(() => {
    if (chatData) {
      setMessages(chatData.messages);
    }
  }, [chatData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: "trainer", // Assuming current user is trainer
        senderName: chatData?.trainerName || "You",
        message: newMessage,
        timestamp: new Date().toISOString(),
        timeDisplay: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!chatData) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Chat not found</h2>
          <p className="text-gray-600 mb-4">
            The requested chat session does not exist.
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen -mt-6">
      <div className="flex items-center gap-3">
        <Link href={"/dashboard/chat"}>
        <Button className="rounded-full"><ArrowLeft/></Button>
      </Link>
      <h1 className="font-semibold">Back to Chat Table</h1>
      </div>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3">
            {/* Trainer Avatar */}
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
              {chatData.trainerAvatar}
            </div>
            {/* Student Avatar (overlapping) */}
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium -ml-3 border-2 border-white">
              {chatData.studentAvatar}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-lg truncate">
              {chatData.subject}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{chatData.trainerName}</span>
              <span className="text-xs">•</span>
              <span>{chatData.studentName}</span>
              <Badge
                variant="outline"
                className="ml-2 text-xs bg-green-50 text-green-700 border-green-200"
              >
                {chatData.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-2 rounded-full shadow-sm">
            <Calendar className="w-4 h-4" />
            <span>
              Session started on{" "}
              {new Date(chatData.startDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 max-w-[85%] sm:max-w-[70%]",
              message.sender === "trainer"
                ? "ml-auto flex-row-reverse"
                : "mr-auto"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0",
                message.sender === "trainer" ? "bg-[#F15A24]" : "bg-green-500"
              )}
            >
              {message.sender === "trainer"
                ? chatData.trainerAvatar
                : chatData.studentAvatar}
            </div>

            <div
              className={cn(
                "flex flex-col gap-1",
                message.sender === "trainer" ? "items-end" : "items-start"
              )}
            >
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-medium">{message.senderName}</span>
                <span>{message.timeDisplay}</span>
              </div>

              <div
                className={cn(
                  "rounded-2xl px-4 py-3 max-w-full break-words",
                  message.sender === "trainer"
                    ? "bg-[#F15A24] text-white rounded-br-md"
                    : "bg-white text-gray-900 border border-gray-200 rounded-bl-md shadow-sm"
                )}
              >
                {message.message.includes("```") ? (
                  <div className="space-y-2">
                    {message.message.split("\n\n").map((part, index) =>
                      part.includes("```") ? (
                        <pre
                          key={index}
                          className="bg-gray-800 text-green-400 p-3 rounded-md text-sm overflow-x-auto"
                        >
                          <code>
                            {part
                              .replace(/```jsx?\n?/g, "")
                              .replace(/```/g, "")}
                          </code>
                        </pre>
                      ) : (
                        <p key={index}>{part}</p>
                      )
                    )}
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{message.message}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      {/* <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="pr-12 py-3 rounded-full border-gray-300 focus:border-blue-500 resize-none"
                rows={1}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hidden sm:flex"
                >
                  <Paperclip className="h-4 w-4 text-gray-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hidden sm:flex"
                >
                  <Smile className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 flex-shrink-0"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div> */}
    </div>
  );
};

export default ChatConversation;
