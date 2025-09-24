"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useGetConversationDetailQuery } from "@/store/Slices/apiSlices/adminApiSlice";
import Loading from "@/components/Element/Loading";
import ErrorLoadingPage from "@/components/Element/ErrorLoadingPage";

interface ChatConversationProps {
  chatId: string;
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

// Helper function to format time
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Helper function to get initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Helper function to get subject display name
const getSubjectDisplay = (subject: string) => {
  switch (subject) {
    case "virtual":
      return "Virtual Session";
    case "in_person":
      return "In-Person Session";
    default:
      return subject;
  }
};

const ChatConversation: React.FC<ChatConversationProps> = ({ chatId }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // RTK Query
  const { 
    data: conversationData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetConversationDetailQuery({
    id: chatId,
    page: currentPage
  });

  const messages = conversationData?.messages.results || [];
  const messagesInfo = conversationData?.messages;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (messagesInfo?.total_pages || 1)) {
      setCurrentPage(page);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Loading/>
    );
  }

  // Error state
  if (isError || !conversationData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <ErrorLoadingPage/>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => router.back()}>
              Go Back
            </Button>
            {isError && (
              <Button onClick={() => refetch()}>
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <div className="fixed w-[91%] md:w-[95%] p-2 top-20 border-b-2 bg-white z-10">
        <div className="flex items-center gap-3">
          <Link href={"/dashboard/chat"}>
            <Button className="rounded-full">
              <ArrowLeft />
            </Button>
          </Link>
          <h1 className="font-semibold">Back to Chat Table</h1>
        </div>

        {/* Chat Header */}
        <div className="bg-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              {/* Teacher Avatar */}
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                {getInitials(conversationData.teacher_name)}
              </div>
              {/* Student Avatar (overlapping) */}
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium -ml-3">
                {getInitials(conversationData.student_name)}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-lg truncate">
                {getSubjectDisplay(conversationData.subject)}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{conversationData.teacher_name}</span>
                <span className="text-xs">•</span>
                <span>{conversationData.student_name}</span>
                <Badge
                  variant="outline"
                  className="ml-2 text-xs bg-blue-50 text-blue-700"
                >
                  {messagesInfo?.count || 0} messages
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto md:p-4 space-y-4 mt-[120px] pb-20">
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-2 rounded-full shadow-sm">
            <Calendar className="w-4 h-4" />
            <span>
              Session started on{" "}
              {formatDate(conversationData.created_at)}
            </span>
          </div>
        </div>

        {/* Messages */}
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No messages in this conversation yet.</p>
          </div>
        ) : (
          messages.map((message) => {
            const isTeacher = message.sender_name === conversationData.teacher_name;
            const isStudent = message.sender_name === conversationData.student_name;
            
            return (
              <div key={message.id} className="w-full px-2 sm:px-4">
                <div
                  className={cn(
                    "flex gap-3 max-w-[85%] sm:max-w-[70%] mb-4",
                    isStudent ? "ml-auto justify-end" : "mr-auto justify-start" // Student right, Teacher left
                  )}
                >
                  {/* Avatar - positioned based on sender */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0",
                      isStudent ? "bg-[#F15A24] order-2" : "bg-blue-500 order-1" // Student orange, Teacher blue
                    )}
                  >
                    {getInitials(message.sender_name)}
                  </div>

                  <div
                    className={cn(
                      "flex flex-col gap-1 flex-1",
                      isStudent ? "items-end order-1" : "items-start order-2"
                    )}
                  >
                    {/* Message info */}
                    <div className={cn(
                      "flex items-center gap-2 text-xs text-gray-500",
                      isStudent ? "flex-row-reverse" : "flex-row"
                    )}>
                      <span className="font-medium">{message.sender_name}</span>
                      <span>{formatTime(message.created_at)}</span>
                      <div className="flex items-center gap-1">
                        {message.delivered && (
                          <span className="text-green-500">✓</span>
                        )}
                        {message.read && (
                          <span className="text-blue-500">✓</span>
                        )}
                      </div>
                    </div>

                    {/* Message bubble */}
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 max-w-full break-words shadow-sm",
                        isStudent
                          ? "bg-[#F15A24] text-white rounded-br-md" // Student - Right side - Orange
                          : "bg-blue-500 text-white rounded-bl-md" // Teacher - Left side - Blue
                      )}
                    >
                      {message.content.includes("```") ? (
                        <div className="space-y-2">
                          {message.content.split("\n\n").map((part, partIndex) =>
                            part.includes("```") ? (
                              <pre
                                key={partIndex}
                                className={cn(
                                  "p-3 rounded-md text-sm overflow-x-auto",
                                  isStudent 
                                    ? "bg-orange-800 text-orange-100" 
                                    : "bg-blue-800 text-blue-100"
                                )}
                              >
                                <code>
                                  {part
                                    .replace(/```jsx?\n?/g, "")
                                    .replace(/```/g, "")}
                                </code>
                              </pre>
                            ) : (
                              <p key={partIndex}>{part}</p>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>

                    {/* Message role indicator */}
                    <div className={cn(
                      "text-xs text-gray-400 mt-1",
                      isStudent ? "text-right" : "text-left"
                    )}>
                      {isTeacher ? "Teacher" : "Student"} • @{message.sender_username}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Pagination Footer */}
      {messagesInfo && messagesInfo.total_pages > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(messagesInfo.total_pages, 5) }, (_, i) => {
                const maxPages = 5;
                let pageNumber;
                
                if (messagesInfo.total_pages <= maxPages) {
                  pageNumber = i + 1;
                } else if (currentPage <= Math.ceil(maxPages / 2)) {
                  pageNumber = i + 1;
                } else if (currentPage >= messagesInfo.total_pages - Math.floor(maxPages / 2)) {
                  pageNumber = messagesInfo.total_pages - maxPages + 1 + i;
                } else {
                  pageNumber = currentPage - Math.floor(maxPages / 2) + i;
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    className={cn(
                      "h-8 w-8 p-0 text-sm",
                      currentPage === pageNumber
                        ? "bg-[#F15A24] text-white hover:bg-[#F15A24]/90 border-[#F15A24]"
                        : "hover:bg-gray-50"
                    )}
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={isLoading}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === messagesInfo.total_pages || isLoading}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="ml-4 text-sm text-gray-600">
              Page {currentPage} of {messagesInfo.total_pages}
              <span className="ml-2 text-xs">
                ({messagesInfo.count} total messages)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatConversation;