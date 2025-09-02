"use client";
import React, { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { chatSessions } from "@/data/ChatData";

// Dummy data for chat sessions

// Badge colors for status
const getStatusStyles = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
    case "Completed":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
    case "Paused":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200";
  }
};

const ChatTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const itemsPerPage = 10;

  // Filter data based on status
  const filteredData = chatSessions.filter(
    (session) =>
      session.trainerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewChat = (chatId: string) => {
    router.push(`/dashboard/chat/${chatId}`);
  };

  return (
    <div className="w-full -mt-6">
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold font-montserrat">
            Chat Sessions
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage trainer-student conversations
          </p>
        </div>
        <div className="relative">
          <Search stroke="#808080" className="absolute top-1 left-1" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by trainer or student"
            className="w-full sm:w-[250px] border-[#F15A24] pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 md:px-4 py-3 min-w-[150px]">
                  No.
                </TableHead>
                <TableHead className="px-4 md:px-8 py-3 min-w-[150px]">
                  Trainer
                </TableHead>
                <TableHead className="px-4 md:px-8 py-3 min-w-[150px]">
                  Student
                </TableHead>
                <TableHead className="px-4 md:px-8 py-3 min-w-[130px]">
                  Subject
                </TableHead>
                <TableHead className="px-4 md:px-4 py-3 hidden sm:table-cell">
                  Messages
                </TableHead>
                <TableHead className="px-4 md:px-4 py-3 hidden md:table-cell">
                  Last Activity
                </TableHead>
                <TableHead className="px-4 md:px-8 py-3">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((session, index) => (
                <TableRow key={session.chat_id} className="hover:bg-gray-50">
                  <TableCell className="px-4 md:px-6 py-3">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-4 md:px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
                        {session.trainerAvatar}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">
                          {session.trainerName}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 md:px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-medium">
                        {session.studentAvatar}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">
                          {session.studentName}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 md:px-6 py-3">
                    <p className="text-sm font-medium truncate">
                      {session.subject}
                    </p>
                    <p className="text-xs text-gray-500 hidden sm:block">
                      {session.duration}
                    </p>
                  </TableCell>
                  <TableCell className="px-4 md:px-6 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{session.messageCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 md:px-6 py-3 hidden md:table-cell">
                    <p className="text-sm text-gray-600">
                      {session.lastActivity}
                    </p>
                  </TableCell>
                  <TableCell className="px-4 md:px-6 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewChat(session.chat_id)} // Use session.chat_id here
                      className="flex items-center gap-1 text-[#F15A24] border-[#F15A24] hover:bg-[#F15A24] hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center sm:justify-end mt-4">
          <div className="flex items-center gap-2">
            {/* Prev */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page Numbers */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  className={cn(
                    "h-8 w-8 text-sm",
                    currentPage === pageNumber
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : ""
                  )}
                  onClick={() => goToPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}

            {/* Next */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* No data message */}
      {filteredData.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No chat sessions found</p>
        </div>
      )}
    </div>
  );
};

export default ChatTable;
