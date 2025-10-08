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
import { useGetBookingsQuery } from "@/store/Slices/apiSlices/studentApiSlice";
import ErrorLoadingPage from "../Element/ErrorLoadingPage";
import { Button } from "../ui/button";
import Link from "next/link";

function ProfileBookings() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5; // sessions per page

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const { data } = useGetBookingsQuery();

  //console.log("booking data:", data)

  const trainerBookingData = data?.results ?? [];

  if (trainerBookingData?.length === 0) {
    return (
      <>
        <ErrorLoadingPage/>
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
    <div className="max-w-7xl mx-auto my-8">
        <div className="mb-4 text-end">
            <Link href={"/student/bookings"}>
            <Button>
                View All
            </Button>
            </Link>
        </div>

      {/* Session Cards */}
      <div className="space-y-4 ">
        {paginatedData.slice(0,3).map((item) => (
          <TrainerBookingCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

export default ProfileBookings;
