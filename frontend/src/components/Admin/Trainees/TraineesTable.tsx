"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dummy trainer data (you can import this from your data source)
import { traineeData } from "@/data/TraineesData";
import { traineeDataType } from "@/data/TraineesData";
import { Badge } from "@/components/ui/badge";

const TraineesTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterSports, setFilterSports] = useState<string>("All");
  const [filterSubscriptionType, setFilterSubscriptionType] =
    useState<string>("All");

  const itemsPerPage = 10;

  // Filter data based on sports and subscription_type
  const filteredData = traineeData.filter((trainee) => {
    const matchesSports =
      filterSports === "All" || trainee.sports === filterSports;
    const matchesSubscriptionType =
      filterSubscriptionType === "All" ||
      trainee.subscription_type === filterSubscriptionType;
    return matchesSports && matchesSubscriptionType;
  });

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

  return (
    <div className="w-full">
      <div className="mb-4 md:mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold font-montserrat">
            All Trainee Data
          </h1>
        </div>
        <div className="flex gap-4">
          {/* Filter by Sport */}
          <Select value={filterSports} onValueChange={setFilterSports}>
            <SelectTrigger className="text-[#F15A24] border-[#F15A24] w-[130px]">
              <SelectValue placeholder="Filter by Sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Sports</SelectItem>
              <SelectItem value="Football">Football</SelectItem>
              <SelectItem value="Basketball">Basketball</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter by Subscription Type */}
          <Select
            value={filterSubscriptionType}
            onValueChange={setFilterSubscriptionType}
          >
            <SelectTrigger className="text-[#F15A24] border-[#F15A24] w-[130px]">
              <SelectValue placeholder="Filter by Subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Subscriptions</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-4">No</TableHead>
              <TableHead className="px-6 py-4">Name</TableHead>
              <TableHead className="px-6 py-4">Username</TableHead>
              <TableHead className="px-6 py-4">Sports</TableHead>
              <TableHead className="px-6 py-4">Total Sessions</TableHead>
              <TableHead className="px-6 py-4">Total Spent</TableHead>
              <TableHead className="px-6 py-4">Subscription Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((trainee: traineeDataType, index: number) => (
              <TableRow key={trainee.id}>
                <TableCell className="px-6 py-4">{index + 1}</TableCell>
                <TableCell className="px-6 py-4">{trainee.name}</TableCell>
                <TableCell className="px-6 py-4">{trainee.username}</TableCell>
                <TableCell className="px-6 py-4">{trainee.sports}</TableCell>
                <TableCell className="px-6 py-4">
                  {trainee.total_sessions}
                </TableCell>
                <TableCell className="px-6 py-4">
                  ${trainee.total_spent}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    variant="outline"
                    className={
                      trainee.subscription_type === "pro"
                        ? "bg-[#F15A24] text-white"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {trainee.subscription_type}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end mt-4 md:mt-8">
        <div className="flex items-center gap-2">
          {/* Prev */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              className={cn(
                "w-10 h-10",
                currentPage === page
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : ""
              )}
              onClick={() => goToPage(page)}
            >
              {page}
            </Button>
          ))}

          {/* Next */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TraineesTable;
