"use client";
import React, { useState } from "react";
import TrainerBookingCard from "@/components/Element/TrainerBookingCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useGetTrainerBookingsQuery } from "@/store/Slices/apiSlices/trainerApiSlice";
import Loading from "@/components/Element/Loading";
import ErrorLoadingPage from "@/components/Element/ErrorLoadingPage";
import NoDataFound from "@/components/Element/NoDataFound";

function BookingsSection() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5; // sessions per page

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const { data, isLoading, isError } = useGetTrainerBookingsQuery();

  console.log("bookings details:", data)

  const trainerBookingData = data?.results ?? [];

   if(isLoading) return <Loading/>
  if(isError) return <ErrorLoadingPage/>



  if (trainerBookingData?.length === 0) {
    return (
      <>
        <NoDataFound/>
      </>
    );
  }
  // Filter logic
  const filteredData =
    statusFilter === "all"
      ? trainerBookingData
      : trainerBookingData?.filter((item) => item.status === statusFilter);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

 

  return (
    <div>
      {/* Header + Filter */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl">All Booked Sessions</h2>
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            setCurrentPage(1); // reset to first page when filter changes
          }}
        >
          <SelectTrigger className="w-48 text-[#F15A24]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-[#F15A24]" value="all">
              All
            </SelectItem>
            <SelectItem className="text-[#F15A24]" value="Ongoing">
              On Going
            </SelectItem>
            <SelectItem className="text-[#F15A24]" value="Upcomming">
              Up Comming
            </SelectItem>
            <SelectItem className="text-[#F15A24]" value="Completed">
              Completed
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Session Cards */}
      <div className="space-y-4">
        {paginatedData.map((item) => (
          <TrainerBookingCard key={item.id} {...item} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-6 space-x-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      )}
    </div>
  );
}

export default BookingsSection;
