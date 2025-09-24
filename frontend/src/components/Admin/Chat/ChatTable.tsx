"use client";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageCircle,
  Users,
  Search,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useGetAdminConversationQuery } from "@/store/Slices/apiSlices/adminApiSlice";
import ErrorLoadingPage from "@/components/Element/ErrorLoadingPage";

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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

const ChatTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // RTK Query
  const { 
    data, 
    isLoading, 
    isError 
  } = useGetAdminConversationQuery({
    search: debouncedSearch || undefined,
    page: currentPage
  });

  const conversations = data?.results || [];
  const totalCount = data?.count || 0;
  const itemsPerPage = 10; // Assuming 10 items per page based on your original code
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewChat = (chatId: string) => {
    router.push(`/dashboard/chat/${chatId}`);
  };

  // Calculate start index for numbering
  const startIndex = (currentPage - 1) * itemsPerPage;

  if (isError) {
    return (
      <ErrorLoadingPage/>
    );
  }

  return (
    <div className="w-full -mt-6 px-2 sm:px-4 lg:px-0">
      {/* Header Section */}
      <div className="mb-4 md:mb-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold font-montserrat">
              Chat Sessions
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Manage trainer-student conversations ({totalCount} total)
            </p>
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by trainer, student, or subject"
              className="md:w-full w-[200px] lg:w-[250px] border-[#F15A24] pl-10 h-9"
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-md border overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table className="">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium w-12 sm:w-16">
                  No.
                </TableHead>
                <TableHead className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium min-w-[120px] sm:min-w-[150px]">
                  Teacher
                </TableHead>
                <TableHead className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium min-w-[120px] sm:min-w-[150px]">
                  Student
                </TableHead>
                <TableHead className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium min-w-[100px] sm:min-w-[130px]">
                  Subject
                </TableHead>
                <TableHead className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium hidden md:table-cell">
                  Messages
                </TableHead>
                <TableHead className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium hidden lg:table-cell">
                  Last Activity
                </TableHead>
                <TableHead className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium min-w-[80px]">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton rows
                Array.from({ length: 5 }, (_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell className="px-2 sm:px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-2 sm:px-4 py-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 animate-pulse flex-shrink-0"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                      </div>
                    </TableCell>
                    <TableCell className="px-2 sm:px-4 py-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 animate-pulse flex-shrink-0"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                      </div>
                    </TableCell>
                    <TableCell className="px-2 sm:px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-2 sm:px-4 py-3 hidden md:table-cell">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-2 sm:px-4 py-3 hidden lg:table-cell">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-2 sm:px-4 py-3">
                      <div className="h-7 sm:h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                conversations.map((conversation, index) => (
                  <TableRow key={conversation.id} className="hover:bg-gray-50 transition-colors">
                    {/* Number */}
                    <TableCell className="px-2 sm:px-4 py-3">
                      <span className="text-xs sm:text-sm font-medium">
                        {startIndex + index + 1}
                      </span>
                    </TableCell>

                    {/* Teacher */}
                    <TableCell className="px-2 sm:px-4 py-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {getInitials(conversation.teacher_name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-xs sm:text-sm truncate">
                            {conversation.teacher_name}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Student */}
                    <TableCell className="px-2 sm:px-4 py-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {getInitials(conversation.student_name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-xs sm:text-sm truncate">
                            {conversation.student_name}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Subject */}
                    <TableCell className="px-2 sm:px-4 py-3">
                      <div>
                        <p className="text-xs sm:text-sm font-medium truncate">
                          {getSubjectDisplay(conversation.subject)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Created: {formatDate(conversation.created_at)}
                        </p>
                      </div>
                    </TableCell>

                    {/* Messages - Hidden on mobile */}
                    <TableCell className="px-2 sm:px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        <span className="text-xs sm:text-sm">{conversation.message_count}</span>
                      </div>
                    </TableCell>

                    {/* Last Activity - Hidden on mobile and tablet */}
                    <TableCell className="px-2 sm:px-4 py-3 hidden lg:table-cell">
                      <p className="text-xs sm:text-sm text-gray-600">
                        {formatDate(conversation.last_activity)}
                      </p>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="px-2 sm:px-4 py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewChat(conversation.id)}
                        className="flex items-center gap-1 text-[#F15A24] border-[#F15A24] hover:bg-[#F15A24] hover:text-white h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center sm:justify-end mt-4 sm:mt-6">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const maxPages = 5;
                let pageNumber;
                
                if (totalPages <= maxPages) {
                  pageNumber = i + 1;
                } else if (currentPage <= Math.ceil(maxPages / 2)) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - Math.floor(maxPages / 2)) {
                  pageNumber = totalPages - maxPages + 1 + i;
                } else {
                  pageNumber = currentPage - Math.floor(maxPages / 2) + i;
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    className={cn(
                      "h-7 w-7 sm:h-8 sm:w-8 p-0 text-xs sm:text-sm",
                      currentPage === pageNumber
                        ? "bg-orange-500 text-white hover:bg-orange-600 border-orange-500"
                        : "hover:bg-gray-50"
                    )}
                    onClick={() => goToPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Loading indicator for pagination */}
      {isLoading && (
        <div className="flex items-center justify-center mt-4 sm:mt-6">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-gray-500">Loading...</span>
          </div>
        </div>
      )}

      {/* No data message */}
      {!isLoading && conversations.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <Users className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-gray-500">
            {debouncedSearch ? "No chat sessions found" : "No chat sessions available"}
          </p>
          {debouncedSearch && (
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Try adjusting your search terms
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatTable;